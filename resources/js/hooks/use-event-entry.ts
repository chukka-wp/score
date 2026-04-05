import { useCallback, useEffect, useReducer, useRef } from 'react';

import type { EventEntryState, EventType, GameState, RosterEntry, TeamSide } from '@/types';

type EventEntryAction =
    | { type: 'START_EVENT'; eventType: EventType }
    | { type: 'APPEND_DIGIT'; digit: number }
    | { type: 'DELETE_DIGIT' }
    | { type: 'SET_CAP'; cap: number }
    | { type: 'SET_TEAM'; team: TeamSide }
    | { type: 'SET_OUTCOME'; outcome: string }
    | { type: 'STEP_BACK' }
    | { type: 'CONFIRM' }
    | { type: 'CANCEL' }
    | { type: 'SET_PLAYER_PREVIEW'; name: string | null };

const INITIAL_STATE: EventEntryState = {
    step: 'idle',
    eventType: null,
    capNumber: '',
    team: null,
    outcome: null,
    playerPreview: null,
};

const EVENTS_WITHOUT_CAP: EventType[] = [
    'timeout_start',
    'referee_timeout_start',
    'period_start',
    'period_end',
    'match_start',
    'match_end',
    'halftime_start',
    'halftime_end',
    'possession_change',
    'possession_clock_reset',
    'free_throw',
    'two_meter_throw',
    'shootout_start',
    'shootout_end',
];

const EVENTS_WITH_OUTCOME: EventType[] = ['shootout_shot', 'penalty_throw_taken', 'shot'];

const EVENTS_REQUIRING_CAP: EventType[] = [
    'goal',
    'exclusion_foul',
    'ordinary_foul',
    'penalty_foul',
    'penalty_throw_taken',
    'shot',
    'yellow_card',
    'red_card',
    'substitution',
    'violent_action_exclusion',
    'misconduct_exclusion',
    'shootout_shot',
];

function reducer(state: EventEntryState, action: EventEntryAction): EventEntryState {
    switch (action.type) {
        case 'START_EVENT': {
            if (EVENTS_WITHOUT_CAP.includes(action.eventType)) {
                return {
                    ...INITIAL_STATE,
                    step: 'awaiting_team',
                    eventType: action.eventType,
                };
            }

            return {
                ...INITIAL_STATE,
                step: 'awaiting_cap',
                eventType: action.eventType,
            };
        }

        case 'APPEND_DIGIT': {
            if (state.step !== 'awaiting_cap') {
                return state;
            }

            const newCap = state.capNumber + String(action.digit);

            if (newCap.length > 2) {
                return state;
            }

            return { ...state, capNumber: newCap };
        }

        case 'DELETE_DIGIT': {
            if (state.step !== 'awaiting_cap' || state.capNumber.length === 0) {
                return state;
            }

            return { ...state, capNumber: state.capNumber.slice(0, -1), playerPreview: null };
        }

        case 'SET_CAP':
            return {
                ...state,
                step: 'awaiting_team',
                capNumber: String(action.cap),
            };

        case 'SET_TEAM': {
            if (state.eventType && EVENTS_WITH_OUTCOME.includes(state.eventType)) {
                return {
                    ...state,
                    step: 'awaiting_outcome',
                    team: action.team,
                };
            }

            return {
                ...state,
                step: 'awaiting_confirm',
                team: action.team,
            };
        }

        case 'SET_OUTCOME':
            return {
                ...state,
                step: 'awaiting_confirm',
                outcome: action.outcome,
            };

        case 'STEP_BACK': {
            switch (state.step) {
                case 'awaiting_cap':
                    return INITIAL_STATE;
                case 'awaiting_team':
                    if (state.eventType && EVENTS_WITHOUT_CAP.includes(state.eventType)) {
                        return INITIAL_STATE;
                    }

                    return { ...state, step: 'awaiting_cap', team: null, playerPreview: null };
                case 'awaiting_outcome':
                    return { ...state, step: 'awaiting_team', team: null, outcome: null };
                case 'awaiting_confirm':
                    if (state.outcome !== null) {
                        return { ...state, step: 'awaiting_outcome', outcome: null };
                    }

                    return { ...state, step: 'awaiting_team', team: null };
                default:
                    return state;
            }
        }

        case 'SET_PLAYER_PREVIEW':
            return { ...state, playerPreview: action.name };

        case 'CONFIRM':
        case 'CANCEL':
            return INITIAL_STATE;

        default:
            return state;
    }
}

type UseEventEntryReturn = {
    state: EventEntryState;
    startEvent: (type: EventType) => void;
    appendDigit: (digit: number) => void;
    deleteDigit: () => void;
    setCap: (cap: number) => void;
    setTeam: (team: TeamSide) => void;
    setOutcome: (outcome: string) => void;
    advanceFromCap: () => boolean;
    stepBack: () => void;
    confirm: () => void;
    cancel: () => void;
    undo: () => void;
};

