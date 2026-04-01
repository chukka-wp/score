import { formatEventType } from '@/lib/format';
import { cn } from '@/lib/utils';

import type { EventEntryState, EventType } from '@/types';

type Props = {
    entryState: EventEntryState;
    playerPreview: string | null;
};

const EVENT_HOTKEYS: Partial<Record<EventType, string>> = {
    goal: 'G',
    exclusion_foul: 'E',
    ordinary_foul: 'F',
    penalty_foul: 'P',
    penalty_throw_taken: 'P',
    timeout_start: 'T',
    substitution: 'S',
    yellow_card: 'Y',
    red_card: 'R',
    shot: 'X',
    free_throw: 'C',
    two_meter_throw: 'D',
    shootout_shot: 'O',
};

function StepHint({ step }: { step: string }) {
    switch (step) {
        case 'awaiting_cap':
            return <span className="text-muted-foreground">Cap #?</span>;
        case 'awaiting_team':
            return <span className="text-muted-foreground">Team?</span>;
        case 'awaiting_outcome':
            return <span className="text-muted-foreground">V/M/B?</span>;
        case 'awaiting_confirm':
            return <span className="text-muted-foreground">Enter ✓</span>;
        default:
            return <span className="animate-pulse text-muted-foreground">_</span>;
    }
}

export function CommandInput({ entryState, playerPreview }: Props) {
    const { step, eventType, capNumber, team, outcome } = entryState;
    const label = eventType ? formatEventType(eventType) : null;
    const hotkey = eventType ? EVENT_HOTKEYS[eventType] ?? null : null;

    return (
        <div className="flex items-center gap-1.5 rounded-lg bg-card px-4 py-3 font-mono text-sm ring-1 ring-transparent transition-shadow focus-within:ring-primary">
            {/* Prompt character */}
            <span className="text-muted-foreground">&gt;</span>

            {/* Event type: hotkey + label */}
            {eventType && (
                <>
                    {hotkey && <span className="font-bold text-foreground">{hotkey}</span>}
                    <span className="text-muted-foreground">{label}</span>
                </>
            )}

            {/* Cap number + player name */}
            {capNumber && (
                <>
                    <span className="tabular-nums text-foreground">{capNumber}</span>
                    {playerPreview && (
                        <span className="text-muted-foreground">{playerPreview}</span>
                    )}
                </>
            )}

            {/* Team identifier */}
            {team && (
                <span
                    className={cn(
                        'font-bold',
                        team === 'white' ? 'text-team-white-foreground' : 'text-team-blue-foreground',
                    )}
                >
                    {team === 'white' ? 'W White' : 'B Blue'}
                </span>
            )}

            {/* Outcome */}
            {outcome && (
                <span className="text-foreground capitalize">{outcome}</span>
            )}

            {/* Step hint */}
            <div className="ml-auto text-xs">
                <StepHint step={step} />
            </div>
        </div>
    );
}
