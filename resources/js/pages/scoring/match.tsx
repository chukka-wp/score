import { Head } from '@inertiajs/react';
import { TablePropertiesIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { EventButtonPanel } from '@/components/scoring/event-button-panel';
import { EventEntry } from '@/components/scoring/event-entry';
import { EventHistory } from '@/components/scoring/event-history';
import { ExclusionPanel } from '@/components/scoring/exclusion-panel';
import { HotkeyReference } from '@/components/scoring/hotkey-reference';
import { PeriodTransitionPrompt } from '@/components/scoring/period-transition-prompt';
import { RecentEvents } from '@/components/scoring/recent-events';
import { ScoreHeader } from '@/components/scoring/score-header';
import { ScoresheetPanel } from '@/components/scoring/scoresheet-panel';
import { ShootoutPanel } from '@/components/scoring/shootout-panel';
import { SyncIndicator } from '@/components/scoring/sync-indicator';
import { TeamScopeSelector } from '@/components/scoring/team-scope-selector';
import { TimingCorrectionModal } from '@/components/scoring/timing-correction-modal';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useClockControl } from '@/hooks/use-clock-control';
import { useEventEntry } from '@/hooks/use-event-entry';
import { useExclusionTimers } from '@/hooks/use-exclusion-timers';
import { useGameState } from '@/hooks/use-game-state';
import { useHotkeys } from '@/hooks/use-hotkeys';
import { useOfflineQueue } from '@/hooks/use-offline-queue';
import { useScorerSession } from '@/hooks/use-scorer-session';
import { useScoringAudio } from '@/hooks/use-scoring-audio';
import ScoringLayout from '@/layouts/scoring-layout';
import type { EventType, Match, MatchEvent, ReverbConfig, RosterEntry, RuleSet } from '@/types';

type Props = {
    match: Match;
    game_state: Parameters<typeof useGameState>[1];
    home_roster: RosterEntry[];
    away_roster: RosterEntry[];
    events: MatchEvent[];
    rule_set: RuleSet;
    scorer_token: string;
    reverb_config: ReverbConfig;
};

