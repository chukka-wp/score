<?php

namespace App\Services;

class TokenService
{
    public function __construct(
        private readonly CloudApiService $cloudApi,
    ) {}

    // ──────────────────────────────────────────────────────────
    // Manager auth (cloud Sanctum token)
    // ──────────────────────────────────────────────────────────

    public function storeManagerToken(string $token, array $user): void
    {
        session(['cloud_token' => $token, 'cloud_user' => $user]);
    }

    public function getManagerToken(): ?string
    {
        return session('cloud_token');
    }

    public function getManagerUser(): ?array
    {
        return session('cloud_user');
    }

    public function hasManagerSession(): bool
    {
        return session()->has('cloud_token');
    }

    public function getManagerClubId(): string
    {
        return $this->getManagerUser()['club_id'] ?? '';
    }

    public function clearManagerSession(): void
    {
        session()->forget(['cloud_token', 'cloud_user']);
    }

    // ──────────────────────────────────────────────────────────
    // Scorer auth (one-time match token)
    // ──────────────────────────────────────────────────────────

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
