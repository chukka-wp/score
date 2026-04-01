import type { EventType } from '@/types';

export function formatClock(totalSeconds: number): string {
    const minutes = Math.floor(Math.abs(totalSeconds) / 60);
    const seconds = Math.abs(totalSeconds) % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function formatShortClock(totalSeconds: number): string {
    if (totalSeconds >= 60) {
        return formatClock(totalSeconds);
    }

    return `0:${String(Math.max(0, Math.floor(totalSeconds))).padStart(2, '0')}`;
}

export function formatPeriod(period: number): string {
    return `Q${period}`;
}

export function formatTeamSide(side: 'white' | 'blue' | 'home' | 'away' | 'none'): string {
    const labels: Record<string, string> = {
        white: 'White',
        blue: 'Blue',
        home: 'Home',
        away: 'Away',
        none: '',
    };

    return labels[side] ?? side;
}

const EVENT_TYPE_LABELS: Record<EventType, string> = {
    match_start: 'Match Start',
    swim_off: 'Swim Off',
    period_start: 'Period Start',
    period_end: 'Period End',
    halftime_start: 'Halftime',
    halftime_end: 'Halftime End',
    match_end: 'Match End',
    match_abandoned: 'Abandoned',
    goal: 'Goal',
    goal_throw: 'Goal Throw',
    two_meter_throw: 'Two-Meter Throw',
    free_throw: 'Free Throw',
    neutral_throw: 'Neutral Throw',
    shot: 'Shot',
    ordinary_foul: 'Foul',
    exclusion_foul: 'Exclusion',
    penalty_foul: 'Penalty Foul',
    penalty_throw_taken: 'Penalty',
    violent_action_exclusion: 'Violent Action',
    misconduct_exclusion: 'Misconduct',
    simultaneous_exclusion: 'Simultaneous Excl.',
    personal_foul_recorded: 'Personal Foul',
    foul_out: 'Fouled Out',
    yellow_card: 'Yellow Card',
    red_card: 'Red Card',
    timeout_start: 'Timeout',
    timeout_end: 'Timeout End',
    referee_timeout_start: 'Ref Timeout',
    referee_timeout_end: 'Ref Timeout End',
    injury_stoppage: 'Injury',
    substitution: 'Substitution',
    goalkeeper_substitution: 'GK Substitution',
    exclusion_expiry: 'Exclusion Expiry',
    possession_change: 'Possession',
    possession_clock_reset: 'Clock Reset',
    possession_clock_expiry: 'Shot Clock',
    shootout_start: 'Shootout Start',
    shootout_shot: 'Shootout Shot',
    shootout_end: 'Shootout End',
    var_review_start: 'VAR Review',
    var_review_end: 'VAR End',
    coach_challenge: 'Challenge',
    correction: 'Correction',
};

export function formatEventType(type: EventType): string {
    return EVENT_TYPE_LABELS[type] ?? type;
}
