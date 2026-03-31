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
        <div className="flex items-center justify-between gap-4 rounded-lg bg-card px-6 py-4">
            {/* White team */}
            <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-medium uppercase tracking-wider text-team-white-foreground">
                    WHITE
                </span>
                <span
                    className={cn(
                        'font-mono text-5xl font-bold tabular-nums',
                        possession === 'home' && 'text-possession',
                    )}
                >
                    {homeScore}
                </span>
                <TimeoutsIndicator remaining={homeTimeoutsRemaining} total={totalTimeouts} />
            </div>

            {/* Center clock area */}
            <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                    {formatPeriod(currentPeriod)}
                </span>
                <span
                    className={cn(
                        'font-mono text-3xl font-semibold tabular-nums',
                        isClockRunning ? 'text-clock' : 'text-clock-stopped',
                    )}
                >
                    {formatClock(periodClockSeconds)}
                </span>
                {possessionClockSeconds !== null && (
                    <span
                        className={cn(
                            'font-mono text-lg tabular-nums',
                            isClockRunning ? 'text-clock' : 'text-clock-stopped',
                        )}
                    >
                        {formatShortClock(possessionClockSeconds)}
                    </span>
                )}
            </div>

            {/* Blue team */}
            <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-medium uppercase tracking-wider text-team-blue-foreground">
                    BLUE
                </span>
                <span
                    className={cn(
                        'font-mono text-5xl font-bold tabular-nums',
                        possession === 'away' && 'text-possession',
                    )}
                >
                    {awayScore}
                </span>
                <TimeoutsIndicator remaining={awayTimeoutsRemaining} total={totalTimeouts} />
            </div>
        </div>
    );
}