export function useEventEntry(
    gameState: GameState,
    teamScope: TeamSide | null,
    homeRoster: RosterEntry[],
    awayRoster: RosterEntry[],
    enqueueEvent: (event: {
        type: EventType;
        period: number;
        period_clock_seconds: number;
        payload: Record<string, unknown>;
    }) => Promise<string>,
    onEventAccepted?: () => void,
): UseEventEntryReturn {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const onEventAcceptedRef = useRef(onEventAccepted);
    // eslint-disable-next-line react-hooks/refs -- stable ref for callback in effect
    onEventAcceptedRef.current = onEventAccepted;

    const resolvePlayerName = useCallback(
        (capNumber: string, team: TeamSide | null): string | null => {
            const cap = parseInt(capNumber, 10);

            if (isNaN(cap)) {
                return null;
            }

            const roster = team === 'blue' ? awayRoster : homeRoster;
            const entry = roster.find((r) => r.cap_number === cap);

            return entry?.player_name ?? null;
        },
        [homeRoster, awayRoster],
    );

    const startEvent = useCallback(
        (type: EventType) => {
            dispatch({ type: 'START_EVENT', eventType: type });
        },
        [],
    );

    const appendDigit = useCallback(
        (digit: number) => {
            dispatch({ type: 'APPEND_DIGIT', digit });

            const newCap = state.capNumber + String(digit);
            const team = teamScope ?? state.team;
            const name = resolvePlayerName(newCap, team);
            dispatch({ type: 'SET_PLAYER_PREVIEW', name });
        },
        [state.capNumber, state.team, teamScope, resolvePlayerName],
    );

    const deleteDigit = useCallback(() => {
        dispatch({ type: 'DELETE_DIGIT' });
    }, []);

    const stepBack = useCallback(() => {
        dispatch({ type: 'STEP_BACK' });
    }, []);

    const setCap = useCallback(
        (cap: number) => {
            dispatch({ type: 'SET_CAP', cap });

            if (teamScope) {
                dispatch({ type: 'SET_TEAM', team: teamScope });
            }
        },
        [teamScope],
    );

    // Advance from awaiting_cap to awaiting_team. Returns false if cap is required but empty.
    const advanceFromCap = useCallback((): boolean => {
        if (state.step !== 'awaiting_cap') {
            return false;
        }

        const requiresCap = state.eventType && EVENTS_REQUIRING_CAP.includes(state.eventType);

        if (requiresCap && state.capNumber.length === 0) {
            return false;
        }

        const cap = parseInt(state.capNumber, 10);

        if (state.capNumber.length > 0 && !isNaN(cap)) {
            dispatch({ type: 'SET_CAP', cap });

            if (teamScope) {
                dispatch({ type: 'SET_TEAM', team: teamScope });
            }
        }

        return true;
    }, [state.step, state.eventType, state.capNumber, teamScope]);

    const setTeam = useCallback((team: TeamSide) => {
        dispatch({ type: 'SET_TEAM', team });
    }, []);

    const setOutcome = useCallback((outcome: string) => {
        dispatch({ type: 'SET_OUTCOME', outcome });
    }, []);

    const buildPayload = useCallback((): Record<string, unknown> => {
        const payload: Record<string, unknown> = {};
        const team = state.team ?? teamScope;

        if (team) {
            payload.team_side = team;
        }

        if (state.capNumber) {
            payload.cap_number = parseInt(state.capNumber, 10);
        }

        if (state.outcome) {
            payload.outcome = state.outcome;
        }

        return payload;
    }, [state, teamScope]);

    const confirm = useCallback(() => {
        if (!state.eventType) {
            return;
        }

        // Validate required fields
        const requiresCap = EVENTS_REQUIRING_CAP.includes(state.eventType);

        if (requiresCap && state.capNumber.length === 0) {
            return;
        }

        const team = state.team ?? teamScope;

        if (!team) {
            return;
        }

        const requiresOutcome = EVENTS_WITH_OUTCOME.includes(state.eventType);

        if (requiresOutcome && !state.outcome) {
            return;
        }

        enqueueEvent({
            type: state.eventType,
            period: gameState.current_period,
            period_clock_seconds: gameState.period_clock_seconds,
            payload: buildPayload(),
        });

        onEventAcceptedRef.current?.();
        dispatch({ type: 'CONFIRM' });
    }, [state, teamScope, gameState, buildPayload, enqueueEvent]);

    // Auto-submit: when the state machine reaches awaiting_confirm, fire immediately
    const confirmRef = useRef(confirm);
    // eslint-disable-next-line react-hooks/refs -- stable ref for callback in effect
    confirmRef.current = confirm;

    useEffect(() => {
        if (state.step === 'awaiting_confirm') {
            confirmRef.current();
        }
    }, [state.step]);

    const cancel = useCallback(() => {
        dispatch({ type: 'CANCEL' });
    }, []);

    const undo = useCallback(() => {
        enqueueEvent({
            type: 'correction',
            period: gameState.current_period,
            period_clock_seconds: gameState.period_clock_seconds,
            payload: { action: 'void' },
        });
    }, [gameState, enqueueEvent]);

    return {
        state,
        startEvent,
        appendDigit,
        deleteDigit,
        setCap,
        setTeam,
        setOutcome,
        advanceFromCap,
        stepBack,
        confirm,
        cancel,
        undo,
    };
}
