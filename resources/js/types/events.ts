import type { ISODateTime, UUID } from './domain';

export type EventType =
    | 'match_start'
    | 'swim_off'
    | 'period_start'
    | 'period_end'
    | 'halftime_start'
    | 'halftime_end'
    | 'match_end'
    | 'match_abandoned'
    | 'goal'
    | 'goal_throw'
    | 'two_meter_throw'
    | 'free_throw'
    | 'neutral_throw'
    | 'shot'
    | 'ordinary_foul'
    | 'exclusion_foul'
    | 'penalty_foul'
    | 'penalty_throw_taken'
    | 'violent_action_exclusion'
    | 'misconduct_exclusion'
    | 'simultaneous_exclusion'
    | 'personal_foul_recorded'
    | 'foul_out'
    | 'yellow_card'
    | 'red_card'
    | 'timeout_start'
    | 'timeout_end'
    | 'referee_timeout_start'
    | 'referee_timeout_end'
    | 'injury_stoppage'
    | 'substitution'
    | 'goalkeeper_substitution'
    | 'exclusion_expiry'
    | 'possession_change'
    | 'possession_clock_reset'
    | 'possession_clock_expiry'
    | 'shootout_start'
    | 'shootout_shot'
    | 'shootout_end'
    | 'var_review_start'
    | 'var_review_end'
    | 'coach_challenge'
    | 'correction';

export type MatchEvent = {
    id: UUID;
    match_id: UUID;
    sequence: number;
    type: EventType;
    period: number;
    period_clock_seconds: number;
    recorded_at: ISODateTime;
    recorded_by: string | null;
    payload: Record<string, unknown>;
};

export type QueuedEvent = {
    local_id: string;
    match_id: UUID;
    type: EventType;
    period: number;
    period_clock_seconds: number;
    payload: Record<string, unknown>;
    status: 'pending' | 'sending' | 'accepted' | 'rejected';
    error?: string;
    created_at: number;
};
