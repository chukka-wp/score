import { useCallback, useMemo, useState } from 'react';

import { formatShortClock } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import type { EventType, GameState, MatchEvent, RosterEntry, UUID } from '@/types';
import type { ExclusionTimerEntry } from '@/hooks/use-exclusion-timers';

type Props = {
    homeRoster: RosterEntry[];
    awayRoster: RosterEntry[];
    events: MatchEvent[];
    gameState: GameState;
    exclusionTimers: ExclusionTimerEntry[];
    foulLimit: number;
    onPlayerAction: (type: EventType, capNumber: number, team: 'white' | 'blue') => void;
    onTeamAction: (type: EventType, team: 'white' | 'blue') => void;
};

type PlayerRow = {
    player_id: UUID;
    cap_number: number;
    name: string;
    isGoalkeeper: boolean;
    goals: number;
    fouls: number;
    isFouledOut: boolean;
    isExcludedForGame: boolean;
    activeExclusion: ExclusionTimerEntry | null;
    totalExclusions: number;
};

const PLAYER_ACTIONS: {
    label: string;
    type: EventType;
    variant: 'default' | 'outline' | 'secondary' | 'destructive';
}[] = [
    { label: 'Goal', type: 'goal', variant: 'default' },
    { label: 'Excl', type: 'exclusion_foul', variant: 'outline' },
    { label: 'Foul', type: 'ordinary_foul', variant: 'secondary' },
    { label: 'Pen', type: 'penalty_throw_taken', variant: 'outline' },
    { label: 'Yel', type: 'yellow_card', variant: 'outline' },
    { label: 'Red', type: 'red_card', variant: 'destructive' },
];

function derivePlayerRows(
    roster: RosterEntry[],
    events: MatchEvent[],
    foulCounts: Record<UUID, number>,
    exclusionTimers: ExclusionTimerEntry[],
    excludedForGame: UUID[],
    foulLimit: number,
    team: 'white' | 'blue',
): PlayerRow[] {
    const goalCounts = new Map<number, number>();
    const exclusionCounts = new Map<number, number>();

    for (const event of events) {
        if (event.payload.team_side !== team) {
            continue;
        }

        const cap = event.payload.cap_number as number | undefined;

        if (cap === undefined) {
            continue;
        }

        if (event.type === 'goal') {
            goalCounts.set(cap, (goalCounts.get(cap) ?? 0) + 1);
        }

        if (
            event.type === 'exclusion_foul' ||
            event.type === 'violent_action_exclusion' ||
            event.type === 'misconduct_exclusion'
        ) {
            exclusionCounts.set(cap, (exclusionCounts.get(cap) ?? 0) + 1);
        }
    }

    return roster
        .slice()
        .sort((a, b) => {
            if (a.role === 'goalkeeper' && b.role !== 'goalkeeper') {
                return -1;
            }

            if (b.role === 'goalkeeper' && a.role !== 'goalkeeper') {
                return 1;
            }

            return a.cap_number - b.cap_number;
        })
        .map((entry) => {
            const fouls = foulCounts[entry.player_id] ?? 0;

            return {
                player_id: entry.player_id,
                cap_number: entry.cap_number,
                name: entry.player?.preferred_name ?? entry.player?.name ?? '',
                isGoalkeeper: entry.role === 'goalkeeper' || entry.role === 'substitute_goalkeeper',
                goals: goalCounts.get(entry.cap_number) ?? 0,
                fouls,
                isFouledOut: fouls >= foulLimit && excludedForGame.includes(entry.player_id),
                isExcludedForGame: excludedForGame.includes(entry.player_id),
                activeExclusion: exclusionTimers.find((ex) => ex.player_id === entry.player_id) ?? null,
                totalExclusions: exclusionCounts.get(entry.cap_number) ?? 0,
            };
        });
}

