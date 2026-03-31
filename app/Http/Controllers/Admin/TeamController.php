<?php

namespace App\Http\Controllers\Admin;

use App\Exceptions\CloudValidationException;
use App\Http\Controllers\Controller;
use App\Services\CloudApiService;
use App\Services\TokenService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
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

        return Inertia::render('admin/teams/index', [
            'teams' => $teams,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/teams/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $token = $this->tokenService->getManagerToken();
        $clubId = $this->tokenService->getManagerClubId();

        try {
            $team = $this->cloudApi->createTeam($token, $clubId, $request->all());
        } catch (CloudValidationException $e) {
            return back()->withErrors($e->errors)->withInput();
        }

        $teamId = $team['id'] ?? '';

        return redirect()->route('admin.teams.show', $teamId);
    }

    public function show(string $team): Response
    {
        $token = $this->tokenService->getManagerToken();

        $teamData = $this->cloudApi->getTeam($token, $team);
        $roster = $this->cloudApi->getPlayersForTeam($token, $team);
        $matches = $this->cloudApi->getMatchesForTeam($token, $team);
        $stats = $this->cloudApi->getTeamStats($token, $team);

        return Inertia::render('admin/teams/show', [
            'team' => $teamData,
            'roster' => $roster,
            'matches' => $matches,
            'stats' => $stats,
        ]);
    }

    public function update(Request $request, string $team): RedirectResponse
    {
        $token = $this->tokenService->getManagerToken();

        try {
            $this->cloudApi->updateTeam($token, $team, $request->all());
        } catch (CloudValidationException $e) {
            return back()->withErrors($e->errors)->withInput();
        }

        return redirect()->back();
    }
}
