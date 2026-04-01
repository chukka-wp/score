import { EventRow } from './event-row';

type EventData = {
    id: string;
    type: string;
    period: number;
    period_clock_seconds: number;
    payload: Record<string, unknown>;
};

type Props = {
    events: EventData[];
    onUndo: () => void;
};

export function RecentEvents({ events, onUndo }: Props) {
    const displayed = events.slice(0, 10);

    if (displayed.length === 0) {
        return (
            <div className="rounded-lg bg-card p-4">
                <div className="text-xs text-muted-foreground">No events yet</div>
            </div>
        );
    }

    return (
        <div className="rounded-lg bg-card p-4">
            <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Recent Events
            </div>

            <div className="space-y-1.5">
                {displayed.map((event, index) => (
                    <EventRow
                        key={event.id}
                        event={event}
                        showUndo={index === 0}
                        onUndo={onUndo}
                    />
                ))}
            </div>
        </div>
    );
}
