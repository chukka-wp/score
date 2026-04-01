<?php

namespace App\Services;

class FakeCloudApiService extends CloudApiService
{
    private string $clubId = 'dev-club';

    private array $club = [
        'id' => 'dev-club',
        'name' => 'Newcastle Permanent Water Polo Club',
        'short_name' => 'NPWPC',
        'logo_url' => null,
        'primary_colour' => '#1e40af',
    ];

    private array $teams = [
        [
            'id' => 'team-u16b',
            'club_id' => 'dev-club',
            'name' => 'U16 Boys',
            'short_name' => 'U16B',
            'gender' => 'male',
            'age_group' => 'U16',
        ],
        [
            'id' => 'team-u18g',
            'club_id' => 'dev-club',
            'name' => 'U18 Girls',
            'short_name' => 'U18G',
            'gender' => 'female',
            'age_group' => 'U18',
        ],
        [
            'id' => 'team-open',
            'club_id' => 'dev-club',
            'name' => 'Open Men',
            'short_name' => 'Open',
            'gender' => 'male',
            'age_group' => 'Open',
        ],
    ];

    private array $players = [
        ['id' => 'p1', 'club_id' => 'dev-club', 'name' => 'James Wilson', 'preferred_name' => 'Jimmy', 'preferred_cap_number' => 1, 'is_goalkeeper' => true],
        ['id' => 'p2', 'club_id' => 'dev-club', 'name' => 'Lachlan Smith', 'preferred_name' => null, 'preferred_cap_number' => 2, 'is_goalkeeper' => false],
        ['id' => 'p3', 'club_id' => 'dev-club', 'name' => 'Oliver Brown', 'preferred_name' => 'Ollie', 'preferred_cap_number' => 3, 'is_goalkeeper' => false],
        ['id' => 'p4', 'club_id' => 'dev-club', 'name' => 'Thomas Chen', 'preferred_name' => 'Tom', 'preferred_cap_number' => 4, 'is_goalkeeper' => false],
        ['id' => 'p5', 'club_id' => 'dev-club', 'name' => 'Ethan Jones', 'preferred_name' => null, 'preferred_cap_number' => 5, 'is_goalkeeper' => false],
        ['id' => 'p6', 'club_id' => 'dev-club', 'name' => 'Noah Taylor', 'preferred_name' => null, 'preferred_cap_number' => 6, 'is_goalkeeper' => false],
        ['id' => 'p7', 'club_id' => 'dev-club', 'name' => 'William Davis', 'preferred_name' => 'Will', 'preferred_cap_number' => 7, 'is_goalkeeper' => false],
        ['id' => 'p8', 'club_id' => 'dev-club', 'name' => 'Jack Thompson', 'preferred_name' => null, 'preferred_cap_number' => 8, 'is_goalkeeper' => false],
        ['id' => 'p9', 'club_id' => 'dev-club', 'name' => 'Cooper White', 'preferred_name' => null, 'preferred_cap_number' => 9, 'is_goalkeeper' => false],
        ['id' => 'p10', 'club_id' => 'dev-club', 'name' => 'Harrison Lee', 'preferred_name' => 'Harry', 'preferred_cap_number' => 10, 'is_goalkeeper' => false],
        ['id' => 'p11', 'club_id' => 'dev-club', 'name' => 'Lucas Martin', 'preferred_name' => null, 'preferred_cap_number' => 11, 'is_goalkeeper' => false],
        ['id' => 'p12', 'club_id' => 'dev-club', 'name' => 'Alexander Clark', 'preferred_name' => 'Alex', 'preferred_cap_number' => 12, 'is_goalkeeper' => false],
        ['id' => 'p13', 'club_id' => 'dev-club', 'name' => 'Samuel Hall', 'preferred_name' => 'Sam', 'preferred_cap_number' => 13, 'is_goalkeeper' => true],
    ];

