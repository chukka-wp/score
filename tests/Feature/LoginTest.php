<?php

use App\Exceptions\CloudAuthenticationException;
use App\Services\CloudApiService;
use Inertia\Testing\AssertableInertia as Assert;

it('renders the login page', function () {
    $this->get('/login')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
        );
});

it('authenticates with valid credentials', function () {
    $this->mock(CloudApiService::class, function ($mock) {
        $mock->shouldReceive('login')
            ->with('test@example.com', 'password123')
            ->once()
            ->andReturn([
                'token' => 'valid-sanctum-token',
                'user' => [
                    'id' => 1,
                    'name' => 'Test Manager',
                    'email' => 'test@example.com',
                    'club_id' => 'club-1',
                ],
            ]);
    });

    $this->post('/login', [
        'email' => 'test@example.com',
        'password' => 'password123',
    ])->assertRedirect('/admin');

    expect(session('cloud_token'))->toBe('valid-sanctum-token');
    expect(session('cloud_user'))->name->toBe('Test Manager');
});

it('rejects invalid credentials', function () {
    $this->mock(CloudApiService::class, function ($mock) {
        $mock->shouldReceive('login')
            ->once()
            ->andThrow(new CloudAuthenticationException);
    });

    $this->post('/login', [
        'email' => 'bad@example.com',
        'password' => 'wrong',
    ])->assertRedirect()
        ->assertSessionHasErrors('email');
});

it('validates required fields', function () {
    $this->post('/login', [])
        ->assertSessionHasErrors(['email', 'password']);
});

it('logs out and clears session', function () {
    session([
        'cloud_token' => 'test-token',
        'cloud_user' => ['id' => 1, 'name' => 'Test'],
    ]);

    $this->mock(CloudApiService::class, function ($mock) {
        $mock->shouldReceive('logout')->once();
    });

    $this->post('/logout')->assertRedirect('/login');

    expect(session('cloud_token'))->toBeNull();
});
