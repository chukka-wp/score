<?php

namespace App\Http\Controllers\Scoring;

use App\Http\Controllers\Controller;
use App\Services\CloudApiService;
use App\Services\TokenService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MatchController extends Controller
{
    public function __construct(
        private readonly CloudApiService $cloudApi,
        private readonly TokenService $tokenService,
    ) {}

    public function show(Request $request, string $match): Response
    {
        $scorerToken = $this->tokenService->getScorerToken();

        $matchData = $this->cloudApi->getMatch($scorerToken, $match);
        $roster = $this->cloudApi->getRoster($scorerToken, $match);
        $state = $this->cloudApi->getMatchState($scorerToken, $match);
        $events = $this->cloudApi->getEvents($scorerToken, $match);

        $ruleSet = $this->cloudApi->getRuleSet(
            null,
            $matchData['rule_set_id'] ?? '',
        );

        return Inertia::render('scoring/match', [
            'match' => $matchData,
            'game_state' => $state,
            'home_roster' => $this->filterRoster($roster, $matchData, 'home'),
            'away_roster' => $this->filterRoster($roster, $matchData, 'away'),
            'events' => $events,
            'rule_set' => $ruleSet,
            'scorer_token' => $scorerToken,
            'reverb_config' => [
                'key' => config('broadcasting.connections.reverb.key', ''),
                'host' => config('broadcasting.connections.reverb.options.host', ''),
                'port' => (int) config('broadcasting.connections.reverb.options.port', 443),
                'scheme' => config('broadcasting.connections.reverb.options.scheme', 'wss'),
            ],
        ]);
    }

    private function filterRoster(array $roster, array $match, string $side): array
    {
        $teamId = $match["{$side}_team_id"] ?? '';

        return array_values(array_filter(
            $roster,
            fn (array $entry) => ($entry['team_id'] ?? '') === $teamId,
        ));
    }
}