    private array $ruleSets = [
        [
            'id' => 'rs-fina2025',
            'name' => 'World Aquatics 2025',
            'is_bundled' => true,
            'periods' => 4,
            'period_duration_seconds' => 480,
            'running_time' => false,
            'interval_duration_seconds' => 120,
            'halftime_duration_seconds' => 300,
            'possession_clock_enabled' => true,
            'possession_time_seconds' => 28,
            'second_possession_time_seconds' => 18,
            'exclusion_duration_seconds' => 20,
            'violent_action_exclusion_duration_seconds' => 240,
            'personal_foul_limit' => 3,
            'foul_limit_enforced' => true,
            'timeouts_per_team' => 2,
            'timeout_duration_seconds' => 60,
            'overtime_period_duration_seconds' => 180,
            'players_per_team' => 14,
            'max_players_in_water' => 7,
            'max_goalkeepers' => 2,
            'cap_number_scheme' => 'sequential',
        ],
        [
            'id' => 'rs-club-u12',
            'name' => 'Newcastle Club Comp U12',
            'is_bundled' => true,
            'periods' => 4,
            'period_duration_seconds' => 360,
            'running_time' => true,
            'interval_duration_seconds' => 60,
            'halftime_duration_seconds' => 180,
            'possession_clock_enabled' => false,
            'possession_time_seconds' => 28,
            'second_possession_time_seconds' => 18,
            'exclusion_duration_seconds' => 20,
            'violent_action_exclusion_duration_seconds' => 240,
            'personal_foul_limit' => 3,
            'foul_limit_enforced' => false,
            'timeouts_per_team' => 1,
            'timeout_duration_seconds' => 60,
            'overtime_period_duration_seconds' => 180,
            'players_per_team' => 14,
            'max_players_in_water' => 7,
            'max_goalkeepers' => 2,
            'cap_number_scheme' => 'open',
        ],
    ];

    // ──────────────────────────────────────────────────────────
    // Auth
    // ──────────────────────────────────────────────────────────

    public function login(string $email, string $password): array
    {
        return [
            'token' => 'dev-token',
            'user' => [
                'id' => 1,
                'name' => 'Dev Manager',
                'email' => $email,
                'club_id' => $this->clubId,
            ],
        ];
    }

    public function logout(string $token): void {}

    public function me(string $token): array
    {
        return [
            'id' => 1,
            'name' => 'Dev Manager',
            'email' => 'dev@chukka.test',
            'club_id' => $this->clubId,
        ];
    }

    // ──────────────────────────────────────────────────────────
    // Clubs
    // ──────────────────────────────────────────────────────────

    public function getClub(string $token, string $clubId): array
    {
        return $this->club;
    }

    public function updateClub(string $token, string $clubId, array $data): array
    {
        return array_merge($this->club, $data);
    }

    // ──────────────────────────────────────────────────────────
    // Teams
    // ──────────────────────────────────────────────────────────

    public function getTeamsForClub(string $token, string $clubId): array
    {
        return $this->teams;
    }

    public function createTeam(string $token, string $clubId, array $data): array
    {
        return array_merge(['id' => 'team-new', 'club_id' => $clubId], $data);
    }

    public function getTeam(string $token, string $teamId): array
    {
        return collect($this->teams)->firstWhere('id', $teamId) ?? $this->teams[0];
    }

    public function updateTeam(string $token, string $teamId, array $data): array
    {
        return array_merge($this->getTeam($token, $teamId), $data);
    }

    // ──────────────────────────────────────────────────────────
    // Players
    // ──────────────────────────────────────────────────────────

    public function getPlayersForClub(string $token, string $clubId): array
    {
        return $this->players;
    }

    public function createPlayer(string $token, string $clubId, array $data): array
    {
        return array_merge(['id' => 'p-new', 'club_id' => $clubId], $data);
    }

    public function getPlayer(string $token, string $playerId): array
    {
        return collect($this->players)->firstWhere('id', $playerId) ?? $this->players[0];
    }

    public function updatePlayer(string $token, string $playerId, array $data): array
    {
        return array_merge($this->getPlayer($token, $playerId), $data);
    }

    public function getPlayersForTeam(string $token, string $teamId): array
    {
        return array_slice($this->players, 0, 7);
    }

    public function addPlayerToTeam(string $token, string $teamId, string $playerId): void {}

    public function removePlayerFromTeam(string $token, string $teamId, string $playerId): void {}

    // ──────────────────────────────────────────────────────────
    // Rule Sets
    // ──────────────────────────────────────────────────────────

    public function getRuleSets(string $token): array
    {
        return $this->ruleSets;
    }

    public function createRuleSet(string $token, array $data): array
    {
        return array_merge(['id' => 'rs-new', 'is_bundled' => false], $data);
    }

