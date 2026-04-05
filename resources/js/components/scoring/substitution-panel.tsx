import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import type { RosterEntry } from '@/types';

type Props = {
    roster: RosterEntry[];
    team: 'white' | 'blue';
    inWaterIds: Set<string>;
    maxInWater: number;
    open: boolean;
    onClose: () => void;
    onConfirm: (subOff: string[], subOn: string[]) => void;
};

export function SubstitutionPanel({ roster, team, inWaterIds, maxInWater, open, onClose, onConfirm }: Props) {
    const [localInWater, setLocalInWater] = useState<Set<string>>(new Set());

    // Sync local state whenever dialog opens
    useEffect(() => {
        if (open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLocalInWater(new Set(inWaterIds));
        }
    }, [open, inWaterIds]);

    const sortedRoster = useMemo(
        () => [...roster].sort((a, b) => a.cap_number - b.cap_number),
        [roster],
    );

    const inWaterCount = localInWater.size;
    const hasChanges = useMemo(() => {
        if (localInWater.size !== inWaterIds.size) {
            return true;
        }

        for (const id of localInWater) {
            if (!inWaterIds.has(id)) {
                return true;
            }
        }

        return false;
    }, [localInWater, inWaterIds]);

    function toggle(playerId: string): void {
        setLocalInWater((prev) => {
            const next = new Set(prev);

            if (next.has(playerId)) {
                next.delete(playerId);
            } else {
                next.add(playerId);
            }

            return next;
        });
    }

    function handleConfirm(): void {
        const subOff: string[] = [];
        const subOn: string[] = [];

        for (const id of inWaterIds) {
            if (!localInWater.has(id)) {
                subOff.push(id);
            }
        }

        for (const id of localInWater) {
            if (!inWaterIds.has(id)) {
                subOn.push(id);
            }
        }

        onConfirm(subOff, subOn);
    }

    function handleOpenChange(isOpen: boolean): void {
        if (!isOpen) {
            onClose();
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="flex max-h-[80dvh] flex-col sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>
                            Substitution —{' '}
                            <span className={team === 'white' ? 'text-foreground' : 'text-team-blue'}>
                                {team === 'white' ? 'White' : 'Blue'}
                            </span>
                        </span>
                        <span className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-medium tabular-nums',
                            inWaterCount === maxInWater
                                ? 'bg-muted text-muted-foreground'
                                : 'bg-destructive/10 text-destructive',
                        )}>
                            {inWaterCount}/{maxInWater}
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-1.5">
                        {sortedRoster.map((entry) => {
                            const isIn = localInWater.has(entry.player_id);
                            const isGk = entry.role === 'goalkeeper' || entry.role === 'substitute_goalkeeper';

                            return (
                                <button
                                    key={entry.player_id}
                                    type="button"
                                    onClick={() => toggle(entry.player_id)}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                                        isIn
                                            ? 'bg-primary/10 ring-1 ring-primary/20'
                                            : 'bg-muted/50 opacity-50 hover:opacity-75',
                                    )}
                                >
                                    {/* In-water indicator */}
                                    <div className={cn(
                                        'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
                                        isIn
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground',
                                    )}>
                                        {isIn ? '●' : '○'}
                                    </div>

                                    {/* Cap number */}
                                    <span className="font-mono text-base font-semibold tabular-nums">
                                        #{entry.cap_number}
                                    </span>

                                    {/* Player name */}
                                    <span className="min-w-0 flex-1 truncate text-muted-foreground">
                                        {entry.player?.name ?? entry.player?.preferred_name ?? '—'}
                                    </span>

                                    {/* GK badge */}
                                    {isGk && (
                                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                            GK
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={!hasChanges}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
