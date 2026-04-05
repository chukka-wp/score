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
    // Matches
    // ──────────────────────────────────────────────────────────

    public function getMatch(?string $token, string $matchId): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url("/matches/{$matchId}"))
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
    // Rule Sets
    // ──────────────────────────────────────────────────────────

    public function getRuleSet(?string $token, string $ruleSetId): array
    {
        return $this->handleResponse(
            $this->request($token)->get($this->url("/rule-sets/{$ruleSetId}"))
        );
    }

    // ──────────────────────────────────────────────────────────
    // Tokens
    // ──────────────────────────────────────────────────────────

    public function resolveScorerCode(string $code): array
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
