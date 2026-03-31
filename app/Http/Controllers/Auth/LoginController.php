<?php

namespace App\Http\Controllers\Auth;

use App\Exceptions\CloudAuthenticationException;
use App\Http\Controllers\Controller;
use App\Services\CloudApiService;
use App\Services\TokenService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function __construct(
        private readonly CloudApiService $cloudApi,
        private readonly TokenService $tokenService,
    ) {}

    public function create(): Response
    {
        return Inertia::render('auth/login');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        try {
            $response = $this->cloudApi->login(
                $request->input('email'),
                $request->input('password'),
            );

            $this->tokenService->storeManagerToken(
                $response['token'],
                $response['user'],
            );

            $request->session()->regenerate();

            return redirect()->intended(route('admin.dashboard'));
        } catch (CloudAuthenticationException) {
            return back()->withErrors([
                'email' => 'These credentials do not match our records.',
            ])->onlyInput('email');
        }
    }

    public function destroy(Request $request): RedirectResponse
    {
        $token = $this->tokenService->getManagerToken();

        if ($token) {
            try {
                $this->cloudApi->logout($token);
            } catch (\Exception) {
                // Ignore — clear local session regardless
            }
        }

        $this->tokenService->clearManagerSession();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
