<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CloudApiService;
use App\Services\TokenService;
use Illuminate\Http\RedirectResponse;

class TeamPlayerController extends Controller
{
    public function __construct(
        private readonly CloudApiService $cloudApi,
        private readonly TokenService $tokenService,
    ) {}

    public function store(string $team, string $player): RedirectResponse
    {
        $token = $this->tokenService->getManagerToken();

        $this->cloudApi->addPlayerToTeam($token, $team, $player);

        return redirect()->back();
    }

    public function destroy(string $team, string $player): RedirectResponse
    {
        $token = $this->tokenService->getManagerToken();

        $this->cloudApi->removePlayerFromTeam($token, $team, $player);

        return redirect()->back();
    }
}
