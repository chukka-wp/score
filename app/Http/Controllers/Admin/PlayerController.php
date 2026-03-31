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

class PlayerController extends Controller
{
    public function __construct(
        private readonly CloudApiService $cloudApi,
        private readonly TokenService $tokenService,
    ) {}

    public function index(): Response
    {
        $token = $this->tokenService->getManagerToken();
        $clubId = $this->tokenService->getManagerClubId();

        $players = $this->cloudApi->getPlayersForClub($token, $clubId);

        return Inertia::render('admin/players/index', [
            'players' => $players,
        ]);
    }

    public function create(): Response
    {
        $token = $this->tokenService->getManagerToken();
        $clubId = $this->tokenService->getManagerClubId();

        $teams = $this->cloudApi->getTeamsForClub($token, $clubId);

        return Inertia::render('admin/players/create', [
            'teams' => $teams,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $token = $this->tokenService->getManagerToken();
        $clubId = $this->tokenService->getManagerClubId();

        try {
            $player = $this->cloudApi->createPlayer($token, $clubId, $request->all());
        } catch (CloudValidationException $e) {
            return back()->withErrors($e->errors)->withInput();
        }

        $playerId = $player['id'] ?? '';

        return redirect()->route('admin.players.show', $playerId);
    }

    public function show(string $player): Response
    {
        $token = $this->tokenService->getManagerToken();

        $playerData = $this->cloudApi->getPlayer($token, $player);
        $stats = $this->cloudApi->getPlayerStats($token, $player);

        return Inertia::render('admin/players/show', [
            'player' => $playerData,
            'stats' => $stats,
        ]);
    }

    public function update(Request $request, string $player): RedirectResponse
    {
        $token = $this->tokenService->getManagerToken();

        try {
            $this->cloudApi->updatePlayer($token, $player, $request->all());
        } catch (CloudValidationException $e) {
            return back()->withErrors($e->errors)->withInput();
        }

        return redirect()->back();
    }
}