    public function getRuleSet(?string $token, string $ruleSetId): array
    {
        return collect($this->ruleSets)->firstWhere('id', $ruleSetId) ?? $this->ruleSets[0];
    }

    public function updateRuleSet(string $token, string $ruleSetId, array $data): array
    {
        return array_merge($this->getRuleSet($token, $ruleSetId), $data);
    }

    public function cloneRuleSet(string $token, string $ruleSetId): array
    {
        $source = $this->getRuleSet($token, $ruleSetId);

        return array_merge($source, ['id' => 'rs-cloned', 'name' => $source['name'].' (Copy)', 'is_bundled' => false]);
    }

    // ──────────────────────────────────────────────────────────
    // Matches
    // ──────────────────────────────────────────────────────────

    public function getMatchesForTeam(string $token, string $teamId): array
    {
        return [
            [
                'id' => 'match-1',
                'rule_set_id' => 'rs-fina2025',
                'scheduled_at' => now()->addDays(3)->toIso8601String(),
                'venue' => 'Newcastle Olympic Pool',
                'home_team_id' => $teamId,
                'away_team_id' => 'opponent-1',
                'home_cap_colour' => 'white',
                'away_cap_colour' => 'dark',
                'status' => 'scheduled',
                'live_url' => null,
            ],
        ];
    }

    public function createMatch(string $token, array $data): array
    {
        return array_merge(['id' => 'match-new', 'status' => 'scheduled', 'live_url' => null], $data);
    }

    public function getMatch(?string $token, string $matchId): array
    {
        return [
            'id' => $matchId,
            'rule_set_id' => 'rs-fina2025',
            'scheduled_at' => now()->toIso8601String(),
            'venue' => 'Newcastle Olympic Pool',
            'home_team_id' => 'team-u16b',
            'away_team_id' => 'opponent-1',
            'home_cap_colour' => 'white',
            'away_cap_colour' => 'dark',
            'status' => 'in_progress',
            'live_url' => null,
        ];
    }

    public function updateMatch(string $token, string $matchId, array $data): array
    {
        return array_merge($this->getMatch($token, $matchId), $data);
    }

    // ──────────────────────────────────────────────────────────
    // Roster
    // ──────────────────────────────────────────────────────────

    private array $opponentPlayers = [
        ['id' => 'opp1', 'club_id' => 'opp-club', 'name' => 'Ryan Mitchell', 'preferred_name' => null, 'preferred_cap_number' => 1, 'is_goalkeeper' => true],
        ['id' => 'opp2', 'club_id' => 'opp-club', 'name' => 'Dylan Moore', 'preferred_name' => null, 'preferred_cap_number' => 2, 'is_goalkeeper' => false],
        ['id' => 'opp3', 'club_id' => 'opp-club', 'name' => 'Jake Anderson', 'preferred_name' => null, 'preferred_cap_number' => 3, 'is_goalkeeper' => false],
        ['id' => 'opp4', 'club_id' => 'opp-club', 'name' => 'Marcus Lee', 'preferred_name' => null, 'preferred_cap_number' => 4, 'is_goalkeeper' => false],
        ['id' => 'opp5', 'club_id' => 'opp-club', 'name' => 'Ben Walker', 'preferred_name' => null, 'preferred_cap_number' => 5, 'is_goalkeeper' => false],
        ['id' => 'opp6', 'club_id' => 'opp-club', 'name' => 'Chris Turner', 'preferred_name' => null, 'preferred_cap_number' => 6, 'is_goalkeeper' => false],
        ['id' => 'opp7', 'club_id' => 'opp-club', 'name' => 'Daniel Scott', 'preferred_name' => null, 'preferred_cap_number' => 7, 'is_goalkeeper' => false],
        ['id' => 'opp8', 'club_id' => 'opp-club', 'name' => 'Aaron Cooper', 'preferred_name' => null, 'preferred_cap_number' => 8, 'is_goalkeeper' => false],
        ['id' => 'opp9', 'club_id' => 'opp-club', 'name' => 'Josh Edwards', 'preferred_name' => null, 'preferred_cap_number' => 9, 'is_goalkeeper' => false],
        ['id' => 'opp10', 'club_id' => 'opp-club', 'name' => 'Liam Barrett', 'preferred_name' => null, 'preferred_cap_number' => 10, 'is_goalkeeper' => false],
        ['id' => 'opp11', 'club_id' => 'opp-club', 'name' => 'Nathan Price', 'preferred_name' => null, 'preferred_cap_number' => 11, 'is_goalkeeper' => false],
        ['id' => 'opp12', 'club_id' => 'opp-club', 'name' => 'Cameron Ross', 'preferred_name' => null, 'preferred_cap_number' => 12, 'is_goalkeeper' => false],
        ['id' => 'opp13', 'club_id' => 'opp-club', 'name' => 'Matthew Young', 'preferred_name' => 'Matt', 'preferred_cap_number' => 13, 'is_goalkeeper' => true],
    ];

