import { useEffect } from 'react';

import type { EventType, GameState, TeamSide } from '@/types';

type EventEntryActions = {
    startEvent: (type: EventType) => void;
    appendDigit: (digit: number) => void;
    setTeam: (team: TeamSide) => void;
    setOutcome: (outcome: string) => void;
    confirm: () => void;
    cancel: () => void;
    undo: () => void;
    state: {
        step: string;
        eventType: EventType | null;
    };
};

type ClockActions = {
    toggleClock: () => void;
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
    ruleSet: { possession_time_seconds: number; second_possession_time_seconds: number },
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

            // Awaiting cap: digits
            if (step === 'awaiting_cap') {
                if (e.key >= '0' && e.key <= '9') {
                    e.preventDefault();
                    eventEntry.appendDigit(parseInt(e.key, 10));

                    return;
                }

                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    eventEntry.confirm();

                    return;
                }
            }

            // Awaiting team: W/B/H/A
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

            // Awaiting outcome: G/M/V
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
                        case 'q':
                            e.preventDefault();
                            modals.openPeriodTransition();

                            return;
                    }
                }

                // Clock and possession (always available when idle)
                if (e.key === ' ') {
                    e.preventDefault();
                    clockControl.toggleClock();

                    return;
                }

                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    clockControl.setPossession('white');

                    return;
                }

                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    clockControl.setPossession('blue');

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
    }, [eventEntry, clockControl, gameState, isShootoutMode, modals, ruleSet]);
}
