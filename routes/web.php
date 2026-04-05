<?php

use App\Http\Controllers\Auth\ScorerAuthController;
use App\Http\Controllers\Scoring;
use Illuminate\Support\Facades\Route;

// ──────────────────────────────────────────────────────────
// Dev helpers (local only)
// ──────────────────────────────────────────────────────────

if (app()->isLocal()) {
    Route::get('/dev-score/{match?}', function (string $match = 'dev-match') {
        session([
            'scorer_token' => 'dev-scorer-token',
            'scorer_match_id' => $match,
        ]);

        return redirect()->route('scoring.match', $match);
    })->name('devScore');
}

// ──────────────────────────────────────────────────────────
// Scorer entry + live scoring
// ──────────────────────────────────────────────────────────

Route::redirect('/', '/score')->name('home');

Route::get('/score', [ScorerAuthController::class, 'create'])->name('scoring.code');
Route::post('/score', [ScorerAuthController::class, 'storeCode'])->name('scoring.code.store');
Route::get('/match/{match}', [ScorerAuthController::class, 'store'])->name('scoring.entry');
Route::get('/match/{match}/score', [Scoring\MatchController::class, 'show'])
    ->middleware('scorer')
    ->name('scoring.match');
