import { useCallback, useState } from 'react';

import type { TeamSide } from '@/types';

type ScorerSessionReturn = {
    token: string;
    teamScope: TeamSide | null;
    setTeamScope: (team: TeamSide | null) => void;
};

export function useScorerSession(initialToken: string, matchId: string): ScorerSessionReturn {
    const storageKey = `chukka-team-scope-${matchId}`;

    const [teamScope, setTeamScopeState] = useState<TeamSide | null>(() => {
        if (typeof window === 'undefined') {
            return null;
        }

        return (sessionStorage.getItem(storageKey) as TeamSide) ?? null;
    });

    const setTeamScope = useCallback(
        (team: TeamSide | null) => {
            setTeamScopeState(team);

            if (team) {
                sessionStorage.setItem(storageKey, team);
            } else {
                sessionStorage.removeItem(storageKey);
            }
        },
        [storageKey],
    );

    return {
        token: initialToken,
        teamScope,
        setTeamScope,
    };
}
