import { formatClock, formatPeriod, formatShortClock } from '@/lib/format';
import { cn } from '@/lib/utils';

import { TimeoutsIndicator } from './timeouts-indicator';

type Props = {
    homeScore: number;
    awayScore: number;
    currentPeriod: number;
    periodClockSeconds: number;
    possessionClockSeconds: number | null;
    possession: 'home' | 'away' | 'none';
    homeTimeoutsRemaining: number;
    awayTimeoutsRemaining: number;
    totalTimeouts: number;
    isClockRunning: boolean;
};

export function ScoreHeader({
    homeScore,
    awayScore,
    currentPeriod,
    periodClockSeconds,
    possessionClockSeconds,
    possession,
    homeTimeoutsRemaining,
    awayTimeoutsRemaining,
    totalTimeouts,
    isClockRunning,
}: Props) {
    return (
        <div className="rounded-lg bg-card px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
                {/* White team */}
                <div className="flex min-w-0 flex-col items-center gap-1">
                    <div className="font-mono text-xs font-medium uppercase tracking-wide text-team-white-foreground">
                        WHITE
                    </div>
                    <div
                        className={cn(
                            'font-mono text-4xl font-semibold tabular-nums sm:text-5xl',
                            possession === 'home' && 'text-possession',
                        )}
                    >
                        {homeScore}
                    </div>
                    <TimeoutsIndicator remaining={homeTimeoutsRemaining} total={totalTimeouts} />
                </div>

                {/* Center clock area */}
                <div className="flex min-w-0 flex-col items-center gap-1">
                    <div className="rounded bg-muted px-2 py-0.5 text-sm font-medium text-foreground">
                        {formatPeriod(currentPeriod)}
                    </div>
                    <div
                        className={cn(
                            'font-mono text-2xl font-semibold tabular-nums sm:text-3xl',
                            isClockRunning ? 'text-clock' : 'text-clock-stopped',
                        )}
                    >
                        {formatClock(periodClockSeconds)}
                    </div>
                    {possessionClockSeconds !== null && (
                        <div
                            className={cn(
                                'font-mono tabular-nums sm:text-lg',
                                isClockRunning ? 'text-clock' : 'text-clock-stopped',
                            )}
                        >
                            {formatShortClock(possessionClockSeconds)}
                        </div>
                    )}
                </div>

                {/* Blue team */}
                <div className="flex min-w-0 flex-col items-center gap-1">
                    <div className="font-mono text-xs font-medium uppercase tracking-wide text-team-blue-foreground">
                        BLUE
                    </div>
                    <div
                        className={cn(
                            'font-mono text-4xl font-semibold tabular-nums sm:text-5xl',
                            possession === 'away' && 'text-possession',
                        )}
                    >
                        {awayScore}
                    </div>
                    <TimeoutsIndicator remaining={awayTimeoutsRemaining} total={totalTimeouts} />
                </div>
            </div>
        </div>
    );
}
