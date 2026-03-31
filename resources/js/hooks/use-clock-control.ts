import { useCallback, useState } from 'react';

import type { EventType, GameState, RuleSet, TeamSide } from '@/types';

type UseClockControlReturn = {
    toggleClock: () => void;
    setPossession: (team: TeamSide) => void;
    resetPossessionClock: (seconds: number) => void;
    isClockRunning: boolean;
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

    const toggleClock = useCallback(() => {
        if (ruleSet.running_time) {
            return;
        }

        setIsClockRunning((prev) => !prev);
    }, [ruleSet.running_time]);

    const setPossession = useCallback(
        (team: TeamSide) => {
            enqueueEvent({
                type: 'possession_change',
                period: gameState.current_period,
                period_clock_seconds: gameState.period_clock_seconds,
                payload: { team_side: team },
            });
        },
        [gameState, enqueueEvent],
    );

    const resetPossessionClock = useCallback(
        (seconds: number) => {
            if (!ruleSet.possession_clock_enabled) {
                return;
            }

            const reason =
                seconds === ruleSet.second_possession_time_seconds
                    ? 'shot_rebound_attacking'
                    : 'new_possession';

            enqueueEvent({
                type: 'possession_clock_reset',
                period: gameState.current_period,
                period_clock_seconds: gameState.period_clock_seconds,
                payload: { reason, seconds },
            });
        },
        [gameState, ruleSet, enqueueEvent],
    );

    return {
        toggleClock,
        setPossession,
        resetPossessionClock,
        isClockRunning,
    };
}
