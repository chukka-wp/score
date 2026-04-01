/**
 * Chukka Score — Service Worker
 *
 * Caching strategies:
 *   - Navigation:       NetworkFirst → cached page → /offline.html
 *   - /build/assets/*:  CacheFirst  (content-hashed, immutable)
 *   - /icons/*, static: CacheFirst
 *   - /api/*, /broadcasting/*: network-only (offline queue handles failures)
 */

const CACHE_VERSION = 'chukka-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGES_CACHE = `${CACHE_VERSION}-pages`;
const ASSETS_CACHE = `${CACHE_VERSION}-assets`;

const PRECACHE_URLS = ['/offline.html'];

// ── Install ──────────────────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
    );
    self.skipWaiting();
});

// ── Activate — clean old caches ──────────────────────────────────────────────

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => !key.startsWith(CACHE_VERSION))
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// ── Fetch ────────────────────────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip API and broadcasting — offline queue handles these
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/broadcasting/')) {
        return;
    }

    // Navigation requests — NetworkFirst with offline fallback
    if (request.mode === 'navigate') {
        event.respondWith(networkFirstWithFallback(request));
        return;
    }

    // Vite build assets — CacheFirst (content-hashed = immutable)
    if (url.pathname.startsWith('/build/assets/')) {
        event.respondWith(cacheFirst(request, ASSETS_CACHE));
        return;
    }

    // Static assets (icons, manifest, favicons)
    if (
        url.pathname.startsWith('/icons/') ||
        url.pathname.startsWith('/favicon') ||
        url.pathname === '/apple-touch-icon.png' ||
        url.pathname === '/manifest.webmanifest'
    ) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
        return;
    }
});

// ── Caching strategies ───────────────────────────────────────────────────────

async function networkFirstWithFallback(request) {
    try {
        const response = await fetch(request);

        if (response.ok) {
            const cache = await caches.open(PAGES_CACHE);
            cache.put(request, response.clone());
        }

        return response;
    } catch {
        const cached = await caches.match(request);

        if (cached) {
            return cached;
        }

        return caches.match('/offline.html');
    }
}

async function cacheFirst(request, cacheName) {
    const cached = await caches.match(request);

    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);

        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }

        return response;
    } catch {
        return new Response('', { status: 503, statusText: 'Service Unavailable' });
    }
}

// ── FLUSH_QUEUE message relay ────────────────────────────────────────────────

self.addEventListener('message', (event) => {
    if (event.data?.type === 'FLUSH_QUEUE') {
        notifyClients();
    }
});

async function notifyClients() {
    const clients = await self.clients.matchAll({ type: 'window' });

    for (const client of clients) {
        client.postMessage({ type: 'FLUSH_QUEUE' });
    }
}
