<?php

use App\Services\CloudApiService;

it('rejects scorer entry without a token', function () {
    $this->get('/match/test-match-id')->assertForbidden();
});

it('rejects scoring page without session', function () {
    $this->get('/match/test-match-id/score')->assertForbidden();
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

it('rejects scoring page when match id does not match session', function () {
    session([
        'scorer_token' => 'test-token',
        'scorer_match_id' => 'match-1',
    ]);

    $this->get('/match/match-2/score')->assertForbidden();
});
