// Service Worker - only cache static images; never cache HTML/CSS/JS (prevents distorted UI after deploys)
const CACHE_NAME = 'insurance-crm-v2'
const STATIC_ASSETS = ['/logo.svg', '/elezenx-logo.svg', '/agent-avatar.svg', '/logos/placeholder-logo.svg']

// Install - cache only static images
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => {})
  )
})

// Fetch - network-first for HTML/CSS/JS; cache-only for static images
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  const isStaticAsset = /\.(svg|png|jpg|jpeg|gif|ico|woff2?)$/i.test(url.pathname)

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    )
  } else {
    // Always fetch fresh HTML, CSS, JS from network (no cache)
    event.respondWith(fetch(event.request))
  }
})

// Activate - remove old caches (v1) so users get fresh assets
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
  )
})


