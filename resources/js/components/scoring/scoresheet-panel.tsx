import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import type { ExclusionTimerEntry } from '@/hooks/use-exclusion-timers';
import { formatShortClock } from '@/lib/format';
import { cn } from '@/lib/utils';

import type { EventType, GameState, MatchEvent, RosterEntry, UUID } from '@/types';

type Props = {
    homeRoster: RosterEntry[];
    awayRoster: RosterEntry[];
    events: MatchEvent[];
    gameState: GameState;
    exclusionTimers: ExclusionTimerEntry[];
    foulLimit: number;
    onPlayerAction: (type: EventType, capNumber: number, team: 'white' | 'blue') => void;
    onTeamAction: (type: EventType, team: 'white' | 'blue') => void;
    onToggleInWater: (playerId: string, capNumber: number, team: 'white' | 'blue', action: 'sub_on' | 'sub_off') => void;
    homeInWaterIds: Set<string>;
    awayInWaterIds: Set<string>;
    sidesSwapped: boolean;
};

type PlayerRow = {
    roster_id: number;
    external_player_id: string | null;
    cap_number: number;
    name: string;
    isGoalkeeper: boolean;
    isInWater: boolean;
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
    inWaterIds: Set<string>,
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
            const playerId = entry.external_player_id ?? '';
            const fouls = playerId ? (foulCounts[playerId] ?? 0) : 0;

            return {
                roster_id: entry.id,
                external_player_id: entry.external_player_id,
                cap_number: entry.cap_number,
                name: entry.player_name,
                isGoalkeeper: entry.role === 'goalkeeper' || entry.role === 'substitute_goalkeeper',
                isInWater: inWaterIds.has(String(entry.id)),
                goals: goalCounts.get(entry.cap_number) ?? 0,
                fouls,
                isFouledOut: fouls >= foulLimit && playerId !== '' && excludedForGame.includes(playerId),
                isExcludedForGame: playerId !== '' && excludedForGame.includes(playerId),
                activeExclusion: playerId ? (exclusionTimers.find((ex) => ex.player_id === playerId) ?? null) : null,
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
                        'size-2 rounded-full',
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
                isUrgent ? 'animate-pulse text-exclusion-urgent' : 'text-exclusion',
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onTeamAction,
    onToggleInWater,
}: {
    team: 'white' | 'blue';
    players: PlayerRow[];
    teamScore: number;
    foulLimit: number;
    selectedCap: number | null;
    onSelectCap: (cap: number | null) => void;
    onPlayerAction: (type: EventType, capNumber: number) => void;
    onTeamAction: (type: EventType) => void;
    onToggleInWater: (playerId: string, capNumber: number) => void;
}) {
    return (
        <div className="flex flex-col">
            {/* Team header */}
            <div className="flex items-center justify-between px-2 pb-1.5">
                <div className="font-mono text-xs font-medium uppercase tracking-wide text-foreground">
                    {team === 'white' ? 'White' : 'Blue'}
                </div>
                <div className="font-mono text-sm font-semibold tabular-nums">{teamScore}</div>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[1.25rem_2rem_1fr_1.5rem_auto] items-center gap-x-1.5 border-b border-border/50 px-2 pb-1 text-xs text-muted-foreground">
                <div />
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
                        <div key={player.roster_id}>
                            <div
                                role="button"
                                tabIndex={0}
                                data-cap={player.cap_number}
                                className={cn(
                                    'grid cursor-pointer grid-cols-[1.25rem_2rem_1fr_1.5rem_auto] items-center gap-x-1.5 rounded px-2 py-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
                                    isExcluded && 'bg-exclusion/10 ring-1 ring-exclusion/20',
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
                                {/* In-water indicator */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleInWater(String(player.roster_id), player.cap_number);
                                    }}
                                    className={cn(
                                        'flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                                        player.isInWater
                                            ? 'border-primary bg-primary'
                                            : 'border-muted-foreground/30 bg-transparent hover:border-muted-foreground/50',
                                    )}
                                    aria-label={player.isInWater ? 'In water — click to sub off' : 'On bench — click to sub on'}
                                />

                                {/* Cap number */}
                                <div className={cn(
                                    'font-mono text-sm tabular-nums',
                                    !player.isInWater && !isOut && 'text-muted-foreground',
                                )}>
                                    {player.cap_number}
                                </div>

                                {/* Name + exclusion timer */}
                                <div className={cn(
                                    'flex items-center gap-1 truncate text-sm',
                                    isOut && 'line-through',
                                    !player.isInWater && !isOut && 'text-muted-foreground',
                                )}>
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
                                <div
                                    className="flex flex-wrap gap-1 px-2 pt-0.5 pb-1.5 animate-in fade-in slide-in-from-top-1 duration-150"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                            e.stopPropagation();
                                            onSelectCap(null);
                                            const row = e.currentTarget.previousElementSibling as HTMLElement | null;
                                            row?.focus();
                                        }
                                    }}
                                >
                                    {PLAYER_ACTIONS.map((action, idx) => (
                                        <Button
                                            key={action.type}
                                            variant={action.variant}
                                            size="xs"
                                            autoFocus={idx === 0}
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
    onToggleInWater,
    homeInWaterIds,
    awayInWaterIds,
    sidesSwapped,
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
                homeInWaterIds,
            ),
        [homeRoster, events, gameState.player_foul_counts, exclusionTimers, gameState.players_excluded_for_game, foulLimit, homeInWaterIds],
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
                awayInWaterIds,
            ),
        [awayRoster, events, gameState.player_foul_counts, exclusionTimers, gameState.players_excluded_for_game, foulLimit, awayInWaterIds],
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

    const handleWhiteToggle = useCallback(
        (playerId: string, capNumber: number) => {
            const action = homeInWaterIds.has(playerId) ? 'sub_off' : 'sub_on';
            onToggleInWater(playerId, capNumber, 'white', action);
        },
        [homeInWaterIds, onToggleInWater],
    );

    const handleBlueToggle = useCallback(
        (playerId: string, capNumber: number) => {
            const action = awayInWaterIds.has(playerId) ? 'sub_off' : 'sub_on';
            onToggleInWater(playerId, capNumber, 'blue', action);
        },
        [awayInWaterIds, onToggleInWater],
    );

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

    const leftTeam = sidesSwapped ? 'blue' : 'white';
    const rightTeam = sidesSwapped ? 'white' : 'blue';

    const leftPlayers = leftTeam === 'white' ? homePlayers : awayPlayers;
    const rightPlayers = rightTeam === 'white' ? homePlayers : awayPlayers;

    const leftScore = leftTeam === 'white' ? gameState.home_score : gameState.away_score;
    const rightScore = rightTeam === 'white' ? gameState.home_score : gameState.away_score;

    const leftSelectedCap = leftTeam === 'white' ? selectedWhiteCap : selectedBlueCap;
    const rightSelectedCap = rightTeam === 'white' ? selectedWhiteCap : selectedBlueCap;

    const leftSelectCap = leftTeam === 'white' ? handleSelectWhite : handleSelectBlue;
    const rightSelectCap = rightTeam === 'white' ? handleSelectWhite : handleSelectBlue;

    const leftPlayerAction = leftTeam === 'white' ? handleWhiteAction : handleBlueAction;
    const rightPlayerAction = rightTeam === 'white' ? handleWhiteAction : handleBlueAction;

    const leftTeamAction = leftTeam === 'white' ? handleWhiteTeam : handleBlueTeam;
    const rightTeamAction = rightTeam === 'white' ? handleWhiteTeam : handleBlueTeam;

    const leftToggle = leftTeam === 'white' ? handleWhiteToggle : handleBlueToggle;
    const rightToggle = rightTeam === 'white' ? handleWhiteToggle : handleBlueToggle;

    return (
        <div className="grid h-full grid-cols-[1fr_1px_1fr] gap-x-3 rounded-lg bg-card p-3">
            <TeamSection
                team={leftTeam}
                players={leftPlayers}
                teamScore={leftScore}
                foulLimit={foulLimit}
                selectedCap={leftSelectedCap}
                onSelectCap={leftSelectCap}
                onPlayerAction={leftPlayerAction}
                onTeamAction={leftTeamAction}
                onToggleInWater={leftToggle}
            />

            {/* Vertical divider */}
            <div className="bg-border" />

            <TeamSection
                team={rightTeam}
                players={rightPlayers}
                teamScore={rightScore}
                foulLimit={foulLimit}
                selectedCap={rightSelectedCap}
                onSelectCap={rightSelectCap}
                onPlayerAction={rightPlayerAction}
                onTeamAction={rightTeamAction}
                onToggleInWater={rightToggle}
            />
        </div>
    );
}
