<?php

it('rejects scorer entry without a token', function () {
    $this->get('/match/test-match-id')
        ->assertForbidden();
});

it('rejects scorer scoring page without session', function () {
    $this->get('/match/test-match-id/score')
        ->assertForbidden();
});
