<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CloudApiService;
use App\Services\TokenService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MatchStateController extends Controller
{
    public function __construct(
        private readonly CloudApiService $cloudApi,
        private readonly TokenService $tokenService,
    ) {}

    public function show(Request $request, string $match): JsonResponse
    {
        $result = $this->cloudApi->getMatchState(
            $this->tokenService->getScorerToken(),
            $match,
        );

        return response()->json($result);
    }
}
