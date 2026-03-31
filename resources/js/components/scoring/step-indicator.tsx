import { CheckIcon, ChevronRightIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { EventEntryStep } from '@/types';

type Props = {
    step: EventEntryStep;
    eventType: string | null;
};

const STEPS: { key: EventEntryStep; label: string }[] = [
    { key: 'type_selected', label: 'Type' },
    { key: 'awaiting_cap', label: 'Cap #' },
    { key: 'awaiting_team', label: 'Team' },
    { key: 'awaiting_confirm', label: 'Confirm' },
];

function stepIndex(step: EventEntryStep): number {
    const idx = STEPS.findIndex((s) => s.key === step);

    return idx === -1 ? -1 : idx;
}

export function StepIndicator({ step, eventType }: Props) {
    if (step === 'idle') {
        return null;
    }

    const activeIdx = stepIndex(step);

    return (
        <div className="flex items-center gap-1 text-xs">
            {STEPS.map((s, i) => {
                const isCompleted = i < activeIdx;
                const isActive = i === activeIdx;

                return (
                    <div key={s.key} className="flex items-center gap-1">
                        {i > 0 && <ChevronRightIcon className="size-3 text-muted-foreground" />}

                        <span
                            className={cn(
                                'rounded px-1.5 py-0.5',
                                isActive && 'bg-primary text-primary-foreground',
                                isCompleted && 'text-muted-foreground line-through',
                                !isActive && !isCompleted && 'text-muted-foreground/50',
                            )}
                        >
                            {isCompleted ? (
                                <span className="inline-flex items-center gap-0.5">
                                    <CheckIcon className="size-3" />
                                    {s.label}
                                </span>
                            ) : (
                                s.label
                            )}
                        </span>
                    </div>
                );
            })}

            {eventType && (
                <span className="ml-2 text-muted-foreground">
                    ({eventType})
                </span>
            )}
        </div>
    );
}
