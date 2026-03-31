/// <reference lib="webworker" />

export type {};
declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
    if (event.data?.type === 'FLUSH_QUEUE') {
        notifyClients();
    }
});

async function notifyClients(): Promise<void> {
    const clients = await self.clients.matchAll({ type: 'window' });

    for (const client of clients) {
        client.postMessage({ type: 'FLUSH_QUEUE' });
    }
}
