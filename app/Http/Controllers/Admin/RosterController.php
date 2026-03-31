<?php

namespace App\Http\Controllers\Admin;

use App\Exceptions\CloudValidationException;
use App\Http\Controllers\Controller;
use App\Services\CloudApiService;
use App\Services\TokenService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RosterController extends Controller
{
    public function __construct(
        private readonly CloudApiService $cloudApi,
        private readonly TokenService $tokenService,
    ) {}

    public function show(string $match): RedirectResponse
    {
        return redirect()->route('admin.matches.show', $match);
    }

    public function store(Request $request, string $match): RedirectResponse
    {
        $token = $this->tokenService->getManagerToken();

        try {
            $this->cloudApi->setRoster($token, $match, $request->input('entries', []));
        } catch (CloudValidationException $e) {
            return back()->withErrors($e->errors)->withInput();
        }

        return redirect()->back();
    }
}