function FoulDots({ fouls, limit }: { fouls: number; limit: number }) {
    return (
        <div
            className="flex items-center gap-0.5"
            role="img"
            aria-label={`${fouls} of ${limit} fouls`}
        >
            {Array.from({ length: limit }, (_, i) => (
                <div
                    key={i}
                    className={cn(
                        'size-1.5 rounded-full',
                        i < fouls
                            ? fouls >= limit
                                ? 'bg-destructive'
                                : fouls >= limit - 1
                                  ? 'bg-sync-syncing'
                                  : 'bg-foreground'
                            : 'bg-muted',
                    )}
                />
            ))}
        </div>
    );
}

function ExclusionBadge({ exclusion }: { exclusion: ExclusionTimerEntry }) {
    const seconds = Math.ceil(exclusion.display_seconds);
    const isUrgent = seconds < 5;

    return (
        <span
            className={cn(
                'ml-auto font-mono text-xs font-semibold tabular-nums',
                isUrgent ? 'animate-pulse text-exclusion-urgent' : 'text-amber-600 dark:text-amber-400',
            )}
        >
            {formatShortClock(seconds)}
        </span>
    );
}

function TeamSection({
    team,
    players,
    teamScore,
    foulLimit,
    selectedCap,
    onSelectCap,
    onPlayerAction,
    onTeamAction,
}: {
    team: 'white' | 'blue';
    players: PlayerRow[];
    teamScore: number;
    foulLimit: number;
    selectedCap: number | null;
    onSelectCap: (cap: number | null) => void;
    onPlayerAction: (type: EventType, capNumber: number) => void;
    onTeamAction: (type: EventType) => void;
}) {
    return (
        <div className="flex flex-col">
            {/* Team header */}
            <div className="flex items-center justify-between px-2 pb-1.5">
                <div
                    className={cn(
                        'font-mono text-xs font-medium uppercase tracking-wide',
                        team === 'white' ? 'text-team-white-foreground' : 'text-team-blue-foreground',
                    )}
                >
                    {team === 'white' ? 'White' : 'Blue'}
                </div>
                <div className="font-mono text-sm font-semibold tabular-nums">{teamScore}</div>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[2.5rem_1fr_1.5rem_auto] items-center gap-x-2 border-b border-border/50 px-2 pb-1 text-xs text-muted-foreground">
                <div className="font-mono">#</div>
                <div>Name</div>
                <div className="text-center font-mono">G</div>
                <div className="text-center">Fouls</div>
            </div>

            {/* Player rows */}
            <div className="flex-1 overflow-auto">
                {players.map((player) => {
                    const isSelected = selectedCap === player.cap_number;
                    const isOut = player.isExcludedForGame;
                    const isExcluded = !!player.activeExclusion;

                    return (
                        <div key={player.player_id}>
                            <div
                                role="button"
                                tabIndex={0}
                                className={cn(
                                    'grid cursor-pointer grid-cols-[2.5rem_1fr_1.5rem_auto] items-center gap-x-2 rounded px-2 py-1',
                                    isExcluded && 'bg-amber-500/10 ring-1 ring-amber-500/20',
                                    isSelected && !isExcluded && 'bg-muted',
                                    isOut && 'bg-destructive/5 opacity-40',
                                    !isSelected && !isOut && !isExcluded && 'hover:bg-muted/50',
                                )}
                                onClick={() => onSelectCap(isSelected ? null : player.cap_number)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onSelectCap(isSelected ? null : player.cap_number);
                                    }
                                }}
                            >
                                {/* Cap number */}
                                <div className="font-mono text-sm tabular-nums">{player.cap_number}</div>

                                {/* Name + exclusion timer */}
                                <div className={cn('flex items-center gap-1 truncate text-sm', isOut && 'line-through')}>
                                    <span className="truncate">
                                        {player.name || `Player ${player.cap_number}`}
                                        {player.isGoalkeeper && (
                                            <span className="ml-1 text-muted-foreground">GK</span>
                                        )}
                                    </span>
                                    {isOut && <span className="shrink-0 text-xs font-semibold text-destructive">OUT</span>}
                                    {player.activeExclusion && <ExclusionBadge exclusion={player.activeExclusion} />}
                                </div>

                                {/* Goals */}
                                <div className="text-center font-mono text-sm tabular-nums">
                                    {player.goals > 0 ? (
                                        player.goals
                                    ) : (
                                        <span className="text-muted-foreground/30">&mdash;</span>
                                    )}
                                </div>

                                {/* Fouls (combined count toward foul-out) */}
                                <FoulDots fouls={player.fouls} limit={foulLimit} />
                            </div>

                            {/* Action bar (expanded) */}
                            {isSelected && !isOut && (
                                <div className="flex flex-wrap gap-1 px-2 pt-0.5 pb-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                    {PLAYER_ACTIONS.map((action) => (
                                        <Button
                                            key={action.type}
                                            variant={action.variant}
                                            size="xs"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onPlayerAction(action.type, player.cap_number);
                                                onSelectCap(null);
                                            }}
                                        >
                                            {action.label}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Team-level actions */}
            <div className="flex gap-1.5 border-t border-border/50 px-2 pt-2">
                <Button variant="secondary" size="xs" className="flex-1" onClick={() => onTeamAction('timeout_start')}>
                    Timeout
                </Button>
                <Button variant="secondary" size="xs" className="flex-1" onClick={() => onTeamAction('substitution')}>
                    Sub
                </Button>
            </div>
        </div>
    );
}

export function ScoresheetPanel({
    homeRoster,
    awayRoster,
    events,
    gameState,
    exclusionTimers,
    foulLimit,
    onPlayerAction,
    onTeamAction,
}: Props) {
    const [selectedWhiteCap, setSelectedWhiteCap] = useState<number | null>(null);
    const [selectedBlueCap, setSelectedBlueCap] = useState<number | null>(null);

    const homePlayers = useMemo(
        () =>
            derivePlayerRows(
                homeRoster,
                events,
                gameState.player_foul_counts,
                exclusionTimers,
                gameState.players_excluded_for_game,
                foulLimit,
                'white',
            ),
        [homeRoster, events, gameState.player_foul_counts, exclusionTimers, gameState.players_excluded_for_game, foulLimit],
    );

    const awayPlayers = useMemo(
        () =>
            derivePlayerRows(
                awayRoster,
                events,
                gameState.player_foul_counts,
                exclusionTimers,
                gameState.players_excluded_for_game,
                foulLimit,
                'blue',
            ),
        [awayRoster, events, gameState.player_foul_counts, exclusionTimers, gameState.players_excluded_for_game, foulLimit],
    );

    const handleWhiteAction = useCallback(
        (type: EventType, capNumber: number) => onPlayerAction(type, capNumber, 'white'),
        [onPlayerAction],
    );

    const handleBlueAction = useCallback(
        (type: EventType, capNumber: number) => onPlayerAction(type, capNumber, 'blue'),
        [onPlayerAction],
    );

    const handleWhiteTeam = useCallback((type: EventType) => onTeamAction(type, 'white'), [onTeamAction]);
    const handleBlueTeam = useCallback((type: EventType) => onTeamAction(type, 'blue'), [onTeamAction]);

    const handleSelectWhite = useCallback(
        (cap: number | null) => {
            setSelectedWhiteCap(cap);

            if (cap !== null) {
                setSelectedBlueCap(null);
            }
        },
        [],
    );

    const handleSelectBlue = useCallback(
        (cap: number | null) => {
            setSelectedBlueCap(cap);

            if (cap !== null) {
                setSelectedWhiteCap(null);
            }
        },
        [],
    );

    return (
        <div className="grid h-full grid-cols-[1fr_1px_1fr] gap-x-3 rounded-lg bg-card p-3">
            <TeamSection
                team="white"
                players={homePlayers}
                teamScore={gameState.home_score}
                foulLimit={foulLimit}
                selectedCap={selectedWhiteCap}
                onSelectCap={handleSelectWhite}
                onPlayerAction={handleWhiteAction}
                onTeamAction={handleWhiteTeam}
            />

            {/* Vertical divider */}
            <div className="bg-border/30" />

            <TeamSection
                team="blue"
                players={awayPlayers}
                teamScore={gameState.away_score}
                foulLimit={foulLimit}
                selectedCap={selectedBlueCap}
                onSelectCap={handleSelectBlue}
                onPlayerAction={handleBlueAction}
                onTeamAction={handleBlueTeam}
            />
        </div>
    );
}
