import { useCallback, useState } from 'react';

import { formatClock, formatEventType } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import type { EventType } from '@/types';

type EventData = {
    id: string;
    type: string;
    period: number;
    period_clock_seconds: number;
    payload: Record<string, unknown>;
};

type Props = {
    events: EventData[];
    open: boolean;
    onClose: () => void;
    onVoid: (eventId: string) => void;
};

function VoidButton({ eventId, onVoid }: { eventId: string; onVoid: (id: string) => void }) {
    const [confirming, setConfirming] = useState(false);

    const handleClick = useCallback(() => {
        if (confirming) {
            onVoid(eventId);
            setConfirming(false);
        } else {
            setConfirming(true);
        }
    }, [confirming, eventId, onVoid]);

    const handleBlur = useCallback(() => {
        setConfirming(false);
    }, []);

    return (
        <Button
            variant="destructive"
            size="xs"
            className="ml-auto shrink-0"
            onClick={handleClick}
            onBlur={handleBlur}
        >
            {confirming ? 'Confirm?' : 'Void'}
        </Button>
    );
}

export function EventHistory({ events, open, onClose, onVoid }: Props) {
    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Event History</DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh]">
                    {events.length === 0 ? (
                        <div className="py-4 text-center text-sm text-muted-foreground">
                            No events recorded
                        </div>
                    ) : (
                        <div className="space-y-1 pr-4">
                            {events.map((event) => {
                                const capNumber = event.payload.cap_number as number | undefined;
                                const teamSide = event.payload.team_side as string | undefined;

                                return (
                                    <div
                                        key={event.id}
                                        className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted/50"
                                    >
                                        <div className="w-10 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                                            Q{event.period}
                                        </div>

                                        <div className="w-14 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                                            {formatClock(event.period_clock_seconds)}
                                        </div>

                                        <Badge variant="outline" className="shrink-0">
                                            {formatEventType(event.type as EventType)}
                                        </Badge>

                                        {capNumber !== undefined && (
                                            <div className="font-mono text-xs tabular-nums">#{capNumber}</div>
                                        )}

                                        {teamSide && (
                                            <div className="text-xs text-muted-foreground">
                                                {teamSide === 'white' ? 'W' : 'B'}
                                            </div>
                                        )}

                                        <VoidButton eventId={event.id} onVoid={onVoid} />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
