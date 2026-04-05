import { useEffect } from 'react';

import type { EventType, GameState, TeamSide } from '@/types';

type EventEntryActions = {
    startEvent: (type: EventType) => void;
    appendDigit: (digit: number) => void;
    deleteDigit: () => void;
    setTeam: (team: TeamSide) => void;
    setOutcome: (outcome: string) => void;
    advanceFromCap: () => boolean;
    stepBack: () => void;
    confirm: () => void;
    cancel: () => void;
    undo: () => void;
    state: {
        step: string;
        eventType: EventType | null;
        capNumber: string;
    };
};

type ClockActions = {
    toggleClock: () => void;
    togglePossession: () => void;
    setPossession: (team: TeamSide) => void;
    resetPossessionClock: (seconds: number) => void;
};

type ModalActions = {
    openHistory: () => void;
    openTimingCorrection: () => void;
    openHotkeyReference: () => void;
    openPeriodTransition: () => void;
};

export function useHotkeys(
    eventEntry: EventEntryActions,
    clockControl: ClockActions,
    gameState: GameState,
    isShootoutMode: boolean,
    modals: ModalActions,
    ruleSet: { running_time: boolean; possession_time_seconds: number; second_possession_time_seconds: number },
    sidesSwapped: boolean,
): void {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const target = e.target as HTMLElement;

            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return;
            }

            // Ctrl/Cmd modifiers
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'z':
                        e.preventDefault();
                        eventEntry.undo();

                        return;
                    case 'h':
                        e.preventDefault();
                        modals.openHistory();

                        return;
                    case 't':
                        e.preventDefault();
                        modals.openTimingCorrection();

                        return;
                }

                return;
            }

            const { step } = eventEntry.state;

            // Escape cancels any entry
            if (e.key === 'Escape') {
                e.preventDefault();
                eventEntry.cancel();

                return;
            }

            // Backspace: step back through the flow (or delete digit during cap entry)
            if (e.key === 'Backspace') {
                e.preventDefault();

                if (step === 'awaiting_cap' && eventEntry.state.capNumber.length > 0) {
                    eventEntry.deleteDigit();
                } else if (step !== 'idle') {
                    eventEntry.stepBack();
                }

                return;
            }

            // Awaiting cap: digits, Enter to advance, W/B to auto-advance + set team
            if (step === 'awaiting_cap') {
                if (e.key >= '0' && e.key <= '9') {
                    e.preventDefault();
                    eventEntry.appendDigit(parseInt(e.key, 10));

                    return;
                }

                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    eventEntry.advanceFromCap();

                    return;
                }

                // W/B during cap entry: advance cap + set team in one keystroke
                if (e.key.toLowerCase() === 'w' || e.key.toLowerCase() === 'a') {
                    e.preventDefault();

                    if (eventEntry.advanceFromCap()) {
                        eventEntry.setTeam('white');
                    }

                    return;
                }

                if (e.key.toLowerCase() === 'b' || e.key.toLowerCase() === 'h') {
                    e.preventDefault();

                    if (eventEntry.advanceFromCap()) {
                        eventEntry.setTeam('blue');
                    }

                    return;
                }
            }

            // Awaiting team: W/B/A/H
            if (step === 'awaiting_team') {
                switch (e.key.toLowerCase()) {
                    case 'w':
                    case 'a':
                        e.preventDefault();
                        eventEntry.setTeam('white');

                        return;
                    case 'b':
                    case 'h':
                        e.preventDefault();
                        eventEntry.setTeam('blue');

                        return;
                }
            }

            // Awaiting outcome: G/M/V/B
            if (step === 'awaiting_outcome') {
                switch (e.key.toLowerCase()) {
                    case 'g':
                        e.preventDefault();
                        eventEntry.setOutcome('goal');

                        return;
                    case 'm':
                        e.preventDefault();
                        eventEntry.setOutcome('miss');

                        return;
                    case 'v':
                        e.preventDefault();
                        eventEntry.setOutcome('saved');

                        return;
                    case 'b':
                        e.preventDefault();
                        eventEntry.setOutcome('blocked');

                        return;
                }
            }

            // Awaiting confirm: Enter/Space
            if (step === 'awaiting_confirm') {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    eventEntry.confirm();

                    return;
                }
            }

            // Idle: primary hotkeys
            if (step === 'idle') {
                if (isShootoutMode) {
                    if (e.key.toLowerCase() === 'o') {
                        e.preventDefault();
                        eventEntry.startEvent('shootout_shot');

                        return;
                    }
                } else {
                    switch (e.key.toLowerCase()) {
                        case 'g':
                            e.preventDefault();
                            eventEntry.startEvent('goal');

                            return;
                        case 'e':
                            e.preventDefault();
                            eventEntry.startEvent('exclusion_foul');

                            return;
                        case 'f':
                            e.preventDefault();
                            eventEntry.startEvent('ordinary_foul');

                            return;
                        case 'p':
                            e.preventDefault();
                            eventEntry.startEvent('penalty_foul');

                            return;
                        case 't':
                            e.preventDefault();
                            eventEntry.startEvent('timeout_start');

                            return;
                        case 's':
                            e.preventDefault();
                            eventEntry.startEvent('substitution');

                            return;
                        case 'y':
                            e.preventDefault();
                            eventEntry.startEvent('yellow_card');

                            return;
                        case 'r':
                            e.preventDefault();
                            eventEntry.startEvent('red_card');

                            return;
                        case 'x':
                            e.preventDefault();
                            eventEntry.startEvent('shot');

                            return;
                        case 'c':
                            e.preventDefault();
                            eventEntry.startEvent('free_throw');

                            return;
                        case 'd':
                            e.preventDefault();
                            eventEntry.startEvent('two_meter_throw');

                            return;
                        case 'q':
                            e.preventDefault();
                            modals.openPeriodTransition();

                            return;
                    }
                }

                // Shift+Space: toggle period clock (both modes)
                if (e.key === ' ' && e.shiftKey) {
                    e.preventDefault();
                    clockControl.toggleClock();

                    return;
                }

                // Space: toggle both clocks (stopped time) or possession only (running time)
                if (e.key === ' ') {
                    e.preventDefault();

                    if (ruleSet.running_time) {
                        clockControl.togglePossession();
                    } else {
                        clockControl.toggleClock();
                    }

                    return;
                }

                // Arrow keys: direction of play. Right arrow = left team has possession.
                // When sides are swapped, the left/right team mapping is inverted.
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    clockControl.setPossession(sidesSwapped ? 'blue' : 'white');

                    return;
                }

                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    clockControl.setPossession(sidesSwapped ? 'white' : 'blue');

                    return;
                }

                if (e.key === '[') {
                    e.preventDefault();
                    clockControl.resetPossessionClock(ruleSet.second_possession_time_seconds);

                    return;
                }

                if (e.key === ']') {
                    e.preventDefault();
                    clockControl.resetPossessionClock(ruleSet.possession_time_seconds);

                    return;
                }

                if (e.key === '?') {
                    e.preventDefault();
                    modals.openHotkeyReference();

                    return;
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [eventEntry, clockControl, gameState, isShootoutMode, modals, ruleSet, sidesSwapped]);
}
