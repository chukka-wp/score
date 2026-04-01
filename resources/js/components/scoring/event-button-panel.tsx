import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import type { EventType } from '@/types';

type Props = {
    onAction: (type: EventType, team: 'white' | 'blue') => void;
    disabled: boolean;
};

type EventButton = {
    label: string;
    type: EventType;
    variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost';
    large?: boolean;
};

type ButtonGroup = {
    buttons: EventButton[];
};

const BUTTON_GROUPS: ButtonGroup[] = [
    {
        buttons: [
            { label: 'Goal', type: 'goal', variant: 'default', large: true },
            { label: 'Shot', type: 'shot', variant: 'outline' },
            { label: 'Penalty', type: 'penalty_throw_taken', variant: 'outline' },
        ],
    },
    {
        buttons: [
            { label: 'Exclusion', type: 'exclusion_foul', variant: 'outline' },
            { label: 'Foul', type: 'ordinary_foul', variant: 'outline' },
            { label: '2m Throw', type: 'two_meter_throw', variant: 'outline' },
        ],
    },
    {
        buttons: [
            { label: 'Timeout', type: 'timeout_start', variant: 'secondary' },
            { label: 'Sub', type: 'substitution', variant: 'secondary' },
        ],
    },
    {
        buttons: [
            { label: 'Yellow', type: 'yellow_card', variant: 'outline' },
            { label: 'Red', type: 'red_card', variant: 'destructive' },
        ],
    },
];

function TeamColumn({
    team,
    onAction,
    disabled,
}: {
    team: 'white' | 'blue';
    onAction: Props['onAction'];
    disabled: boolean;
}) {
    return (
        <div className="flex flex-col gap-1">
            <div
                className={cn(
                    'text-center font-mono text-xs font-medium uppercase tracking-wide',
                    team === 'white' ? 'text-team-white-foreground' : 'text-team-blue-foreground',
                )}
            >
                {team === 'white' ? 'White' : 'Blue'}
            </div>

            {BUTTON_GROUPS.map((group, groupIdx) => (
                <div key={groupIdx} className={cn('flex flex-col gap-1.5', groupIdx > 0 && 'border-t border-border/50 pt-1.5')}>
                    {group.buttons.map((btn) => (
                        <Button
                            key={btn.type}
                            variant={btn.variant ?? 'outline'}
                            size={btn.large ? 'lg' : 'default'}
                            disabled={disabled}
                            onClick={() => onAction(btn.type, team)}
                            className={cn(btn.large && 'font-semibold')}
                        >
                            {btn.label}
                        </Button>
                    ))}
                </div>
            ))}
        </div>
    );
}

export function EventButtonPanel({ onAction, disabled }: Props) {
    return (
        <div className="grid grid-cols-2 gap-4 rounded-lg bg-card p-3">
            <TeamColumn team="white" onAction={onAction} disabled={disabled} />
            <TeamColumn team="blue" onAction={onAction} disabled={disabled} />
        </div>
    );
}
