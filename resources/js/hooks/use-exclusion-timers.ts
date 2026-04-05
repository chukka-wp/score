import { useEffect, useRef, useState } from 'react';

import type { ActiveExclusion } from '@/types';

export type ExclusionTimerEntry = ActiveExclusion & {
    display_seconds: number;
};

export function useExclusionTimers(activeExclusions: ActiveExclusion[]): ExclusionTimerEntry[] {
    const [timers, setTimers] = useState<ExclusionTimerEntry[]>([]);
    const lastTickRef = useRef<number>(0);

    // Sync timers from server state — intentional setState-in-effect to reset on new data
    useEffect(() => {
        const entries = activeExclusions.map((ex) => ({
            ...ex,
            display_seconds: ex.remaining_seconds,
        }));

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTimers(entries);
        lastTickRef.current = performance.now();
    }, [activeExclusions]);

    useEffect(() => {
        if (timers.length === 0) {
            return;
        }

        const interval = setInterval(() => {
            const now = performance.now();
            const elapsed = (now - lastTickRef.current) / 1000;
            lastTickRef.current = now;

            setTimers((prev) =>
                prev.map((timer) => ({
                    ...timer,
                    display_seconds: Math.max(0, timer.display_seconds - elapsed),
                })),
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [timers.length]);

    return timers;
}
