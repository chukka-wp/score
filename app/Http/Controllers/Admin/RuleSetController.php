<?php

namespace App\Http\Controllers\Admin;

use App\Exceptions\CloudValidationException;
use App\Http\Controllers\Controller;
use App\Services\CloudApiService;
use App\Services\TokenService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RuleSetController extends Controller
{
    public function __construct(
        private readonly CloudApiService $cloudApi,
        private readonly TokenService $tokenService,
    ) {}

    public function index(): Response
    {
        $token = $this->tokenService->getManagerToken();
        $clubId = $this->tokenService->getManagerClubId();

        $club = $this->cloudApi->getClub($token, $clubId);
        $ruleSets = $this->cloudApi->getRuleSets($token);

        return Inertia::render('admin/club/index', [
            'club' => $club,
            'ruleSets' => $ruleSets,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/club/rule-sets/edit');
    }

    public function store(Request $request): RedirectResponse
    {
        $token = $this->tokenService->getManagerToken();

        try {
            $ruleSet = $this->cloudApi->createRuleSet($token, $request->all());
        } catch (CloudValidationException $e) {
            return back()->withErrors($e->errors)->withInput();
        }

        $ruleSetId = $ruleSet['id'] ?? '';

        return redirect()->route('admin.ruleSets.show', $ruleSetId);
    }

    public function show(string $ruleSet): Response
    {
        $token = $this->tokenService->getManagerToken();

        $ruleSetData = $this->cloudApi->getRuleSet($token, $ruleSet);

        return Inertia::render('admin/club/rule-sets/edit', [
            'ruleSet' => $ruleSetData,
        ]);
    }

    public function update(Request $request, string $ruleSet): RedirectResponse
    {
        $token = $this->tokenService->getManagerToken();

        try {
            $this->cloudApi->updateRuleSet($token, $ruleSet, $request->all());
        } catch (CloudValidationException $e) {
            return back()->withErrors($e->errors)->withInput();
        }

        return redirect()->back();
    }

    public function clone(string $ruleSet): RedirectResponse
    {
        $token = $this->tokenService->getManagerToken();

        $cloned = $this->cloudApi->cloneRuleSet($token, $ruleSet);

        $clonedId = $cloned['id'] ?? '';

        return redirect()->route('admin.ruleSets.show', $clonedId);
    }
}
