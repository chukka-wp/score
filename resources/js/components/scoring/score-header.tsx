import { ChevronRightIcon } from 'lucide-react';

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
    sidesSwapped: boolean;
};

function TeamColumn({
    label,
    score,
    timeoutsRemaining,
    totalTimeouts,
    hasPossession,
}: {
    label: string;
    score: number;
    timeoutsRemaining: number;
    totalTimeouts: number;
    hasPossession: boolean;
}) {
    return (
        <div
            className={cn(
                'flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors duration-200',
                hasPossession ? 'bg-foreground/10' : 'bg-transparent',
            )}
        >
            <div className="font-mono text-xs font-medium uppercase tracking-wide text-foreground">
                {label}
            </div>

            <div className="font-mono text-4xl font-semibold tabular-nums sm:text-5xl">
                {score}
            </div>

            <TimeoutsIndicator remaining={timeoutsRemaining} total={totalTimeouts} />
        </div>
    );
}

function PossessionArrow({ visible, direction }: { visible: boolean; direction: 'left' | 'right' }) {
    return (
        <div className={cn(
            'flex w-6 items-center justify-center transition-opacity duration-200 sm:w-7',
            visible ? 'opacity-100' : 'opacity-0',
        )}>
            <ChevronRightIcon
                className={cn(
                    'size-6 text-foreground/60 sm:size-7',
                    direction === 'left' && 'rotate-180',
                )}
            />
        </div>
    );
}

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
    sidesSwapped,
}: Props) {
    const leftTeam = sidesSwapped ? 'away' : 'home';
    const rightTeam = sidesSwapped ? 'home' : 'away';

    const leftLabel = leftTeam === 'home' ? 'WHITE' : 'BLUE';
    const rightLabel = rightTeam === 'home' ? 'WHITE' : 'BLUE';

    const leftScore = leftTeam === 'home' ? homeScore : awayScore;
    const rightScore = rightTeam === 'home' ? homeScore : awayScore;

    const leftTimeouts = leftTeam === 'home' ? homeTimeoutsRemaining : awayTimeoutsRemaining;
    const rightTimeouts = rightTeam === 'home' ? homeTimeoutsRemaining : awayTimeoutsRemaining;

    const leftHasPossession = possession === leftTeam;
    const rightHasPossession = possession === rightTeam;

    return (
        <div className="rounded-lg bg-card px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center justify-between gap-0 sm:gap-1">
                {/* Left team */}
                <TeamColumn
                    label={leftLabel}
                    score={leftScore}
                    timeoutsRemaining={leftTimeouts}
                    totalTimeouts={totalTimeouts}
                    hasPossession={leftHasPossession}
                />

                {/* Left arrow — always takes space, fades in/out */}
                <PossessionArrow visible={leftHasPossession} direction="right" />

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

                {/* Right arrow — always takes space, fades in/out */}
                <PossessionArrow visible={rightHasPossession} direction="left" />

                {/* Right team */}
                <TeamColumn
                    label={rightLabel}
                    score={rightScore}
                    timeoutsRemaining={rightTimeouts}
                    totalTimeouts={totalTimeouts}
                    hasPossession={rightHasPossession}
                />
            </div>
        </div>
    );
}
