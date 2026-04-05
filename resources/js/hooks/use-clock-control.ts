import { useCallback, useEffect, useRef, useState } from 'react';

import type { EventType, GameState, RuleSet, TeamSide } from '@/types';

type UseClockControlReturn = {
    toggleClock: () => void;
    togglePossession: () => void;
    setPossession: (team: TeamSide) => void;
    resetPossessionClock: (seconds: number, reason?: string) => void;
    isClockRunning: boolean;
    isPossessionPaused: boolean;
    periodClockSeconds: number;
    possessionClockSeconds: number | null;
};

export function useClockControl(
    gameState: GameState,
    ruleSet: RuleSet,
    enqueueEvent: (event: {
        type: EventType;
        period: number;
        period_clock_seconds: number;
        payload: Record<string, unknown>;
    }) => Promise<string>,
): UseClockControlReturn {
    const [isClockRunning, setIsClockRunning] = useState(false);
    const [isPossessionPaused, setIsPossessionPaused] = useState(false);
    const [periodClock, setPeriodClock] = useState(gameState.period_clock_seconds);
    const [possessionClock, setPossessionClock] = useState(gameState.possession_clock_seconds);
    const lastTickRef = useRef(0);

    // Sync from server state when it changes
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        setPeriodClock(gameState.period_clock_seconds);
        setPossessionClock(gameState.possession_clock_seconds);
    }, [gameState.period_clock_seconds, gameState.possession_clock_seconds]);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Tick clocks down when running
    useEffect(() => {
        if (!isClockRunning) {
            return;
        }

        lastTickRef.current = performance.now();

        const interval = setInterval(() => {
            const now = performance.now();
            const elapsed = (now - lastTickRef.current) / 1000;
            lastTickRef.current = now;

            setPeriodClock((prev) => Math.max(0, prev - elapsed));

            if (ruleSet.possession_clock_enabled && !isPossessionPaused) {
                setPossessionClock((prev) => (prev !== null ? Math.max(0, prev - elapsed) : null));
            }
        }, 100);

        return () => clearInterval(interval);
    }, [isClockRunning, isPossessionPaused, ruleSet.possession_clock_enabled]);

    const toggleClock = useCallback(() => {
        setIsClockRunning((prev) => {
            const willRun = !prev;

            if (ruleSet.running_time) {
                setIsPossessionPaused(!willRun);
            }

            return willRun;
        });
    }, [ruleSet.running_time]);

    const togglePossession = useCallback(() => {
        setIsPossessionPaused((prev) => !prev);
    }, []);

    const setPossession = useCallback(
        (team: TeamSide) => {
            enqueueEvent({
                type: 'possession_change',
                period: gameState.current_period,
                period_clock_seconds: Math.round(periodClock),
                payload: { team_side: team },
            });
        },
        [gameState.current_period, periodClock, enqueueEvent],
    );

    const resetPossessionClock = useCallback(
        (seconds: number, reason?: string) => {
            if (!ruleSet.possession_clock_enabled) {
                return;
            }

            setPossessionClock(seconds);

            const resolvedReason = reason
                ?? (seconds === ruleSet.second_possession_time_seconds
                    ? 'shot_rebound_attacking'
                    : 'new_possession');

            enqueueEvent({
                type: 'possession_clock_reset',
                period: gameState.current_period,
                period_clock_seconds: Math.round(periodClock),
                payload: { reason: resolvedReason, seconds },
            });
        },
        [gameState.current_period, periodClock, ruleSet, enqueueEvent],
    );

    return {
        toggleClock,
        togglePossession,
        setPossession,
        resetPossessionClock,
        isClockRunning,
        isPossessionPaused,
        periodClockSeconds: Math.round(periodClock),
        possessionClockSeconds: possessionClock !== null ? Math.round(possessionClock) : null,
    };
}
