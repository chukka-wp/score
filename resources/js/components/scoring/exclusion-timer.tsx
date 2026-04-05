import React from 'react';

import { Badge } from '@/components/ui/badge';
import { formatShortClock } from '@/lib/format';
import { cn } from '@/lib/utils';

type Props = {
    capNumber: number;
    teamSide: 'white' | 'blue';
    displaySeconds: number;
    exclusionType: string;
};

export const ExclusionTimer = React.memo(function ExclusionTimer({
    capNumber,
    teamSide,
    displaySeconds,
    exclusionType,
}: Props) {
    const isUrgent = displaySeconds < 5;

    return (
        <div className="flex items-center gap-2">
            <Badge
                className={cn(
                    'font-mono tabular-nums',
                    teamSide === 'white'
                        ? 'bg-team-white text-team-white-foreground'
                        : 'bg-team-blue text-team-blue-foreground',
                )}
            >
                #{capNumber}
            </Badge>

            <span
                className={cn(
                    'font-mono font-semibold tabular-nums',
                    isUrgent
                        ? 'text-base text-exclusion-urgent animate-pulse'
                        : 'text-sm text-exclusion',
                )}
            >
                {formatShortClock(Math.ceil(displaySeconds))}
            </span>

            {exclusionType !== 'standard' && (
                <div className="text-xs text-muted-foreground">
                    {exclusionType === 'violent_action' ? 'VA' : 'FG'}
                </div>
            )}
        </div>
    );
});
