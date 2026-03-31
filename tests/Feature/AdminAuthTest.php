<?php

use App\Services\CloudApiService;
use Inertia\Testing\AssertableInertia as Assert;

it('redirects unauthenticated admin requests to login', function (string $route) {
    $this->get($route)->assertRedirect('/login');
})->with([
    '/admin',
    '/admin/teams',
    '/admin/players',
    '/admin/statistics',
    '/admin/club',
]);

it('allows authenticated admin access', function () {
    session([
        'cloud_token' => 'test-token',
        'cloud_user' => [
            'id' => 1,
            'name' => 'Test Manager',
            'email' => 'test@example.com',
            'club_id' => 'club-1',
        ],
    ]);

    $this->mock(CloudApiService::class, function ($mock) {
        $mock->shouldReceive('getClub')->andReturn([
            'id' => 'club-1',
            'name' => 'Test Club',
            'short_name' => 'TC',
            'logo_url' => null,
            'primary_colour' => '#000000',
        ]);
        $mock->shouldReceive('getTeamsForClub')->andReturn([]);
    });

    $this->get('/admin')->assertSuccessful();
});

it('renders dashboard with club data', function () {
    session([
        'cloud_token' => 'test-token',
        'cloud_user' => [
            'id' => 1,
            'name' => 'Test Manager',
            'email' => 'test@example.com',
            'club_id' => 'club-1',
        ],
    ]);

    $this->mock(CloudApiService::class, function ($mock) {
        $mock->shouldReceive('getClub')->andReturn([
            'id' => 'club-1',
            'name' => 'Test Club',
            'short_name' => 'TC',
            'logo_url' => null,
            'primary_colour' => '#000000',
        ]);
        $mock->shouldReceive('getTeamsForClub')->andReturn([
            ['id' => 'team-1', 'name' => 'U16 Boys'],
        ]);
    });

    $this->get('/admin')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->has('club')
            ->has('teams', 1)
        );
});

it('renders teams index', function () {
    session([
        'cloud_token' => 'test-token',
        'cloud_user' => [
            'id' => 1,
            'name' => 'Test Manager',
            'email' => 'test@example.com',
            'club_id' => 'club-1',
        ],
    ]);

    $this->mock(CloudApiService::class, function ($mock) {
        $mock->shouldReceive('getTeamsForClub')->andReturn([
            ['id' => 'team-1', 'name' => 'U16 Boys'],
            ['id' => 'team-2', 'name' => 'U18 Girls'],
        ]);
    });

    $this->get('/admin/teams')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/teams/index')
            ->has('teams', 2)
        );
});

it('renders players index', function () {
    session([
        'cloud_token' => 'test-token',
        'cloud_user' => [
            'id' => 1,
            'name' => 'Test Manager',
            'email' => 'test@example.com',
            'club_id' => 'club-1',
        ],
    ]);

    $this->mock(CloudApiService::class, function ($mock) {
        $mock->shouldReceive('getPlayersForClub')->andReturn([
            ['id' => 'player-1', 'name' => 'John Doe'],
        ]);
    });

    $this->get('/admin/players')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/players/index')
            ->has('players', 1)
        );
});

it('renders club settings', function () {
    session([
        'cloud_token' => 'test-token',
        'cloud_user' => [
            'id' => 1,
            'name' => 'Test Manager',
            'email' => 'test@example.com',
            'club_id' => 'club-1',
        ],
    ]);

    $this->mock(CloudApiService::class, function ($mock) {
        $mock->shouldReceive('getClub')->andReturn([
            'id' => 'club-1',
            'name' => 'Test Club',
            'short_name' => 'TC',
            'logo_url' => null,
            'primary_colour' => '#0000ff',
        ]);
        $mock->shouldReceive('getRuleSets')->andReturn([]);
    });

    $this->get('/admin/club')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/club/index')
            ->has('club')
            ->where('ruleSets', [])
        );
});
