<?php

namespace App\Http\Controllers\Auth;

use App\Exceptions\CloudApiException;
use App\Http\Controllers\Controller;
use App\Services\CloudApiService;
use App\Services\TokenService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScorerAuthController extends Controller
{
    public function __construct(
        private readonly TokenService $tokenService,
        private readonly CloudApiService $cloudApi,
    ) {}

    public function create(): Response
    {
        return Inertia::render('auth/scorer-code');
    }

    public function storeCode(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6', 'alpha_num'],
        ]);

        try {
            $result = $this->cloudApi->resolveScorerCode($request->input('code'));
        } catch (CloudApiException) {
            return back()->withErrors(['code' => 'Invalid or expired code.']);
        }

        $matchId = $result['match']['id'] ?? null;
        $token = $result['token'] ?? null;

        if (! $matchId || ! $token) {
            return back()->withErrors(['code' => 'Invalid or expired code.']);
        }

        try {
            $this->tokenService->storeScorerToken($matchId, $token);
        } catch (CloudApiException) {
            return back()->withErrors(['code' => 'Invalid or expired code.']);
        }

        return redirect()->route('scoring.match', $matchId);
    }

    public function store(Request $request, string $match): RedirectResponse
    {
        $rawToken = $request->query('token');

        if (! $rawToken && $this->tokenService->getScorerMatchId() === $match) {
            return redirect()->route('scoring.match', $match);
        }

        if (! $rawToken) {
            return redirect()->route('scoring.code');
        }

        try {
            $this->tokenService->storeScorerToken($match, $rawToken);
        } catch (CloudApiException) {
            return redirect()->route('scoring.code')
                ->withErrors(['code' => 'Invalid or expired scorer link.']);
        }

        return redirect()->route('scoring.match', $match);
    }
}
