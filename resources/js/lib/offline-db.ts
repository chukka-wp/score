import { type DBSchema, type IDBPDatabase, openDB } from 'idb';

import type { QueuedEvent } from '@/types';

interface ChukkaScoreDB extends DBSchema {
    'event-queue': {
        key: string;
        value: QueuedEvent;
        indexes: {
            'by-match': string;
            'by-created': number;
            'by-status': string;
        };
    };
}

let dbPromise: Promise<IDBPDatabase<ChukkaScoreDB>> | null = null;

function getDb(): Promise<IDBPDatabase<ChukkaScoreDB>> {
    if (!dbPromise) {
        dbPromise = openDB<ChukkaScoreDB>('chukka-score', 1, {
            upgrade(db) {
                const store = db.createObjectStore('event-queue', { keyPath: 'local_id' });
                store.createIndex('by-match', 'match_id');
                store.createIndex('by-created', 'created_at');
                store.createIndex('by-status', 'status');
            },
        });
    }

    return dbPromise;
}

export async function enqueueEvent(event: QueuedEvent): Promise<void> {
    const db = await getDb();
    await db.put('event-queue', event);
}

export async function dequeueEvent(localId: string): Promise<void> {
    const db = await getDb();
    await db.delete('event-queue', localId);
}

export async function getPendingEvents(matchId: string): Promise<QueuedEvent[]> {
    const db = await getDb();
    const all = await db.getAllFromIndex('event-queue', 'by-match', matchId);

    return all
        .filter((e) => e.status === 'pending' || e.status === 'sending')
        .sort((a, b) => a.created_at - b.created_at);
}

export async function getPendingCount(matchId: string): Promise<number> {
    const events = await getPendingEvents(matchId);

    return events.length;
}

export async function updateEventStatus(
    localId: string,
    status: QueuedEvent['status'],
    error?: string,
): Promise<void> {
    const db = await getDb();
    const event = await db.get('event-queue', localId);

    if (event) {
        event.status = status;

        if (error) {
            event.error = error;
        }

        await db.put('event-queue', event);
    }
}
