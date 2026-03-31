<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CloudApiService;
use App\Services\TokenService;
use Inertia\Inertia;
use Inertia\Response;

class StatisticsController extends Controller
{
    public function __construct(
        private readonly CloudApiService $cloudApi,
        private readonly TokenService $tokenService,
    ) {}

    public function index(): Response
    {
        $token = $this->tokenService->getManagerToken();
        $clubId = $this->tokenService->getManagerClubId();

        $teams = $this->cloudApi->getTeamsForClub($token, $clubId);

        return Inertia::render('admin/statistics/index', [
            'teams' => $teams,
        ]);
    }

    public function team(string $team): Response
    {
        $token = $this->tokenService->getManagerToken();

        $teamData = $this->cloudApi->getTeam($token, $team);
        $stats = $this->cloudApi->getTeamStats($token, $team);
        $matches = $this->cloudApi->getMatchesForTeam($token, $team);

        return Inertia::render('admin/statistics/team', [
            'team' => $teamData,
            'stats' => $stats,
            'matches' => $matches,
        ]);
    }

    public function player(string $player): Response
    {
        $token = $this->tokenService->getManagerToken();

        $playerData = $this->cloudApi->getPlayer($token, $player);
        $stats = $this->cloudApi->getPlayerStats($token, $player);

        return Inertia::render('admin/statistics/player', [
            'player' => $playerData,
            'stats' => $stats,
        ]);
    }

    public function match(string $match): Response
    {
        $token = $this->tokenService->getManagerToken();

        $matchData = $this->cloudApi->getMatch($token, $match);
        $stats = $this->cloudApi->getMatchStats($token, $match);

        return Inertia::render('admin/statistics/match', [
            'match' => $matchData,
            'stats' => $stats,
        ]);
    }
}