export default function ScoringMatch({
    match,
    game_state,
    home_roster,
    away_roster,
    events: initialEvents,
    rule_set,
    scorer_token,
    reverb_config,
}: Props) {
    // Stabilise reverbConfig — Inertia props are stable but memoize to be safe
    const stableReverbConfig = useMemo(() => reverb_config, [reverb_config.key, reverb_config.host, reverb_config.port, reverb_config.scheme]);

    const { gameState, applyOptimisticEvent } = useGameState(match.id, game_state, stableReverbConfig, '');

    const session = useScorerSession(scorer_token, match.id, gameState.current_period, rule_set.periods);
    const queue = useOfflineQueue(match.id, session.token);

    const clockControlRef = useRef<ReturnType<typeof useClockControl>>(null!);

    const enqueueWithOptimism = useCallback(
        async (event: Parameters<typeof queue.enqueue>[0]) => {
            applyOptimisticEvent(event.type, event.payload);

            // Auto-reset possession clock immediately (before network)
            if (rule_set.possession_clock_enabled && clockControlRef.current) {
                const cc = clockControlRef.current;

                switch (event.type) {
                    case 'possession_change':
                    case 'goal':
                        cc.resetPossessionClock(rule_set.possession_time_seconds, 'new_possession');
                        break;
                    case 'exclusion_foul':
                        // WA rules: reset to reduced, but never decrease the clock
                        cc.resetPossessionClock(
                            Math.max(cc.possessionClockSeconds ?? 0, rule_set.second_possession_time_seconds),
                            'exclusion_foul',
                        );
                        break;
                    case 'shot':
                        cc.resetPossessionClock(rule_set.second_possession_time_seconds, 'shot_rebound_attacking');
                        break;
                    case 'two_meter_throw':
                        cc.resetPossessionClock(rule_set.second_possession_time_seconds, 'two_meter_throw');
                        break;
                }
            }

            return queue.enqueue(event);
        },
        [applyOptimisticEvent, queue, rule_set],
    );

    const playSound = useScoringAudio();
    const handleEventAccepted = useCallback(() => playSound('event_accepted'), [playSound]);

    const eventEntry = useEventEntry(gameState, session.teamScope, home_roster, away_roster, enqueueWithOptimism, handleEventAccepted);
    const exclusionTimers = useExclusionTimers(gameState.active_exclusions);
    const clockControl = useClockControl(gameState, rule_set, enqueueWithOptimism);
    clockControlRef.current = clockControl;

    // Audio alerts for clock expiry
    const prevPossessionRef = useRef(clockControl.possessionClockSeconds);
    const prevPeriodRef = useRef(clockControl.periodClockSeconds);
    const prevExclusionCountRef = useRef(exclusionTimers.length);

    useEffect(() => {
        const prevPoss = prevPossessionRef.current;
        const currPoss = clockControl.possessionClockSeconds;
        prevPossessionRef.current = currPoss;

        if (prevPoss !== null && prevPoss > 0 && currPoss === 0) {
            playSound('possession_expired');
        }
    }, [clockControl.possessionClockSeconds, playSound]);

    useEffect(() => {
        const prev = prevPeriodRef.current;
        const curr = clockControl.periodClockSeconds;
        prevPeriodRef.current = curr;

        if (prev > 0 && curr === 0 && clockControl.isClockRunning) {
            playSound('period_expired');
        }
    }, [clockControl.periodClockSeconds, clockControl.isClockRunning, playSound]);

    useEffect(() => {
        const prevCount = prevExclusionCountRef.current;
        const currCount = exclusionTimers.length;
        prevExclusionCountRef.current = currCount;

        if (currCount < prevCount && prevCount > 0) {
            playSound('exclusion_expired');
        }
    }, [exclusionTimers.length, playSound]);

    const [historyOpen, setHistoryOpen] = useState(false);
    const [timingOpen, setTimingOpen] = useState(false);
    const [hotkeyRefOpen, setHotkeyRefOpen] = useState(false);
    const [periodPromptOpen, setPeriodPromptOpen] = useState(false);
    const [scoresheetOpen, setScoresheetOpen] = useState(false);
    const [scopeSelectorVisible, setScopeSelectorVisible] = useState(!session.teamScope);

    const inWaterByTeam = useMemo(() => {
        const homeIn = new Set(home_roster.filter((r) => r.is_starting).map((r) => r.player_id));
        const awayIn = new Set(away_roster.filter((r) => r.is_starting).map((r) => r.player_id));
        const homePlayerIds = new Set(home_roster.map((r) => r.player_id));

        for (const event of initialEvents) {
            if (event.type !== 'substitution' && event.type !== 'goalkeeper_substitution') {
                continue;
            }

            const payload = event.payload as Record<string, unknown>;
            const playerId = payload.player_id as string | undefined;

            if (!playerId) {
                continue;
            }

            const targetSet = homePlayerIds.has(playerId) ? homeIn : awayIn;
            const action = payload.action as string | undefined;

            if (action === 'sub_off') {
                targetSet.delete(playerId);
            } else if (action === 'sub_on') {
                targetSet.add(playerId);
            }
        }

        return { white: homeIn, blue: awayIn };
    }, [home_roster, away_roster, initialEvents]);

    const isShootoutMode = gameState.status === 'shootout';

    const recentEvents = useMemo(
        () => initialEvents.slice(-10).reverse(),
        [initialEvents],
    );

    const modalActions = useMemo(() => ({
        openHistory: () => setHistoryOpen(true),
        openTimingCorrection: () => setTimingOpen(true),
        openHotkeyReference: () => setHotkeyRefOpen(true),
        openPeriodTransition: () => setPeriodPromptOpen(true),
    }), []);

    useHotkeys(
        eventEntry,
        clockControl,
        gameState,
        isShootoutMode,
        modalActions,
        rule_set,
        session.sidesSwapped,
    );

    function handlePeriodEnd(): void {
        enqueueWithOptimism({
            type: 'period_end',
            period: gameState.current_period,
            period_clock_seconds: gameState.period_clock_seconds,
            payload: {},
        });
        setPeriodPromptOpen(false);
    }

    function handleTimingCorrection(periodClock: number, possessionClock: number | null): void {
        queue.enqueue({
            type: 'correction',
            period: gameState.current_period,
            period_clock_seconds: periodClock,
            payload: {
                action: 'timing_correction',
                period_clock_seconds: periodClock,
                possession_clock_seconds: possessionClock,
            },
        });
        setTimingOpen(false);
    }

    function handleVoidEvent(eventId: string): void {
        queue.enqueue({
            type: 'correction',
            period: gameState.current_period,
            period_clock_seconds: gameState.period_clock_seconds,
            payload: {
                corrects_event_id: eventId,
                action: 'void',
            },
        });
    }

    const BUTTON_DIRECT_EVENTS: EventType[] = [
        'timeout_start', 'free_throw', 'two_meter_throw',
    ];

    function handleButtonAction(type: EventType, team: 'white' | 'blue'): void {
        if (BUTTON_DIRECT_EVENTS.includes(type)) {
            enqueueWithOptimism({
                type,
                period: gameState.current_period,
                period_clock_seconds: gameState.period_clock_seconds,
                payload: { team_side: team },
            });

            return;
        }

        eventEntry.startEvent(type);
        eventEntry.setTeam(team);
    }

    const handleToggleInWater = useCallback(
        (playerId: string, capNumber: number, team: 'white' | 'blue', action: 'sub_on' | 'sub_off') => {
            const roster = team === 'blue' ? away_roster : home_roster;
            const entry = roster.find((r) => r.player_id === playerId);
            const isGk = entry?.role === 'goalkeeper' || entry?.role === 'substitute_goalkeeper';

            enqueueWithOptimism({
                type: isGk ? 'goalkeeper_substitution' : 'substitution',
                period: gameState.current_period,
                period_clock_seconds: gameState.period_clock_seconds,
                payload: {
                    team_side: team,
                    player_id: playerId,
                    cap_number: capNumber,
                    action,
                },
            });
        },
        [enqueueWithOptimism, gameState.current_period, gameState.period_clock_seconds, home_roster, away_roster],
    );

    const handleScoresheetPlayerAction = useCallback(
        (type: EventType, capNumber: number, team: 'white' | 'blue') => {
            enqueueWithOptimism({
                type,
                period: gameState.current_period,
                period_clock_seconds: gameState.period_clock_seconds,
                payload: { team_side: team, cap_number: capNumber },
            });
        },
        [enqueueWithOptimism, gameState.current_period, gameState.period_clock_seconds],
    );

    const handleScoresheetTeamAction = useCallback(
        (type: EventType, team: 'white' | 'blue') => {
            enqueueWithOptimism({
                type,
                period: gameState.current_period,
                period_clock_seconds: gameState.period_clock_seconds,
                payload: { team_side: team },
            });
        },
        [enqueueWithOptimism, gameState.current_period, gameState.period_clock_seconds],
    );

    const scoresheetProps = useMemo(() => ({
        homeRoster: home_roster,
        awayRoster: away_roster,
        events: initialEvents,
        gameState,
        exclusionTimers,
        foulLimit: rule_set.personal_foul_limit,
        onPlayerAction: handleScoresheetPlayerAction,
        onTeamAction: handleScoresheetTeamAction,
        onToggleInWater: handleToggleInWater,
        homeInWaterIds: inWaterByTeam.white,
        awayInWaterIds: inWaterByTeam.blue,
        sidesSwapped: session.sidesSwapped,
    }), [home_roster, away_roster, initialEvents, gameState, exclusionTimers, rule_set.personal_foul_limit, handleScoresheetPlayerAction, handleScoresheetTeamAction, handleToggleInWater, inWaterByTeam, session.sidesSwapped]);

    return (
        <>
            <Head title="Live Scoring" />
            <div className="flex h-full flex-col">
                {/* Team scope selector overlay */}
                {scopeSelectorVisible && (
                    <div className="bg-background/80 absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                        <div className="space-y-4 text-center">
                            <h2 className="text-xl font-semibold">Select your team</h2>
                            <p className="text-muted-foreground text-sm">
                                Choose your team for team-scoped scoring, or select Both for neutral scoring.
                            </p>
                            <TeamScopeSelector
                                value={session.teamScope}
                                onChange={(scope) => {
                                    session.setTeamScope(scope);
                                    setScopeSelectorVisible(false);
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Score Header */}
                <ScoreHeader
                    homeScore={gameState.home_score}
                    awayScore={gameState.away_score}
                    currentPeriod={gameState.current_period}
                    periodClockSeconds={clockControl.periodClockSeconds}
                    possessionClockSeconds={clockControl.possessionClockSeconds}
                    possession={gameState.possession}
                    homeTimeoutsRemaining={gameState.home_timeouts_remaining}
                    awayTimeoutsRemaining={gameState.away_timeouts_remaining}
                    totalTimeouts={rule_set.timeouts_per_team}
                    isClockRunning={clockControl.isClockRunning}
                    isPossessionPaused={clockControl.isPossessionPaused}
                    isRunningTime={rule_set.running_time}
                    sidesSwapped={session.sidesSwapped}
                />

                {/* Exclusion Panel — mobile/tablet only (desktop shows inline in scoresheet) */}
                <div className="lg:hidden">
                    <ExclusionPanel
                        exclusions={exclusionTimers}
                        homeTeamId={match.home_team_id}
                        sidesSwapped={session.sidesSwapped}
                    />
                </div>

                {/* Main scoring area */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {isShootoutMode ? (
                        <ShootoutPanel shootoutState={gameState.shootout_state} homeTeamId={match.home_team_id} />
                    ) : (
                        <>
                            {/* Event Entry (keyboard) — always visible */}
                            <div className="border-b px-4 py-3">
                                <EventEntry
                                    entryState={eventEntry.state}
                                    teamScope={session.teamScope}
                                />
                            </div>

                            {/* Mobile + Tablet: Button panel for touch entry */}
                            <div className="border-b px-4 py-2 lg:hidden">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <EventButtonPanel
                                            onAction={handleButtonAction}
                                            disabled={eventEntry.state.step !== 'idle'}
                                            sidesSwapped={session.sidesSwapped}
                                        />
                                    </div>

                                    {/* Tablet: Scoresheet slideover trigger */}
                                    <div className="hidden self-start md:block lg:hidden">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setScoresheetOpen(true)}
                                            className="gap-1.5"
                                        >
                                            <TablePropertiesIcon className="size-4" />
                                            <span className="sr-only sm:not-sr-only">Sheet</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop: Scoresheet replaces button panel */}
                            <div className="hidden min-h-0 flex-1 overflow-auto border-b px-4 py-2 lg:block">
                                <ScoresheetPanel {...scoresheetProps} />
                            </div>
                        </>
                    )}

                    {/* Recent Events */}
                    <div className="flex-1 overflow-auto px-4 py-2 lg:max-h-48 lg:flex-none">
                        <RecentEvents
                            events={recentEvents}
                            onUndo={eventEntry.undo}
                        />
                    </div>
                </div>

                {/* Sync Indicator */}
                <SyncIndicator
                    status={queue.syncStatus}
                    pendingCount={queue.pendingCount}
                    sidesSwapped={session.sidesSwapped}
                    onToggleSides={session.toggleSides}
                />

                {/* Modals */}
                <EventHistory
                    events={initialEvents}
                    open={historyOpen}
                    onClose={() => setHistoryOpen(false)}
                    onVoid={handleVoidEvent}
                />

                <TimingCorrectionModal
                    open={timingOpen}
                    onClose={() => setTimingOpen(false)}
                    periodClockSeconds={clockControl.periodClockSeconds}
                    possessionClockSeconds={clockControl.possessionClockSeconds}
                    onApply={handleTimingCorrection}
                />

                <HotkeyReference
                    open={hotkeyRefOpen}
                    onClose={() => setHotkeyRefOpen(false)}
                />

                <PeriodTransitionPrompt
                    open={periodPromptOpen}
                    onClose={() => setPeriodPromptOpen(false)}
                    currentPeriod={gameState.current_period}
                    onConfirm={handlePeriodEnd}
                />

                {/* Tablet: Scoresheet slideover */}
                <Sheet open={scoresheetOpen} onOpenChange={setScoresheetOpen}>
                    <SheetContent side="right" className="w-[90vw] sm:max-w-xl">
                        <SheetHeader>
                            <SheetTitle>Scoresheet</SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-auto px-4 pb-4">
                            <ScoresheetPanel {...scoresheetProps} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}

ScoringMatch.layout = (page: React.ReactNode) => <ScoringLayout>{page}</ScoringLayout>;
