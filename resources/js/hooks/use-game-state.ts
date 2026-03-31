import { useEffect, useRef, useState } from 'react';

import { createEcho } from '@/lib/echo';
import type { GameState, ReverbConfig } from '@/types';

type EventConfirmation = {
    event_id: string;
    status: 'accepted' | 'rejected';
    error?: string;
};

type UseGameStateReturn = {
    gameState: GameState;
    isConnected: boolean;
    lastEventConfirmation: EventConfirmation | null;
};

export function useGameState(
    matchId: string,
    initialState: GameState,
    reverbConfig: ReverbConfig,
    scorerToken: string,
): UseGameStateReturn {
    const [gameState, setGameState] = useState<GameState>(initialState);
    const [isConnected, setIsConnected] = useState(false);
    const [lastConfirmation, setLastConfirmation] = useState<EventConfirmation | null>(null);
    const echoRef = useRef<ReturnType<typeof createEcho> | null>(null);

    useEffect(() => {
        if (!reverbConfig.key || !reverbConfig.host) {
            return;
        }

        const echo = createEcho(reverbConfig, scorerToken);
        echoRef.current = echo;

        // Public channel for state updates
        echo.channel(`match.${matchId}`)
            .listen('.state.updated', (data: { state: GameState }) => {
                setGameState(data.state);
            })
            .listen('.match.status_changed', (data: { status: string }) => {
                setGameState((prev) => ({ ...prev, status: data.status as GameState['status'] }));
            });

        // Private channel for scorer confirmations
        echo.private(`match.${matchId}.scorer`)
            .listen('.event.accepted', (data: { event_id: string }) => {
                setLastConfirmation({ event_id: data.event_id, status: 'accepted' });
            })
            .listen('.event.rejected', (data: { error: string }) => {
                setLastConfirmation({
                    event_id: '',
                    status: 'rejected',
                    error: data.error,
                });
            });

        // Track connection state
        const connector = echo.connector as { pusher?: { connection?: { bind?: (event: string, cb: (states: { current: string }) => void) => void } } };

        if (connector.pusher?.connection?.bind) {
            connector.pusher.connection.bind('state_change', (states: { current: string }) => {
                setIsConnected(states.current === 'connected');
            });
        }

        return () => {
            echo.leave(`match.${matchId}`);
            echo.leave(`match.${matchId}.scorer`);
            echo.disconnect();
            echoRef.current = null;
        };
    }, [matchId, reverbConfig, scorerToken]);

    return {
        gameState,
        isConnected,
        lastEventConfirmation: lastConfirmation,
    };
}
