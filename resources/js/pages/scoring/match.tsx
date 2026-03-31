import { Head } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';

import { EventButtonPanel } from '@/components/scoring/event-button-panel';
import { EventEntry } from '@/components/scoring/event-entry';
import { EventHistory } from '@/components/scoring/event-history';
import { ExclusionPanel } from '@/components/scoring/exclusion-panel';
import { HotkeyReference } from '@/components/scoring/hotkey-reference';
import { PeriodTransitionPrompt } from '@/components/scoring/period-transition-prompt';
import { RecentEvents } from '@/components/scoring/recent-events';
import { ScoreHeader } from '@/components/scoring/score-header';
import { ShootoutPanel } from '@/components/scoring/shootout-panel';
import { SyncIndicator } from '@/components/scoring/sync-indicator';
import { TeamScopeSelector } from '@/components/scoring/team-scope-selector';
import { TimingCorrectionModal } from '@/components/scoring/timing-correction-modal';
import { useClockControl } from '@/hooks/use-clock-control';
import { useEventEntry } from '@/hooks/use-event-entry';
import { useExclusionTimers } from '@/hooks/use-exclusion-timers';
import { useGameState } from '@/hooks/use-game-state';
import { useHotkeys } from '@/hooks/use-hotkeys';
import { useOfflineQueue } from '@/hooks/use-offline-queue';
import { usePossessionBackdrop } from '@/hooks/use-possession-backdrop';
import { useScorerSession } from '@/hooks/use-scorer-session';
import ScoringLayout from '@/layouts/scoring-layout';
import type { EventType, Match, MatchEvent, ReverbConfig, RosterEntry, RuleSet } from '@/types';
import { cn } from '@/lib/utils';

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
    const session = useScorerSession(scorer_token, match.id);

    // Stabilise reverbConfig — Inertia props are stable but memoize to be safe
    const stableReverbConfig = useMemo(() => reverb_config, [reverb_config.key, reverb_config.host, reverb_config.port, reverb_config.scheme]);

    const { gameState } = useGameState(match.id, game_state, stableReverbConfig, session.token);
    const queue = useOfflineQueue(match.id, session.token);
    const eventEntry = useEventEntry(gameState, session.teamScope, home_roster, away_roster, queue.enqueue);
    const exclusionTimers = useExclusionTimers(gameState.active_exclusions);
    const clockControl = useClockControl(gameState, rule_set, queue.enqueue);
    const backdropClass = usePossessionBackdrop(gameState.possession);

    const [historyOpen, setHistoryOpen] = useState(false);
    const [timingOpen, setTimingOpen] = useState(false);
    const [hotkeyRefOpen, setHotkeyRefOpen] = useState(false);
    const [periodPromptOpen, setPeriodPromptOpen] = useState(false);
    const [scopeSelectorVisible, setScopeSelectorVisible] = useState(!session.teamScope);

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
    );

    function handlePeriodEnd(): void {
        queue.enqueue({
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

    function handleButtonAction(type: EventType, team: 'white' | 'blue'): void {
        eventEntry.startEvent(type);
        eventEntry.setTeam(team);
    }

    return (
        <>
            <Head title="Live Scoring" />
            <div className={cn('flex h-full flex-col transition-colors duration-300', backdropClass)}>
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
                    periodClockSeconds={gameState.period_clock_seconds}
                    possessionClockSeconds={gameState.possession_clock_seconds}
                    possession={gameState.possession}
                    homeTimeoutsRemaining={gameState.home_timeouts_remaining}
                    awayTimeoutsRemaining={gameState.away_timeouts_remaining}
                    totalTimeouts={rule_set.timeouts_per_team}
                    isClockRunning={clockControl.isClockRunning}
                />

                {/* Exclusion Panel */}
                <ExclusionPanel
                    exclusions={exclusionTimers}
                    homeTeamId={match.home_team_id}
                />

                {/* Main scoring area */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {isShootoutMode ? (
                        <ShootoutPanel shootoutState={gameState.shootout_state} />
                    ) : (
                        <>
                            {/* Event Entry */}
                            <div className="border-b px-4 py-3">
                                <EventEntry
                                    entryState={eventEntry.state}
                                    teamScope={session.teamScope}
                                />
                            </div>

                            {/* Button Panel (mouse/tablet) */}
                            <div className="border-b px-4 py-2">
                                <EventButtonPanel
                                    onAction={handleButtonAction}
                                    disabled={eventEntry.state.step !== 'idle'}
                                />
                            </div>
                        </>
                    )}

                    {/* Recent Events */}
                    <div className="flex-1 overflow-auto px-4 py-2">
                        <RecentEvents
                            events={recentEvents}
                            onUndo={eventEntry.undo}
                        />
                    </div>
                </div>

                {/* Sync Indicator */}
                <SyncIndicator status={queue.syncStatus} pendingCount={queue.pendingCount} />

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
                    periodClockSeconds={gameState.period_clock_seconds}
                    possessionClockSeconds={gameState.possession_clock_seconds}
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
            </div>
        </>
    );
}

ScoringMatch.layout = (page: React.ReactNode) => <ScoringLayout>{page}</ScoringLayout>;
