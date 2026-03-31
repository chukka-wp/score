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

const BUTTONS: EventButton[] = [
    { label: 'Goal', type: 'goal', variant: 'default', large: true },
    { label: 'Exclusion', type: 'exclusion_foul', variant: 'outline' },
    { label: 'Foul', type: 'ordinary_foul', variant: 'outline' },
    { label: 'Penalty', type: 'penalty_throw_taken', variant: 'outline' },
    { label: 'Timeout', type: 'timeout_start', variant: 'secondary' },
    { label: 'Sub', type: 'substitution', variant: 'secondary' },
    { label: 'Yellow', type: 'yellow_card', variant: 'outline' },
    { label: 'Red', type: 'red_card', variant: 'destructive' },
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
        <div className="flex flex-col gap-2">
            <span
                className={cn(
                    'text-center text-xs font-medium uppercase tracking-wider',
                    team === 'white' ? 'text-team-white-foreground' : 'text-team-blue-foreground',
                )}
            >
                {team === 'white' ? 'White' : 'Blue'}
            </span>

            {BUTTONS.map((btn) => (
                <Button
                    key={btn.type}
                    variant={btn.variant ?? 'outline'}
                    size={btn.large ? 'lg' : 'default'}
                    disabled={disabled}
                    onClick={() => onAction(btn.type, team)}
                    className={cn(btn.large && 'font-bold')}
                >
                    {btn.label}
                </Button>
            ))}
        </div>
    );
}

export function EventButtonPanel({ onAction, disabled }: Props) {
    return (
        <div className="grid grid-cols-2 gap-4 rounded-lg bg-card p-4">
            <TeamColumn team="white" onAction={onAction} disabled={disabled} />
            <TeamColumn team="blue" onAction={onAction} disabled={disabled} />
        </div>
    );
}
