import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type Props = {
    open: boolean;
    onClose: () => void;
    currentPeriod: number;
    onConfirm: () => void;
};

export function PeriodTransitionPrompt({ open, onClose, currentPeriod, onConfirm }: Props) {
    function handleConfirm(): void {
        onConfirm();
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-xs">
                <DialogHeader>
                    <DialogTitle>End Period {currentPeriod}?</DialogTitle>
                    <DialogDescription>
                        This will end the current period and start the break.
                        All active exclusion timers will be cleared.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
