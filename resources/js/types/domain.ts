export type UUID = string;
export type ISODateTime = string;

export type Club = {
    id: UUID;
    name: string;
    short_name: string;
    logo_url: string | null;
    primary_colour: string;
};

export type Team = {
    id: UUID;
    club_id: UUID;
    name: string;
    short_name: string;
    gender: 'male' | 'female' | 'mixed';
    age_group: string;
};

export type Player = {
    id: UUID;
    club_id: UUID;
    name: string;
    preferred_name: string | null;
    preferred_cap_number: number | null;
    is_goalkeeper: boolean;
};

export type TeamMembership = {
    player_id: UUID;
    team_id: UUID;
    joined_at: ISODateTime;
    left_at: ISODateTime | null;
};

export type Match = {
    id: UUID;
    rule_set_id: UUID;
    scheduled_at: ISODateTime;
    venue: string;
    home_team_id: UUID;
    away_team_id: UUID;
    home_cap_colour: string;
    away_cap_colour: string;
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
    match_id: UUID;
    player_id: UUID;
    team_id: UUID;
    cap_number: number;
    is_starting: boolean;
    role: RosterRole;
    player?: Player;
};

export type RosterRole = 'field_player' | 'goalkeeper' | 'substitute_goalkeeper';
