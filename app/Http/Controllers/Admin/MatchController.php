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

class MatchController extends Controller
{
    public function __construct(
        private readonly CloudApiService $cloudApi,
        private readonly TokenService $tokenService,
    ) {}

    public function index(string $team): Response
    {
        $token = $this->tokenService->getManagerToken();

        $teamData = $this->cloudApi->getTeam($token, $team);
        $matches = $this->cloudApi->getMatchesForTeam($token, $team);

        return Inertia::render('admin/matches/index', [
            'team' => $teamData,
            'matches' => $matches,
        ]);
    }

    public function create(string $team): Response
    {
        $token = $this->tokenService->getManagerToken();

        $teamData = $this->cloudApi->getTeam($token, $team);
        $roster = $this->cloudApi->getPlayersForTeam($token, $team);
        $ruleSets = $this->cloudApi->getRuleSets($token);

        return Inertia::render('admin/matches/setup', [
            'team' => $teamData,
            'roster' => $roster,
            'ruleSets' => $ruleSets,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $token = $this->tokenService->getManagerToken();

        try {
            $match = $this->cloudApi->createMatch($token, $request->all());
        } catch (CloudValidationException $e) {
            return back()->withErrors($e->errors)->withInput();
        }

        $matchId = $match['id'] ?? '';

        return redirect()->route('admin.matches.show', $matchId);
    }

    public function show(string $match): Response
    {
        $token = $this->tokenService->getManagerToken();

        $matchData = $this->cloudApi->getMatch($token, $match);
        $roster = $this->cloudApi->getRoster($token, $match);
        $ruleSets = $this->cloudApi->getRuleSets($token);

        return Inertia::render('admin/matches/setup', [
            'match' => $matchData,
            'roster' => $roster,
            'ruleSets' => $ruleSets,
        ]);
    }

    public function update(Request $request, string $match): RedirectResponse
    {
        $token = $this->tokenService->getManagerToken();

        try {
            $this->cloudApi->updateMatch($token, $match, $request->all());
        } catch (CloudValidationException $e) {
            return back()->withErrors($e->errors)->withInput();
        }

        return redirect()->back();
    }
}
