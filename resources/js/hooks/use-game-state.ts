import { useCallback, useEffect, useRef, useState } from 'react';

import { createEcho } from '@/lib/echo';
import type { ActiveExclusion, EventType, GameState, ReverbConfig, TeamSide } from '@/types';

type EventConfirmation = {
    event_id: string;
    status: 'accepted' | 'rejected';
    error?: string;
};

type UseGameStateReturn = {
    gameState: GameState;
    isConnected: boolean;
    lastEventConfirmation: EventConfirmation | null;
    applyOptimisticEvent: (type: EventType, payload: Record<string, unknown>) => void;
};

function resolveTeamSide(
    state: GameState,
    payload: Record<string, unknown>,
): 'home' | 'away' | null {
    const side = payload.team_side as TeamSide | undefined;

    if (!side) {
        return null;
    }

    return side === 'white' ? 'home' : 'away';
}

function applyEvent(state: GameState, type: EventType, payload: Record<string, unknown>): GameState {
    const team = resolveTeamSide(state, payload);

    switch (type) {
        case 'goal': {
            if (team === 'home') {
                return { ...state, home_score: state.home_score + 1, possession: 'away' };
            }

            if (team === 'away') {
                return { ...state, away_score: state.away_score + 1, possession: 'home' };
            }

            return state;
        }

        case 'possession_change': {
            if (team) {
                return { ...state, possession: team };
            }

            return state;
        }

        case 'exclusion_foul': {
            if (!team || !payload.cap_number) {
                return state;
            }

            const exclusion: ActiveExclusion = {
                player_id: (payload.player_id as string) ?? '',
                team_id: team === 'home' ? state.match_id : '',
                cap_number: payload.cap_number as number,
                remaining_seconds: 20,
                exclusion_type: 'standard',
                substitute_eligible_at: null,
            };

            return {
                ...state,
                active_exclusions: [...state.active_exclusions, exclusion],
                possession: team === 'home' ? 'away' : 'home',
            };
        }

        case 'timeout_start': {
            if (team === 'home' && state.home_timeouts_remaining > 0) {
                return { ...state, home_timeouts_remaining: state.home_timeouts_remaining - 1 };
            }

            if (team === 'away' && state.away_timeouts_remaining > 0) {
                return { ...state, away_timeouts_remaining: state.away_timeouts_remaining - 1 };
            }

            return state;
        }

        case 'period_end': {
            return {
                ...state,
                status: 'period_break',
            };
        }

        case 'period_start': {
            return {
                ...state,
                status: 'in_progress',
                current_period: state.current_period + 1,
                possession: 'none',
            };
        }

        case 'correction': {
            return state;
        }

        default:
            return state;
    }
}

export function useGameState(
    matchId: string,
    initialState: GameState,
    reverbConfig: ReverbConfig,
    scorerToken: string,
): UseGameStateReturn {
    const [serverState, setServerState] = useState<GameState>(initialState);
    const [optimisticState, setOptimisticState] = useState<GameState>(initialState);
    const [isConnected, setIsConnected] = useState(false);
    const [lastConfirmation, setLastConfirmation] = useState<EventConfirmation | null>(null);
    const echoRef = useRef<ReturnType<typeof createEcho> | null>(null);

    useEffect(() => {
        if (!reverbConfig.key || !reverbConfig.host) {
            return;
        }

        const echo = createEcho(reverbConfig, scorerToken);
        echoRef.current = echo;

        echo.channel(`match.${matchId}`)
            .listen('.state.updated', (data: { state: GameState }) => {
                setServerState(data.state);
                setOptimisticState(data.state);
            })
            .listen('.match.status_changed', (data: { status: string }) => {
                setServerState((prev) => ({ ...prev, status: data.status as GameState['status'] }));
                setOptimisticState((prev) => ({ ...prev, status: data.status as GameState['status'] }));
            });

        echo.private(`match.${matchId}.scorer`)
            .listen('.event.accepted', (data: { event_id: string }) => {
                setLastConfirmation({ event_id: data.event_id, status: 'accepted' });
            })
            .listen('.event.rejected', (data: { error: string }) => {
                setLastConfirmation({ event_id: '', status: 'rejected', error: data.error });
            });

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

    const applyOptimisticEvent = useCallback(
        (type: EventType, payload: Record<string, unknown>) => {
            setOptimisticState((prev) => applyEvent(prev, type, payload));
        },
        [],
    );

    return {
        gameState: optimisticState,
        isConnected,
        lastEventConfirmation: lastConfirmation,
        applyOptimisticEvent,
    };
}
