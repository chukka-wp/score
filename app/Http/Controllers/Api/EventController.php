<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CloudApiService;
use App\Services\TokenService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function __construct(
        private readonly CloudApiService $cloudApi,
        private readonly TokenService $tokenService,
    ) {}

    public function store(Request $request, string $match): JsonResponse
    {
        $result = $this->cloudApi->createEvent(
            $this->tokenService->getScorerToken(),
            $match,
            $request->all(),
        );

        return response()->json($result, 201);
    }

    public function batch(Request $request, string $match): JsonResponse
    {
        $result = $this->cloudApi->createBatchEvents(
            $this->tokenService->getScorerToken(),
            $match,
            $request->input('events', []),
        );

        return response()->json($result);
    }
}
