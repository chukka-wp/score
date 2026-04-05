import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

type Props = {
    open: boolean;
    onClose: () => void;
};

type HotkeyEntry = {
    key: string;
    description: string;
};

type HotkeyCategory = {
    label: string;
    keys: HotkeyEntry[];
};

const HOTKEY_CATEGORIES: HotkeyCategory[] = [
    {
        label: 'Events',
        keys: [
            { key: 'G', description: 'Goal' },
            { key: 'E', description: 'Exclusion' },
            { key: 'F', description: 'Foul' },
            { key: 'P', description: 'Penalty' },
            { key: 'T', description: 'Timeout' },
            { key: 'S', description: 'Substitution' },
            { key: 'X', description: 'Shot' },
            { key: 'C', description: 'Free Throw' },
            { key: 'D', description: 'Two-Meter Throw' },
            { key: 'Y', description: 'Yellow Card' },
            { key: 'R', description: 'Red Card' },
            { key: 'O', description: 'Shootout Shot' },
        ],
    },
    {
        label: 'Outcomes',
        keys: [
            { key: 'V', description: 'Saved' },
            { key: 'M', description: 'Missed' },
            { key: 'B', description: 'Blocked' },
            { key: 'G', description: 'Goal (during penalty/shootout outcome)' },
        ],
    },
    {
        label: 'Clock',
        keys: [
            { key: 'Space', description: 'Start / Stop clock (possession only in RT)' },
            { key: 'Shift+Space', description: 'Start / Stop period clock' },
            { key: ']', description: 'Reset possession clock (full)' },
            { key: '[', description: 'Reset possession clock (reduced)' },
        ],
    },
    {
        label: 'Modifiers',
        keys: [
            { key: 'W', description: 'White team' },
            { key: 'B', description: 'Blue team' },
            { key: '0-9', description: 'Cap number digits' },
            { key: 'Enter', description: 'Confirm event' },
            { key: 'Escape', description: 'Cancel event' },
        ],
    },
    {
        label: 'Navigation',
        keys: [
            { key: '\u2190 / \u2192', description: 'Toggle possession' },
            { key: 'Ctrl+H', description: 'Event history' },
            { key: 'Ctrl+Z', description: 'Undo last event' },
            { key: '?', description: 'Hotkey reference' },
        ],
    },
];

export function HotkeyReference({ open, onClose }: Props) {
    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Keyboard Shortcuts</DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh]">
                    <div className="space-y-6 pr-4">
                        {HOTKEY_CATEGORIES.map((category) => (
                            <div key={category.label}>
                                <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    {category.label}
                                </h3>

                                <div className="space-y-1">
                                    {category.keys.map((entry) => (
                                        <div
                                            key={entry.key}
                                            className="flex items-center justify-between py-1"
                                        >
                                            <span className="text-sm text-foreground">
                                                {entry.description}
                                            </span>

                                            <kbd className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                                                {entry.key}
                                            </kbd>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
