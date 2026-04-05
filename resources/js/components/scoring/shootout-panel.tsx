import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ShootoutShot = {
    team_id: string;
    player_id: string;
    cap_number: number;
    round: number;
    outcome: 'goal' | 'miss' | 'saved';
};

type ShootoutState = {
    home_score: number;
    away_score: number;
    current_round: number;
    shots: ShootoutShot[];
    next_shooting_team: string;
};

type Props = {
    shootoutState: ShootoutState | null;
    homeExternalTeamId: string;
};

const OUTCOME_SYMBOLS: Record<string, string> = {
    goal: '\u2713',
    miss: '\u2717',
    saved: 'S',
};

const OUTCOME_COLORS: Record<string, string> = {
    goal: 'text-sync-online',
    miss: 'text-destructive',
    saved: 'text-muted-foreground',
};

export function ShootoutPanel({ shootoutState, homeExternalTeamId }: Props) {
    if (!shootoutState) {
        return null;
    }

    const { home_score, away_score, current_round, shots, next_shooting_team } = shootoutState;
    const teamLabel = (teamId: string) => teamId === homeExternalTeamId ? 'White' : 'Blue';

    // Group shots by round for display
    const maxRound = Math.max(current_round, ...shots.map((s) => s.round));
    const rounds = Array.from({ length: maxRound }, (_, i) => i + 1);

    return (
        <div className="rounded-lg bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Penalty Shootout
                </span>

                <Badge variant="secondary">Round {current_round}</Badge>
            </div>

            {/* Shootout scores */}
            <div className="mb-4 flex items-center justify-center gap-6">
                <div className="flex flex-col items-center">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">White</span>
                    <span className="font-mono text-3xl font-bold tabular-nums">{home_score}</span>
                </div>

                <span className="text-lg text-muted-foreground">-</span>

                <div className="flex flex-col items-center">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Blue</span>
                    <span className="font-mono text-3xl font-bold tabular-nums">{away_score}</span>
                </div>
            </div>

            {/* Shot grid */}
            <div className="space-y-1">
                {rounds.map((round) => {
                    const roundShots = shots.filter((s) => s.round === round);

                    return (
                        <div key={round} className="flex items-center gap-2 text-sm">
                            <span className="w-6 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                                {round}.
                            </span>

                            {roundShots.map((shot) => (
                                <span
                                    key={`${shot.team_id}-${shot.round}`}
                                    className={cn(
                                        'font-mono text-sm font-semibold',
                                        OUTCOME_COLORS[shot.outcome],
                                    )}
                                >
                                    #{shot.cap_number} {OUTCOME_SYMBOLS[shot.outcome]}
                                </span>
                            ))}

                            {roundShots.length === 0 && (
                                <span className="text-xs text-muted-foreground/50">-</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Next shooting indicator */}
            <div className="mt-3 text-xs text-muted-foreground">
                Next: <span className="font-medium uppercase">{teamLabel(next_shooting_team)}</span>
            </div>
        </div>
    );
}
