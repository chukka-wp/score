import { useCallback, useEffect, useState } from 'react';

import type { TeamSide } from '@/types';

type ScorerSessionReturn = {
    token: string;
    teamScope: TeamSide | null;
    setTeamScope: (team: TeamSide | null) => void;
    sidesSwapped: boolean;
    toggleSides: () => void;
};

export function useScorerSession(
    initialToken: string,
    matchId: string,
    currentPeriod: number,
    totalPeriods: number,
): ScorerSessionReturn {
    const scopeKey = `chukka-team-scope-${matchId}`;
    const swapKey = `chukka-sides-swapped-${matchId}`;

    const [teamScope, setTeamScopeState] = useState<TeamSide | null>(() => {
        if (typeof window === 'undefined') {
            return null;
        }

        return (sessionStorage.getItem(scopeKey) as TeamSide) ?? null;
    });

    const [manualSwap, setManualSwap] = useState<boolean | null>(() => {
        if (typeof window === 'undefined') {
            return null;
        }

        const stored = sessionStorage.getItem(swapKey);

        return stored !== null ? stored === 'true' : null;
    });

    // Auto-swap at halftime: after period totalPeriods/2
    const halfwayPoint = Math.floor(totalPeriods / 2);
    const autoSwapped = currentPeriod > halfwayPoint;

    // Manual override takes precedence; otherwise use auto
    const sidesSwapped = manualSwap ?? autoSwapped;

    // When crossing halftime boundary, reset manual override so auto takes effect
    useEffect(() => {
        if (currentPeriod === halfwayPoint + 1 && manualSwap === null) {
            // Auto-swap just kicked in, no action needed
        }
    }, [currentPeriod, halfwayPoint, manualSwap]);

    const setTeamScope = useCallback(
        (team: TeamSide | null) => {
            setTeamScopeState(team);

            if (team) {
                sessionStorage.setItem(scopeKey, team);
            } else {
                sessionStorage.removeItem(scopeKey);
            }
        },
        [scopeKey],
    );

    const toggleSides = useCallback(() => {
        const newValue = !sidesSwapped;
        setManualSwap(newValue);
        sessionStorage.setItem(swapKey, String(newValue));
    }, [sidesSwapped, swapKey]);

    return {
        token: initialToken,
        teamScope,
        setTeamScope,
        sidesSwapped,
        toggleSides,
    };
}
