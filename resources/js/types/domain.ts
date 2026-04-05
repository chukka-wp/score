export type UUID = string;
export type ISODateTime = string;

export type Match = {
    id: UUID;
    rule_set_id: UUID;
    scheduled_at: ISODateTime;
    venue: string;
    home_team_name: string;
    away_team_name: string;
    home_cap_colour: string;
    away_cap_colour: string;
    home_external_team_id: string | null;
    away_external_team_id: string | null;
    external_club_id: string | null;
    status: MatchStatus;
    live_url: string | null;
};

export type MatchStatus = 'scheduled' | 'in_progress' | 'completed' | 'abandoned';

export type RuleSet = {
    id: UUID;
    name: string;
    is_bundled: boolean;
    periods: number;
    period_duration_seconds: number;
    running_time: boolean;
    interval_duration_seconds: number;
    halftime_duration_seconds: number;
    possession_clock_enabled: boolean;
    possession_time_seconds: number;
    second_possession_time_seconds: number;
    exclusion_duration_seconds: number;
    violent_action_exclusion_duration_seconds: number;
    personal_foul_limit: number;
    foul_limit_enforced: boolean;
    timeouts_per_team: number;
    timeout_duration_seconds: number;
    overtime_period_duration_seconds: number;
    players_per_team: number;
    max_players_in_water: number;
    max_goalkeepers: number;
    cap_number_scheme: 'sequential' | 'open';
};

export type RosterEntry = {
    id: number;
    match_id: UUID;
    side: 'home' | 'away';
    cap_number: number;
    player_name: string;
    role: RosterRole;
    is_starting: boolean;
    external_player_id: string | null;
};

export type RosterRole = 'field_player' | 'goalkeeper' | 'substitute_goalkeeper';
