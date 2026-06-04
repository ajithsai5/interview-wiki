/* ============================================================
   Progress store with optional cross-device sync.

   Backends (auto-detected, all optional):
   - SELF-HOSTED  : if sync-config.js sets `endpoint` (your sync.php URL).
                    You "Sign in" once per device with your sync passphrase.
                    Offline-capable: changes queue locally and flush when online.
   - FIREBASE     : if firebase-config.js holds real values (alternative backend).
   - LOCAL-ONLY   : neither configured -> progress lives in this browser only.

   Always keeps a localStorage copy, so it works instantly and offline.
   app.js talks ONLY to window.IPWStore.
   ============================================================ */
(function () {
  "use strict";

  var LS_KEY = "ipw:progress";       // { id: {status, reviewed, updatedAt} }
  var PENDING_KEY = "ipw:pending";   // { id: true } not-yet-pushed (server mode)
  var KEY_KEY = "ipw:synckey";       // the sync passphrase (server mode, per device)
  var POLL_MS = 25000;

  var local = loadJSON(LS_KEY, {});
  var pending = loadJSON(PENDING_KEY, {});
  var listeners = [];
  var authListeners = [];
  var user = null;                   // truthy when a backend session is active

  // firebase handles (set up only if configured)
  var fb = null, db = null, auth = null, unsub = null;

  function loadJSON(k, def) { try { return JSON.parse(localStorage.getItem(k)) || def; } catch (e) { return def; } }
  function saveJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function persist() { saveJSON(LS_KEY, local); }
  function persistPending() { saveJSON(PENDING_KEY, pending); }
  function emit() { listeners.forEach(function (cb) { try { cb(); } catch (e) {} }); }
  function emitAuth() { authListeners.forEach(function (cb) { try { cb(user); } catch (e) {} }); }

  // ---- backend detection ----
  function firebaseConfigured() {
    var c = window.FIREBASE_CONFIG;
    return !!(c && c.apiKey && c.apiKey.indexOf("PASTE") !== 0 && c.projectId && c.projectId.indexOf("PASTE") !== 0);
  }
  function serverEndpoint() { return (window.SYNC_CONFIG && window.SYNC_CONFIG.endpoint) || ""; }
  function serverConfigured() { return !!serverEndpoint(); }
  function syncKey() { try { return localStorage.getItem(KEY_KEY) || ""; } catch (e) { return ""; } }
  function serverActive() { return serverConfigured() && !!syncKey(); }

  // ---- merge helper (last-write-wins by updatedAt) ----
  function mergeRemote(docs) {
    var changed = false;
    (docs || []).forEach(function (r) {
      if (!r || !r.id) return;
      var cur = local[r.id];
      var rT = r.updatedAt || 0, cT = (cur && cur.updatedAt) || 0;
      if (!cur || rT >= cT) {
        local[r.id] = { status: r.status, reviewed: r.reviewed || 0, updatedAt: rT };
        changed = true;
      }
    });
    if (changed) { persist(); emit(); }
  }

  // ============================================================
  // Self-hosted (PHP) backend
  // ============================================================
  function serverRequest(method, bodyObj) {
    var opts = { method: method, headers: { "X-Sync-Key": syncKey() } };
    if (bodyObj) { opts.headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(bodyObj); }
    return fetch(serverEndpoint(), opts).then(function (res) {
      if (res.status === 401) { var e = new Error("unauthorized"); e.code = 401; throw e; }
      if (!res.ok) { var e2 = new Error("http " + res.status); e2.code = res.status; throw e2; }
      return res.json().catch(function () { return {}; });
    });
  }

  function serverPull() {
    if (!serverActive()) return Promise.resolve();
    return serverRequest("GET").then(function (data) { mergeRemote(data && data.progress); });
  }

  function serverPush(recs) {
    return serverRequest("POST", { progress: recs });
  }

  function enqueue(id) { pending[id] = true; persistPending(); }

  function flush() {
    if (!serverActive()) return Promise.resolve();
    var ids = Object.keys(pending);
    if (!ids.length) return Promise.resolve();
    var recs = ids.map(function (id) {
      var r = local[id] || {};
      return { id: id, status: r.status, reviewed: r.reviewed || 0, updatedAt: r.updatedAt || 0 };
    });
    return serverPush(recs).then(function () {
      ids.forEach(function (id) { delete pending[id]; });
      persistPending();
    }).catch(function (e) {
      if (e && e.code === 401) onBadKey();
      // network error -> keep pending for next time
    });
  }

  function syncCycle() {
    if (!serverActive() || (typeof navigator !== "undefined" && navigator.onLine === false)) return;
    serverPull().catch(function (e) { if (e && e.code === 401) onBadKey(); });
    flush();
  }

  function onBadKey() {
    try { localStorage.removeItem(KEY_KEY); } catch (e) {}
    user = null; emitAuth();
    console.warn("[sync] sync key rejected — sign in again");
  }

  var pollTimer = null;
  function startServer() {
    user = { name: "Synced", server: true };
    emitAuth();
    syncCycle();
    if (!pollTimer) {
      pollTimer = setInterval(syncCycle, POLL_MS);
      window.addEventListener("online", syncCycle);
    }
  }

  function connectServer() {
    var key = window.prompt("Enter your sync passphrase (the SYNC_KEY you set in config.php):");
    if (!key) return Promise.resolve(false);
    try { localStorage.setItem(KEY_KEY, key.trim()); } catch (e) {}
    // validate by pulling once; also push anything local so nothing is lost
    return serverPull().then(function () {
      Object.keys(local).forEach(function (id) { pending[id] = true; });
      persistPending();
      startServer();
      return true;
    }).catch(function (e) {
      if (e && e.code === 401) { onBadKey(); throw new Error("Wrong passphrase"); }
      // offline now? keep the key and start anyway; it'll sync later
      startServer();
      return true;
    });
  }

  function disconnectServer() {
    try { localStorage.removeItem(KEY_KEY); } catch (e) {}
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    user = null; emitAuth();
    return Promise.resolve();
  }

  // ============================================================
  // Firebase backend (alternative; dormant unless configured)
  // ============================================================
  function progressCol() { return db.collection("users").doc(user.uid).collection("progress"); }

  function initFirebase() {
    try {
      fb = window.firebase;
      fb.initializeApp(window.FIREBASE_CONFIG);
      db = fb.firestore();
      auth = fb.auth();
      db.enablePersistence({ synchronizeTabs: true }).catch(function () {});
      auth.onAuthStateChanged(function (u) {
        user = u || null;
        if (unsub) { unsub(); unsub = null; }
        if (user) {
          Object.keys(local).forEach(function (id) {
            var r = local[id];
            progressCol().doc(id).set({ status: r.status, reviewed: r.reviewed || 0, updatedAt: r.updatedAt || r.reviewed || 0 }, { merge: true }).catch(function () {});
          });
          unsub = progressCol().onSnapshot(function (snap) {
            var docs = [];
            snap.forEach(function (d) { var v = d.data() || {}; docs.push({ id: d.id, status: v.status, reviewed: v.reviewed, updatedAt: v.updatedAt }); });
            mergeRemote(docs);
          }, function (err) { console.warn("[sync] firebase listen:", err && err.code); });
        }
        emitAuth();
      });
    } catch (e) {
      console.warn("[sync] firebase init failed; local-only:", e && e.message);
      db = null; auth = null;
    }
  }

  // ============================================================
  // Public API
  // ============================================================
  var mode = firebaseConfigured() ? "firebase" : (serverConfigured() ? "server" : "local");

  var Store = {
    get: function (id) { return local[id]; },
    all: function () { return local; },

    setStatus: function (id, status) {
      var rec = { status: status, reviewed: Date.now(), updatedAt: Date.now() };
      local[id] = rec; persist(); emit();
      if (mode === "firebase" && db && user) {
        progressCol().doc(id).set(rec).catch(function () {});
      } else if (mode === "server" && serverActive()) {
        serverPush([{ id: id, status: rec.status, reviewed: rec.reviewed, updatedAt: rec.updatedAt }])
          .catch(function (e) { if (e && e.code === 401) onBadKey(); else enqueue(id); });
      }
    },

    clearAll: function () {
      var ids = Object.keys(local);
      local = {}; persist(); emit();
      if (mode === "firebase" && db && user) {
        ids.forEach(function (id) { progressCol().doc(id).delete().catch(function () {}); });
      }
      // server mode: clears this device; the server table keeps values until
      // overwritten (documented). Pending is cleared so we don't re-push.
      pending = {}; persistPending();
    },

    subscribe: function (cb) { listeners.push(cb); },

    auth: {
      mode: mode,
      available: function () { return mode === "firebase" || mode === "server"; },
      current: function () { return user; },
      signIn: function () {
        if (mode === "firebase" && auth) return auth.signInWithPopup(new fb.auth.GoogleAuthProvider());
        if (mode === "server") return connectServer();
        return Promise.resolve();
      },
      signOut: function () {
        if (mode === "firebase" && auth) return auth.signOut();
        if (mode === "server") return disconnectServer();
        return Promise.resolve();
      },
      onChange: function (cb) { authListeners.push(cb); }
    }
  };

  // ---- init ----
  if (mode === "firebase" && window.firebase) {
    initFirebase();
  } else if (mode === "server" && serverActive()) {
    startServer();   // resume an existing session on this device
  }

  window.IPWStore = Store;
})();
