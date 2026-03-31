import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

type RosterPlayer = {
    player_id: string;
    cap_number: number;
    player?: { name: string };
};

type Props = {
    roster: RosterPlayer[];
    open: boolean;
    onClose: () => void;
    onConfirm: (playersOff: string[], playersOn: string[]) => void;
};

export function SubstitutionPanel({ roster, open, onClose, onConfirm }: Props) {
    const [playersOff, setPlayersOff] = useState<Set<string>>(new Set());
    const [playersOn, setPlayersOn] = useState<Set<string>>(new Set());

    function handleOpenChange(isOpen: boolean): void {
        if (!isOpen) {
            onClose();
        }
    }

    function handleConfirm(): void {
        onConfirm(Array.from(playersOff), Array.from(playersOn));
        setPlayersOff(new Set());
        setPlayersOn(new Set());
        onClose();
    }

    function toggleOff(playerId: string): void {
        setPlayersOff((prev) => {
            const next = new Set(prev);

            if (next.has(playerId)) {
                next.delete(playerId);
            } else {
                next.add(playerId);
            }

            return next;
        });
    }

    function toggleOn(playerId: string): void {
        setPlayersOn((prev) => {
            const next = new Set(prev);

            if (next.has(playerId)) {
                next.delete(playerId);
            } else {
                next.add(playerId);
            }

            return next;
        });
    }

    // Split roster into in-water and bench (simplified: roster entries are listed for both)
    const sortedRoster = [...roster].sort((a, b) => a.cap_number - b.cap_number);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Substitution</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4">
                    {/* Players to take off */}
                    <div className="space-y-2">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Players Off
                        </span>

                        <ScrollArea className="max-h-48">
                            <div className="space-y-1.5 pr-2">
                                {sortedRoster.map((entry) => (
                                    <div key={`off-${entry.player_id}`} className="flex items-center gap-2">
                                        <Checkbox
                                            checked={playersOff.has(entry.player_id)}
                                            onCheckedChange={() => toggleOff(entry.player_id)}
                                        />
                                        <Label className="flex items-center gap-1 text-sm font-normal">
                                            <span className="font-mono tabular-nums">#{entry.cap_number}</span>
                                            {entry.player?.name && (
                                                <span className="text-muted-foreground">{entry.player.name}</span>
                                            )}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Players to bring on */}
                    <div className="space-y-2">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Players On
                        </span>

                        <ScrollArea className="max-h-48">
                            <div className="space-y-1.5 pr-2">
                                {sortedRoster.map((entry) => (
                                    <div key={`on-${entry.player_id}`} className="flex items-center gap-2">
                                        <Checkbox
                                            checked={playersOn.has(entry.player_id)}
                                            onCheckedChange={() => toggleOn(entry.player_id)}
                                        />
                                        <Label className="flex items-center gap-1 text-sm font-normal">
                                            <span className="font-mono tabular-nums">#{entry.cap_number}</span>
                                            {entry.player?.name && (
                                                <span className="text-muted-foreground">{entry.player.name}</span>
                                            )}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={playersOff.size === 0 && playersOn.size === 0}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
