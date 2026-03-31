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

class ClubController extends Controller
{
    public function __construct(
        private readonly CloudApiService $cloudApi,
        private readonly TokenService $tokenService,
    ) {}

    public function show(): Response
    {
        $token = $this->tokenService->getManagerToken();
        $clubId = $this->tokenService->getManagerClubId();

        $club = $this->cloudApi->getClub($token, $clubId);
        $ruleSets = $this->cloudApi->getRuleSets($token);

        return Inertia::render('admin/club/index', [
            'club' => $club,
            'ruleSets' => $ruleSets,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $token = $this->tokenService->getManagerToken();
        $clubId = $this->tokenService->getManagerClubId();

        try {
            $this->cloudApi->updateClub($token, $clubId, $request->all());
        } catch (CloudValidationException $e) {
            return back()->withErrors($e->errors)->withInput();
        }

        return redirect()->back();
    }
}
