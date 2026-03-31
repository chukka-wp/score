import type { EventEntryState } from '@/types';

import { CommandInput } from './command-input';
import { StepIndicator } from './step-indicator';

type Props = {
    entryState: EventEntryState;
    teamScope: 'white' | 'blue' | null;
};

export function EventEntry({ entryState, teamScope }: Props) {
    return (
        <div className="space-y-2">
            <CommandInput
                entryState={entryState}
                playerPreview={entryState.playerPreview}
            />

            <StepIndicator
                step={entryState.step}
                eventType={entryState.eventType}
            />

            {teamScope && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>Scoped to</span>
                    <span className="font-medium uppercase">
                        {teamScope === 'white' ? 'White' : 'Blue'}
                    </span>
                </div>
            )}
        </div>
    );
}
