import { useCallback, useEffect, useRef, useState } from 'react';

import { dequeueEvent, enqueueEvent, getPendingCount, getPendingEvents, updateEventStatus } from '@/lib/offline-db';
import type { EventType, QueuedEvent, SyncStatus } from '@/types';

type UseOfflineQueueReturn = {
    enqueue: (event: {
        type: EventType;
        period: number;
        period_clock_seconds: number;
        payload: Record<string, unknown>;
    }) => Promise<string>;
    pendingCount: number;
    syncStatus: SyncStatus;
    flush: () => Promise<void>;
};

export function useOfflineQueue(matchId: string, scorerToken: string): UseOfflineQueueReturn {
    const [pendingCount, setPendingCount] = useState(0);
    const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const flushingRef = useRef(false);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const refreshCount = useCallback(async () => {
        const count = await getPendingCount(matchId);
        setPendingCount(count);
    }, [matchId]);

    useEffect(() => {
        refreshCount();
    }, [refreshCount]);

    const postEvent = useCallback(
        async (event: QueuedEvent): Promise<boolean> => {
            try {
                await updateEventStatus(event.local_id, 'sending');

                const response = await fetch(`/api/matches/${matchId}/events`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${scorerToken}`,
                    },
                    body: JSON.stringify({
                        type: event.type,
                        period: event.period,
                        period_clock_seconds: event.period_clock_seconds,
                        payload: event.payload,
                    }),
                });

                if (response.ok) {
                    await dequeueEvent(event.local_id);
                    await refreshCount();

                    return true;
                }

                if (response.status === 422) {
                    const body = await response.json();
                    await updateEventStatus(event.local_id, 'rejected', body.message ?? 'Validation failed');
                    await refreshCount();

                    return true;
                }

                await updateEventStatus(event.local_id, 'pending');

                return false;
            } catch {
                await updateEventStatus(event.local_id, 'pending');

                return false;
            }
        },
        [matchId, scorerToken, refreshCount],
    );

    const flush = useCallback(async () => {
        if (flushingRef.current || !isOnline) {
            return;
        }

        flushingRef.current = true;

        try {
            const pending = await getPendingEvents(matchId);

            if (pending.length === 0) {
                return;
            }

            if (pending.length === 1) {
                await postEvent(pending[0]);

                return;
            }

            const events = pending.map((e) => ({
                type: e.type,
                period: e.period,
                period_clock_seconds: e.period_clock_seconds,
                payload: e.payload,
            }));

            const response = await fetch(`/api/matches/${matchId}/events/batch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${scorerToken}`,
                },
                body: JSON.stringify({ events }),
            });

            if (response.ok) {
                for (const event of pending) {
                    await dequeueEvent(event.local_id);
                }
            }

            await refreshCount();
        } finally {
            flushingRef.current = false;
        }
    }, [matchId, scorerToken, isOnline, postEvent, refreshCount]);

    useEffect(() => {
        if (isOnline && pendingCount > 0) {
            flush();
        }
    }, [isOnline, pendingCount, flush]);

    const enqueue = useCallback(
        async (event: {
            type: EventType;
            period: number;
            period_clock_seconds: number;
            payload: Record<string, unknown>;
        }): Promise<string> => {
            const localId = crypto.randomUUID();

            const queuedEvent: QueuedEvent = {
                local_id: localId,
                match_id: matchId,
                type: event.type,
                period: event.period,
                period_clock_seconds: event.period_clock_seconds,
                payload: event.payload,
                status: 'pending',
                created_at: Date.now(),
            };

            await enqueueEvent(queuedEvent);
            await refreshCount();

            if (isOnline) {
                postEvent(queuedEvent);
            }

            return localId;
        },
        [matchId, isOnline, postEvent, refreshCount],
    );

    const syncStatus: SyncStatus = !isOnline ? 'offline' : pendingCount > 0 ? 'syncing' : 'online';

    return { enqueue, pendingCount, syncStatus, flush };
}
