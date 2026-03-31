<?php

namespace App\Http\Controllers\Auth;

use App\Exceptions\CloudApiException;
use App\Http\Controllers\Controller;
use App\Services\TokenService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ScorerAuthController extends Controller
{
    public function __construct(
        private readonly TokenService $tokenService,
    ) {}

    public function store(Request $request, string $match): RedirectResponse
    {
        $rawToken = $request->query('token');

        if (! $rawToken && $this->tokenService->hasScorerSession()) {
            return redirect()->route('scoring.match', $match);
        }

        if (! $rawToken) {
            abort(403, 'Missing scorer token.');
        }

        try {
            $this->tokenService->storeScorerToken($match, $rawToken);
        } catch (CloudApiException) {
            abort(403, 'Invalid or expired scorer token.');
        }

        return redirect()->route('scoring.match', $match);
    }
}