    public function getRoster(?string $token, string $matchId): array
    {
        $homeRoster = array_map(fn (array $player, int $i) => [
            'match_id' => $matchId,
            'player_id' => $player['id'],
            'team_id' => 'team-u16b',
            'cap_number' => $player['preferred_cap_number'],
            'is_starting' => $i < 7,
            'role' => $player['is_goalkeeper'] ? 'goalkeeper' : 'field_player',
            'player' => $player,
        ], array_slice($this->players, 0, 13), range(0, 12));

        $awayRoster = array_map(fn (array $player, int $i) => [
            'match_id' => $matchId,
            'player_id' => $player['id'],
            'team_id' => 'opponent-1',
            'cap_number' => $player['preferred_cap_number'],
            'is_starting' => $i < 7,
            'role' => $player['is_goalkeeper'] ? 'goalkeeper' : 'field_player',
            'player' => $player,
        ], array_slice($this->opponentPlayers, 0, 13), range(0, 12));

        return array_merge($homeRoster, $awayRoster);
    }

    public function setRoster(string $token, string $matchId, array $entries): array
    {
        return $entries;
    }

    // ──────────────────────────────────────────────────────────
    // State & Events
    // ──────────────────────────────────────────────────────────

    public function getMatchState(?string $token, string $matchId): array
    {
        return [
            'match_id' => $matchId,
            'status' => 'in_progress',
            'current_period' => 1,
            'period_clock_seconds' => 480,
            'home_score' => 0,
            'away_score' => 0,
            'possession' => 'none',
            'possession_clock_seconds' => 28,
            'possession_clock_mode' => 'standard',
            'home_timeouts_remaining' => 2,
            'away_timeouts_remaining' => 2,
            'active_exclusions' => [],
            'player_foul_counts' => [],
            'players_excluded_for_game' => [],
            'shootout_state' => null,
        ];
    }

    public function getEvents(?string $token, string $matchId): array
    {
        return [];
    }

    public function createEvent(string $token, string $matchId, array $data): array
    {
        return array_merge(['id' => 'evt-'.uniqid(), 'match_id' => $matchId, 'sequence' => 1, 'recorded_at' => now()->toIso8601String()], $data);
    }

    public function createBatchEvents(string $token, string $matchId, array $events): array
    {
        return array_map(fn (array $e, int $i) => array_merge(['id' => 'evt-'.uniqid(), 'match_id' => $matchId, 'sequence' => $i + 1, 'recorded_at' => now()->toIso8601String()], $e), $events, array_keys($events));
    }

    // ──────────────────────────────────────────────────────────
    // Stats
    // ──────────────────────────────────────────────────────────

    public function getMatchStats(?string $token, string $matchId): array
    {
        return [];
    }

    public function getTeamStats(?string $token, string $teamId): array
    {
        return [
            'team_id' => $teamId,
            'matches_played' => 5,
            'wins' => 3,
            'losses' => 1,
            'draws' => 1,
            'goals_for' => 42,
            'goals_against' => 28,
            'top_scorers' => [],
            'exclusion_leaders' => [],
        ];
    }

    public function getPlayerStats(?string $token, string $playerId): array
    {
        return [];
    }

    // ──────────────────────────────────────────────────────────
    // Tokens
    // ──────────────────────────────────────────────────────────

    public function createScorerToken(string $token, string $matchId): array
    {
        return [
            'token' => 'dev-scorer-token',
            'url' => url("/match/{$matchId}?token=dev-scorer-token"),
        ];
    }

    public function revokeScorerToken(string $token, string $matchId): void {}
}
