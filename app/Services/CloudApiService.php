<?php

namespace App\Services;

use App\Exceptions\CloudApiException;
use App\Exceptions\CloudAuthenticationException;
use App\Exceptions\CloudAuthorizationException;
use App\Exceptions\CloudValidationException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class CloudApiService
{
    // ──────────────────────────────────────────────────────────
    // Auth
    // ──────────────────────────────────────────────────────────

    public function login(string $email, string $password): array
    {
        return $this->handleResponse(
            $this->request()->post($this->url('/auth/login'), [
                'email' => $email,
                'password' => $password,
            ])
        );
    }

    public function logout(string $token): void
    {
        $this->handleResponse(
            $this->request($token)->post($this->url('/auth/logout'))
        );
    }

    public function me(string $token): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url('/auth/me'))
        );
    }

    // ──────────────────────────────────────────────────────────
    // Clubs
    // ──────────────────────────────────────────────────────────

    public function getClub(string $token, string $clubId): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url("/clubs/{$clubId}"))
        );
    }

    public function updateClub(string $token, string $clubId, array $data): array
    {
        return $this->handleResponse(
            $this->request($token)->put($this->url("/clubs/{$clubId}"), $data)
        );
    }

    // ──────────────────────────────────────────────────────────
    // Teams
    // ──────────────────────────────────────────────────────────

    public function getTeamsForClub(string $token, string $clubId): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url("/clubs/{$clubId}/teams"))
        );
    }

    public function createTeam(string $token, string $clubId, array $data): array
    {
        return $this->handleResponse(
            $this->request($token)->post($this->url("/clubs/{$clubId}/teams"), $data)
        );
    }

    public function getTeam(string $token, string $teamId): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url("/teams/{$teamId}"))
        );
    }

    public function updateTeam(string $token, string $teamId, array $data): array
    {
        return $this->handleResponse(
            $this->request($token)->put($this->url("/teams/{$teamId}"), $data)
        );
    }

    // ──────────────────────────────────────────────────────────
    // Players
    // ──────────────────────────────────────────────────────────

    public function getPlayersForClub(string $token, string $clubId): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url("/clubs/{$clubId}/players"))
        );
    }

    public function createPlayer(string $token, string $clubId, array $data): array
    {
        return $this->handleResponse(
            $this->request($token)->post($this->url("/clubs/{$clubId}/players"), $data)
        );
    }

    public function getPlayer(string $token, string $playerId): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url("/players/{$playerId}"))
        );
    }

    public function updatePlayer(string $token, string $playerId, array $data): array
    {
        return $this->handleResponse(
            $this->request($token)->put($this->url("/players/{$playerId}"), $data)
        );
    }

    public function getPlayersForTeam(string $token, string $teamId): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url("/teams/{$teamId}/players"))
        );
    }

    public function addPlayerToTeam(string $token, string $teamId, string $playerId): void
    {
        $this->handleResponse(
            $this->request($token)->post($this->url("/teams/{$teamId}/players/{$playerId}"))
        );
    }

    public function removePlayerFromTeam(string $token, string $teamId, string $playerId): void
    {
        $this->handleResponse(
            $this->request($token)->delete($this->url("/teams/{$teamId}/players/{$playerId}"))
        );
    }

    // ──────────────────────────────────────────────────────────
    // Rule Sets
    // ──────────────────────────────────────────────────────────

    public function getRuleSets(string $token): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url('/rule-sets'))
        );
    }

    public function createRuleSet(string $token, array $data): array
    {
        return $this->handleResponse(
            $this->request($token)->post($this->url('/rule-sets'), $data)
        );
    }

    public function getRuleSet(string $token, string $ruleSetId): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url("/rule-sets/{$ruleSetId}"))
        );
    }

    public function updateRuleSet(string $token, string $ruleSetId, array $data): array
    {
        return $this->handleResponse(
            $this->request($token)->put($this->url("/rule-sets/{$ruleSetId}"), $data)
        );
    }

    public function cloneRuleSet(string $token, string $ruleSetId): array
    {
        return $this->handleResponse(
            $this->request($token)->post($this->url("/rule-sets/{$ruleSetId}/clone"))
        );
    }

    // ──────────────────────────────────────────────────────────
    // Matches
    // ──────────────────────────────────────────────────────────

    public function getMatchesForTeam(string $token, string $teamId): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url("/teams/{$teamId}/matches"))
        );
    }

    public function createMatch(string $token, array $data): array
    {
        return $this->handleResponse(
            $this->request($token)->post($this->url('/matches'), $data)
        );
    }

    public function getMatch(?string $token, string $matchId): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url("/matches/{$matchId}"))
        );
    }

    public function updateMatch(string $token, string $matchId, array $data): array
    {
        return $this->handleResponse(
            $this->request($token)->put($this->url("/matches/{$matchId}"), $data)
        );
    }

    // ──────────────────────────────────────────────────────────
    // Roster
    // ──────────────────────────────────────────────────────────

    public function getRoster(?string $token, string $matchId): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url("/matches/{$matchId}/roster"))
        );
    }

    public function setRoster(string $token, string $matchId, array $entries): array
    {
        return $this->handleResponse(
            $this->request($token)->post($this->url("/matches/{$matchId}/roster"), [
                'entries' => $entries,
            ])
        );
    }

    // ──────────────────────────────────────────────────────────
    // State & Events
    // ──────────────────────────────────────────────────────────

    public function getMatchState(?string $token, string $matchId): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url("/matches/{$matchId}/state"))
        );
    }

    public function getEvents(?string $token, string $matchId): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url("/matches/{$matchId}/events"))
        );
    }

    public function createEvent(string $token, string $matchId, array $data): array
    {
        return $this->handleResponse(
            $this->request($token)->post($this->url("/matches/{$matchId}/events"), $data)
        );
    }

    public function createBatchEvents(string $token, string $matchId, array $events): array
    {
        return $this->handleResponse(
            $this->request($token)->post($this->url("/matches/{$matchId}/events/batch"), [
                'events' => $events,
            ])
        );
    }

    // ──────────────────────────────────────────────────────────
    // Stats
    // ──────────────────────────────────────────────────────────

    public function getMatchStats(?string $token, string $matchId): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url("/matches/{$matchId}/stats"))
        );
    }

    public function getTeamStats(?string $token, string $teamId): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url("/teams/{$teamId}/stats"))
        );
    }

    public function getPlayerStats(?string $token, string $playerId): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url("/players/{$playerId}/stats"))
        );
    }

    // ──────────────────────────────────────────────────────────
    // Tokens
    // ──────────────────────────────────────────────────────────

    public function createScorerToken(string $token, string $matchId): array
    {
        return $this->handleResponse(
            $this->request($token)->post($this->url("/matches/{$matchId}/scorer-token"))
        );
    }

    public function revokeScorerToken(string $token, string $matchId): void
    {
        $this->handleResponse(
            $this->request($token)->delete($this->url("/matches/{$matchId}/scorer-token"))
        );
    }

    public function resolvesScorerCode(string $code): array
    {
        return $this->handleResponse(
            $this->request()->get($this->url("/scorer/bootstrap/{$code}"))
        );
    }

    // ──────────────────────────────────────────────────────────
    // Internal
    // ──────────────────────────────────────────────────────────

    private function url(string $path): string
    {
        return config('services.chukka.cloud_url').config('services.chukka.api_prefix').$path;
    }

    private function request(?string $token = null): PendingRequest
    {
        $request = Http::acceptJson()
            ->contentType('application/json')
            ->timeout(config('services.chukka.timeout'))
            ->connectTimeout(config('services.chukka.connect_timeout'));

        if ($token) {
            $request->withToken($token);
        }

        return $request;
    }

    private function handleResponse(Response $response): array
    {
        if ($response->successful()) {
            $json = $response->json() ?? [];

            return $json['data'] ?? $json;
        }

        $body = $response->json() ?? [];
        $message = $body['message'] ?? "Cloud API error: {$response->status()}";

        throw match ($response->status()) {
            401 => new CloudAuthenticationException($message),
            403 => new CloudAuthorizationException($message),
            422 => new CloudValidationException(
                errors: $body['errors'] ?? [],
                message: $message,
            ),
            default => new CloudApiException($message, $response->status(), $body),
        };
    }
}
