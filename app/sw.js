/* Service worker — makes the wiki installable and usable offline.
   Strategy:
   - navigations + notes-data.js  -> network-first (fresh when online, cached offline)
   - everything else (css/js/fonts/icons/CDN) -> stale-while-revalidate
   Bump CACHE when you change this file or want to drop old caches. */
const CACHE = "ipw-cache-v4";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function networkFirst(req) {
  return fetch(req)
    .then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    })
    .catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")));
}

function staleWhileRevalidate(req) {
  return caches.open(CACHE).then((cache) =>
    cache.match(req).then((cached) => {
      const fetching = fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || fetching;
    })
  );
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // never cache Firebase data/auth traffic — it manages its own offline store
  if (/firestore\.googleapis|firebaseio|identitytoolkit|googleapis\.com\/identitytoolkit|securetoken/.test(url.href)) {
    return; // let the network/Firebase SDK handle it
  }

  const isNavigation = req.mode === "navigate";
  const isData = url.pathname.endsWith("/notes-data.js") || url.pathname.endsWith("notes-data.js");

  if (isNavigation || isData) {
    e.respondWith(networkFirst(req));
  } else {
    e.respondWith(staleWhileRevalidate(req));
  }
});
