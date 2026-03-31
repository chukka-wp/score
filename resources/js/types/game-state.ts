import type { UUID } from './domain';

export type GameStatus =
    | 'not_started'
    | 'in_progress'
    | 'period_break'
    | 'halftime'
    | 'overtime'
    | 'shootout'
    | 'completed'
    | 'abandoned';

export type Possession = 'home' | 'away' | 'none';

export type PossessionClockMode = 'standard' | 'reduced';

export type ExclusionType = 'standard' | 'violent_action' | 'for_game';

export type GameState = {
    match_id: UUID;
    status: GameStatus;
    current_period: number;
    period_clock_seconds: number;
    home_score: number;
    away_score: number;
    possession: Possession;
    possession_clock_seconds: number | null;
    possession_clock_mode: PossessionClockMode | null;
    home_timeouts_remaining: number;
    away_timeouts_remaining: number;
    active_exclusions: ActiveExclusion[];
    player_foul_counts: Record<UUID, number>;
    players_excluded_for_game: UUID[];
    shootout_state: ShootoutState | null;
};

export type ActiveExclusion = {
    player_id: UUID;
    team_id: UUID;
    cap_number: number;
    remaining_seconds: number;
    exclusion_type: ExclusionType;
    substitute_eligible_at: number | null;
};

export type ShootoutState = {
    home_score: number;
    away_score: number;
    current_round: number;
    shots: ShootoutShot[];
    next_shooting_team: Possession;
};

export type ShootoutShot = {
    team_id: UUID;
    player_id: UUID;
    cap_number: number;
    round: number;
    outcome: ShootoutShotOutcome;
};

export type ShootoutShotOutcome = 'goal' | 'miss' | 'saved';
