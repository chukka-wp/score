import { useEffect, useState } from 'react';

import { formatClock } from '@/lib/format';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    open: boolean;
    onClose: () => void;
    periodClockSeconds: number;
    possessionClockSeconds: number | null;
    onApply: (periodClock: number, possessionClock: number | null) => void;
};

function mmssToSeconds(value: string): number | null {
    const match = value.match(/^(\d{1,2}):(\d{2})$/);

    if (!match) {
        return null;
    }

    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);

    if (seconds >= 60) {
        return null;
    }

    return minutes * 60 + seconds;
}

export function TimingCorrectionModal({
    open,
    onClose,
    periodClockSeconds,
    possessionClockSeconds,
    onApply,
}: Props) {
    const [periodValue, setPeriodValue] = useState('');
    const [possessionValue, setPossessionValue] = useState('');
    const [periodError, setPeriodError] = useState('');
    const [possessionError, setPossessionError] = useState('');

    useEffect(() => {
        if (open) {
            setPeriodValue(formatClock(periodClockSeconds));
            setPossessionValue(
                possessionClockSeconds !== null ? String(possessionClockSeconds) : '',
            );
            setPeriodError('');
            setPossessionError('');
        }
    }, [open, periodClockSeconds, possessionClockSeconds]);

    function handleApply(): void {
        let hasError = false;

        const newPeriod = mmssToSeconds(periodValue);

        if (newPeriod === null) {
            setPeriodError('Enter time as MM:SS (e.g. 08:00)');
            hasError = true;
        } else {
            setPeriodError('');
        }

        const newPossession = possessionValue.trim() === ''
            ? null
            : parseInt(possessionValue, 10);

        if (newPossession !== null && isNaN(newPossession)) {
            setPossessionError('Enter seconds as a number');
            hasError = true;
        } else {
            setPossessionError('');
        }

        if (hasError || newPeriod === null) {
            return;
        }

        onApply(newPeriod, newPossession);
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-xs">
                <DialogHeader>
                    <DialogTitle>Correct Timing</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="period-clock">Period Clock (MM:SS)</Label>
                        <Input
                            id="period-clock"
                            value={periodValue}
                            onChange={(e) => setPeriodValue(e.target.value)}
                            placeholder="08:00"
                            className="font-mono tabular-nums"
                        />
                        {periodError && <p className="text-sm text-destructive">{periodError}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="possession-clock">Possession Clock (seconds)</Label>
                        <Input
                            id="possession-clock"
                            value={possessionValue}
                            onChange={(e) => setPossessionValue(e.target.value)}
                            placeholder="28"
                            className="font-mono tabular-nums"
                        />
                        {possessionError && <p className="text-sm text-destructive">{possessionError}</p>}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleApply}>
                        Apply
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
