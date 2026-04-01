import { formatClock, formatEventType } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import type { EventType } from '@/types';

type EventData = {
    type: string;
    period: number;
    period_clock_seconds: number;
    payload: Record<string, unknown>;
};

type Props = {
    event: EventData;
    showUndo?: boolean;
    onUndo?: () => void;
};

const EVENT_BADGE_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    goal: 'default',
    penalty_throw_taken: 'default',
    exclusion_foul: 'destructive',
    violent_action_exclusion: 'destructive',
    misconduct_exclusion: 'destructive',
    red_card: 'destructive',
    yellow_card: 'outline',
    ordinary_foul: 'secondary',
    timeout_start: 'secondary',
    substitution: 'secondary',
    correction: 'destructive',
};

function getBadgeVariant(type: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    return EVENT_BADGE_VARIANTS[type] ?? 'outline';
}

export function EventRow({ event, showUndo, onUndo }: Props) {
    const capNumber = event.payload.cap_number as number | undefined;
    const teamSide = event.payload.team_side as string | undefined;

    return (
        <div className="flex items-center gap-2 py-1 text-sm">
            <div className="w-14 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                {formatClock(event.period_clock_seconds)}
            </div>

            <Badge variant={getBadgeVariant(event.type)}>
                {formatEventType(event.type as EventType)}
            </Badge>

            {capNumber !== undefined && (
                <div className="font-mono text-xs tabular-nums">#{capNumber}</div>
            )}

            {teamSide && (
                <Badge variant="outline" className="text-[0.625rem]">
                    {teamSide === 'white' ? 'W' : 'B'}
                </Badge>
            )}

            {showUndo && onUndo && (
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={onUndo}
                    className="ml-auto text-destructive"
                >
                    Undo
                </Button>
            )}
        </div>
    );
}
