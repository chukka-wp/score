<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CloudApiService;
use App\Services\TokenService;
use Illuminate\Http\RedirectResponse;

class ScorerTokenController extends Controller
{
    public function __construct(
        private readonly CloudApiService $cloudApi,
        private readonly TokenService $tokenService,
    ) {}

    public function store(string $match): RedirectResponse
    {
        $token = $this->tokenService->getManagerToken();

        $result = $this->cloudApi->createScorerToken($token, $match);

        $rawToken = $result['data']['token'] ?? $result['token'] ?? '';
        $scorerUrl = url("/match/{$match}?token={$rawToken}");

        return redirect()->back()->with('scorer_url', $scorerUrl);
    }

    public function destroy(string $match): RedirectResponse
    {
        $token = $this->tokenService->getManagerToken();

        $this->cloudApi->revokeScorerToken($token, $match);

        return redirect()->back();
    }
}
