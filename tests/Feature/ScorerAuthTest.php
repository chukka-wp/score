<?php

use App\Exceptions\CloudApiException;
use App\Services\CloudApiService;

it('redirects scorer entry without a token to code page', function () {
    $this->get('/match/test-match-id')->assertRedirect('/score');
});

it('redirects scoring page without session to code page', function () {
    $this->get('/match/test-match-id/score')->assertRedirect('/score');
});

it('stores scorer token and redirects', function () {
    $this->mock(CloudApiService::class, function ($mock) {
        $mock->shouldReceive('getMatch')->once()->andReturn([
            'id' => 'test-match-id',
            'status' => 'in_progress',
        ]);
    });

    $this->get('/match/test-match-id?token=valid-scorer-token')
        ->assertRedirect('/match/test-match-id/score');

    expect(session('scorer_token'))->toBe('valid-scorer-token');
    expect(session('scorer_match_id'))->toBe('test-match-id');
});

it('resolves scorer code and redirects to match', function () {
    $this->mock(CloudApiService::class, function ($mock) {
        $mock->shouldReceive('resolveScorerCode')
            ->with('ABC123')
            ->once()
            ->andReturn([
                'match' => ['id' => 'test-match-id'],
                'token' => 'resolved-token',
            ]);

        $mock->shouldReceive('getMatch')
            ->with('resolved-token', 'test-match-id')
            ->once()
            ->andReturn(['id' => 'test-match-id']);
    });

    $this->post('/score', ['code' => 'ABC123'])
        ->assertRedirect('/match/test-match-id/score');

    expect(session('scorer_token'))->toBe('resolved-token');
    expect(session('scorer_match_id'))->toBe('test-match-id');
});

it('rejects invalid scorer code', function () {
    $this->mock(CloudApiService::class, function ($mock) {
        $mock->shouldReceive('resolveScorerCode')
            ->once()
            ->andThrow(new CloudApiException('Not found', 404));
    });

    $this->post('/score', ['code' => 'BADONE'])
        ->assertSessionHasErrors('code');
});

it('validates scorer code format', function () {
    $this->post('/score', ['code' => 'AB'])
        ->assertSessionHasErrors('code');
});

it('redirects scoring page when match id does not match session', function () {
    session([
        'scorer_token' => 'test-token',
        'scorer_match_id' => 'match-1',
    ]);

    $this->get('/match/match-2/score')->assertRedirect('/score');
});
