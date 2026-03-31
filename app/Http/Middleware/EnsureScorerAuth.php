<?php

namespace App\Http\Middleware;

use App\Services\TokenService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureScorerAuth
{
    public function __construct(
        private readonly TokenService $tokenService,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        if (! $this->tokenService->hasScorerSession()) {
            abort(403, 'Scorer session expired or invalid.');
        }

        $matchId = $request->route('match');

        if ($matchId && $matchId !== $this->tokenService->getScorerMatchId()) {
            abort(403, 'Scorer token does not match this match.');
        }

        return $next($request);
    }
}
