<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $isManager = $request->session()->has('cloud_token');
        $isScorer = $request->session()->has('scorer_token');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $isManager ? $request->session()->get('cloud_user') : null,
                'isManager' => $isManager,
                'isScorer' => $isScorer,
                'scorerMatchId' => $request->session()->get('scorer_match_id'),
            ],
        ];
    }
}
