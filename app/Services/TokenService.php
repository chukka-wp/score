<?php

namespace App\Services;

class TokenService
{
    public function __construct(
        private readonly CloudApiService $cloudApi,
    ) {}

    public function storeScorerToken(string $matchId, string $rawToken): void
    {
        $this->cloudApi->getMatch($rawToken, $matchId);

        session(['scorer_token' => $rawToken, 'scorer_match_id' => $matchId]);
    }

    public function getScorerToken(): ?string
    {
        return session('scorer_token');
    }

    public function getScorerMatchId(): ?string
    {
        return session('scorer_match_id');
    }

    public function hasScorerSession(): bool
    {
        return session()->has('scorer_token') && session()->has('scorer_match_id');
    }

    public function clearScorerSession(): void
    {
        session()->forget(['scorer_token', 'scorer_match_id']);
    }
}
