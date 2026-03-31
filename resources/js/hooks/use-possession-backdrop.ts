import { useMemo } from 'react';

import type { Possession } from '@/types';

export function usePossessionBackdrop(possession: Possession): string {
    return useMemo(() => {
        switch (possession) {
            case 'home':
                return 'bg-team-white/5';
            case 'away':
                return 'bg-team-blue/5';
            default:
                return 'bg-background';
        }
    }, [possession]);
}
