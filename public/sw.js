// Snippt Service Worker — bewusst minimal und konservativ.
//
// Strategie: NETWORK-FIRST. Es wird nichts Dynamisches dauerhaft gecacht,
// damit die Live-Reihe nie veraltet angezeigt wird. Der Cache dient nur als
// Offline-Fallback (eine einfache Offline-Seite) und für versionierte,
// unveränderliche Build-Assets.

const CACHE = 'snippt-v1'
const OFFLINE_URL = '/offline'

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add(OFFLINE_URL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Seitenaufrufe: immer frisch aus dem Netz; nur bei Offline die Offline-Seite.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)))
    return
  }

  // Versionierte Build-Assets (unveränderlich): cache-first für schnellen Start.
  if (url.origin === self.location.origin && url.pathname.startsWith('/_next/static')) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(request, copy))
            return res
          }),
      ),
    )
    return
  }

  // Alles andere (Daten, RPCs, Server Actions): unverändert durchlassen.
})
