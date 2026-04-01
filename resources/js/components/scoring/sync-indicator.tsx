import { ArrowRightLeftIcon, MoonIcon, SunIcon } from 'lucide-react';

import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

import type { SyncStatus } from '@/types';

type Props = {
    status: SyncStatus;
    pendingCount: number;
    sidesSwapped: boolean;
    onToggleSides: () => void;
};

const STATUS_COLORS: Record<SyncStatus, string> = {
    online: 'bg-sync-online',
    syncing: 'bg-sync-syncing',
    offline: 'bg-sync-offline',
};

const STATUS_TEXT_COLORS: Record<SyncStatus, string> = {
    online: 'text-sync-online',
    syncing: 'text-sync-syncing',
    offline: 'text-sync-offline',
};

function statusLabel(status: SyncStatus, pendingCount: number): string {
    if (status === 'syncing') {
        return `Syncing ${pendingCount} event${pendingCount !== 1 ? 's' : ''}...`;
    }

    if (status === 'offline') {
        return `Offline \u2014 ${pendingCount} queued`;
    }

    return 'Online';
}

export function SyncIndicator({ status, pendingCount, sidesSwapped, onToggleSides }: Props) {
    const [appearance, setAppearance] = useAppearance();

    return (
        <div className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex items-center gap-2 rounded-lg bg-card px-3 py-1.5 shadow-sm ring-1 ring-border">
            <div
                className={cn(
                    'size-2 rounded-full',
                    STATUS_COLORS[status],
                    status === 'syncing' && 'animate-pulse',
                )}
            />

            <span className={cn('text-xs font-medium', STATUS_TEXT_COLORS[status])}>
                {statusLabel(status, pendingCount)}
            </span>

            <button
                type="button"
                onClick={onToggleSides}
                className={cn(
                    'ml-1 rounded p-1.5 text-muted-foreground hover:text-foreground',
                    sidesSwapped && 'bg-muted text-foreground',
                )}
                aria-label={sidesSwapped ? 'Swap sides back (Blue left, White right)' : 'Swap sides (White left, Blue right)'}
                title="Swap sides"
            >
                <ArrowRightLeftIcon className="size-4" />
            </button>

            <button
                type="button"
                onClick={() => setAppearance(appearance === 'dark' ? 'light' : 'dark')}
                className="rounded p-1.5 text-muted-foreground hover:text-foreground"
                aria-label={`Switch to ${appearance === 'dark' ? 'light' : 'dark'} mode`}
            >
                {appearance === 'dark' ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
            </button>
        </div>
    );
}
