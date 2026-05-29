/* ============================================================
   Progress store with optional cross-device sync.

   - Always keeps a localStorage copy (instant, offline, works with no setup).
   - If firebase-config.js holds real values AND you're signed in, progress also
     syncs to Firestore: mark a status on your phone and it shows on the laptop
     (and vice-versa), offline-capable, reconciled on reconnect (latest wins).

   Exposes window.IPWStore — app.js talks to this, never to localStorage/Firebase
   directly.
   ============================================================ */
(function () {
  "use strict";

  var LS_KEY = "ipw:progress";              // same key app.js used before
  var local = load();                        // { id: {status, reviewed, updatedAt} }
  var listeners = [];
  var authListeners = [];

  var fb = null, db = null, auth = null, user = null, unsub = null;

  function load() { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { return {}; } }
  function persist() { try { localStorage.setItem(LS_KEY, JSON.stringify(local)); } catch (e) {} }
  function emit() { listeners.forEach(function (cb) { try { cb(); } catch (e) {} }); }
  function emitAuth() { authListeners.forEach(function (cb) { try { cb(user); } catch (e) {} }); }

  function configured() {
    var c = window.FIREBASE_CONFIG;
    return !!(c && c.apiKey && c.apiKey.indexOf("PASTE") !== 0 && c.projectId &&
              c.projectId.indexOf("PASTE") !== 0);
  }

  // ---------- public API ----------
  var Store = {
    get: function (id) { return local[id]; },
    all: function () { return local; },

    setStatus: function (id, status) {
      var rec = { status: status, reviewed: Date.now(), updatedAt: Date.now() };
      local[id] = rec; persist(); emit();
      if (db && user) {
        progressCol().doc(id).set(rec)
          .catch(function (e) { console.warn("[sync] write queued/offline:", e && e.code); });
      }
    },

    clearAll: function () {
      var ids = Object.keys(local);
      local = {}; persist(); emit();
      if (db && user) {
        ids.forEach(function (id) { progressCol().doc(id).delete().catch(function () {}); });
      }
    },

    subscribe: function (cb) { listeners.push(cb); },

    auth: {
      available: function () { return configured(); },
      current: function () { return user; },
      signIn: function () {
        if (auth) { return auth.signInWithPopup(new fb.auth.GoogleAuthProvider()); }
      },
      signOut: function () { if (auth) { return auth.signOut(); } },
      onChange: function (cb) { authListeners.push(cb); }
    }
  };

  function progressCol() {
    return db.collection("users").doc(user.uid).collection("progress");
  }

  // remote -> local merge, latest-write-wins by updatedAt
  function mergeRemote(docs) {
    var changed = false;
    docs.forEach(function (r) {
      var cur = local[r.id];
      var rT = r.updatedAt || 0, cT = (cur && cur.updatedAt) || 0;
      if (!cur || rT >= cT) {
        local[r.id] = { status: r.status, reviewed: r.reviewed || 0, updatedAt: rT };
        changed = true;
      }
    });
    if (changed) { persist(); emit(); }
  }

  // on sign-in, push any local-only progress up so existing marks aren't lost
  function pushLocalToRemote() {
    Object.keys(local).forEach(function (id) {
      var r = local[id];
      progressCol().doc(id).set({
        status: r.status,
        reviewed: r.reviewed || 0,
        updatedAt: r.updatedAt || r.reviewed || Date.now()
      }, { merge: true }).catch(function () {});
    });
  }

  function initFirebase() {
    if (!configured() || !window.firebase) return;
    try {
      fb = window.firebase;
      fb.initializeApp(window.FIREBASE_CONFIG);
      db = fb.firestore();
      auth = fb.auth();
      // offline cache so it works with no Wi-Fi and syncs on reconnect
      db.enablePersistence({ synchronizeTabs: true }).catch(function () {});

      auth.onAuthStateChanged(function (u) {
        user = u || null;
        if (unsub) { unsub(); unsub = null; }
        if (user) {
          pushLocalToRemote();
          unsub = progressCol().onSnapshot(function (snap) {
            var docs = [];
            snap.forEach(function (d) {
              var v = d.data() || {};
              docs.push({ id: d.id, status: v.status, reviewed: v.reviewed, updatedAt: v.updatedAt });
            });
            mergeRemote(docs);
          }, function (err) { console.warn("[sync] listen error:", err && err.code); });
        }
        emitAuth();
      });
    } catch (e) {
      console.warn("[sync] Firebase init failed; running local-only:", e && e.message);
      db = null; auth = null;
    }
  }

  window.IPWStore = Store;
  initFirebase();
})();
