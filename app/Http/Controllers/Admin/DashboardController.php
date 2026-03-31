<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CloudApiService;
use App\Services\TokenService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly CloudApiService $cloudApi,
        private readonly TokenService $tokenService,
    ) {}

    public function __invoke(): Response
    {
        $token = $this->tokenService->getManagerToken();
        $clubId = $this->tokenService->getManagerClubId();

        $club = $this->cloudApi->getClub($token, $clubId);
        $teams = $this->cloudApi->getTeamsForClub($token, $clubId);

        return Inertia::render('admin/dashboard', [
            'club' => $club,
            'teams' => $teams,
            'user' => $this->tokenService->getManagerUser(),
        ]);
    }
}
