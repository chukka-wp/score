import { cn } from '@/lib/utils';

import type { EventEntryState } from '@/types';

type Props = {
    entryState: EventEntryState;
    playerPreview: string | null;
};

const EVENT_TYPE_ABBREVS: Record<string, string> = {
    goal: 'G',
    exclusion_foul: 'E',
    ordinary_foul: 'F',
    penalty_foul: 'P',
    penalty_throw_taken: 'P',
    timeout_start: 'T',
    substitution: 'S',
    yellow_card: 'Y',
    red_card: 'R',
    corner_throw: 'C',
    neutral_throw: 'N',
    goal_throw: 'GT',
    violent_action_exclusion: 'VA',
    misconduct_exclusion: 'MC',
    possession_change: 'PC',
    shootout_shot: 'O',
};

function getAbbrev(eventType: string | null): string | null {
    if (!eventType) {
        return null;
    }

    return EVENT_TYPE_ABBREVS[eventType] ?? eventType.charAt(0).toUpperCase();
}

export function CommandInput({ entryState, playerPreview }: Props) {
    const { step, eventType, capNumber, team } = entryState;
    const abbrev = getAbbrev(eventType);
    const isIdle = step === 'idle';
    const isConfirm = step === 'awaiting_confirm';

    return (
        <div className="flex items-center gap-2 rounded-lg bg-card px-4 py-3 font-mono text-sm">
            {/* Prompt character */}
            <span className="text-muted-foreground">&gt;</span>

            {/* Event type abbreviation */}
            {abbrev && (
                <span className="font-bold text-foreground">{abbrev}</span>
            )}

            {/* Cap number */}
            {capNumber && (
                <span className="tabular-nums text-foreground">{capNumber}</span>
            )}

            {/* Team identifier */}
            {team && (
                <span
                    className={cn(
                        'font-bold',
                        team === 'white' ? 'text-team-white-foreground' : 'text-team-blue-foreground',
                    )}
                >
                    {team === 'white' ? 'W' : 'B'}
                </span>
            )}

            {/* Player name preview */}
            {playerPreview && (
                <span className="italic text-muted-foreground">{playerPreview}</span>
            )}

            {/* Confirm hint */}
            {isConfirm && (
                <span className="ml-2 text-xs text-muted-foreground">
                    Press Enter to confirm
                </span>
            )}

            {/* Flashing cursor when idle */}
            {isIdle && (
                <span className="animate-pulse text-muted-foreground">_</span>
            )}
        </div>
    );
}
