import type { UUID } from './domain';

export type MatchResult = {
    match_id: UUID;
    home_team_name: string;
    away_team_name: string;
    home_score: number;
    away_score: number;
    status: string;
    scheduled_at: string;
    venue: string;
};

export type PlayerMatchStats = {
    player_id: UUID;
    player_name: string;
    cap_number: number;
    goals: number;
    penalty_goals: number;
    penalty_attempts: number;
    personal_fouls: number;
    exclusions: number;
    violent_action_exclusions: number;
    yellow_cards: number;
    red_cards: number;
};

export type TeamMatchStats = {
    team_id: UUID;
    goals_scored: number;
    goals_conceded: number;
    timeouts_used: number;
    total_exclusions: number;
    total_personal_fouls: number;
    penalty_goals: number;
    penalty_attempts: number;
    player_stats: PlayerMatchStats[];
};

export type SeasonStats = {
    team_id: UUID;
    matches_played: number;
    wins: number;
    losses: number;
    draws: number;
    goals_for: number;
    goals_against: number;
    top_scorers: Array<{
        player_id: UUID;
        player_name: string;
        goals: number;
    }>;
    exclusion_leaders: Array<{
        player_id: UUID;
        player_name: string;
        exclusions: number;
    }>;
};
