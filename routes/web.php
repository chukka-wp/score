<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ScorerAuthController;
use App\Http\Controllers\Scoring;
use Illuminate\Support\Facades\Route;

// ──────────────────────────────────────────────────────────
// Dev login (local only)
// ──────────────────────────────────────────────────────────

if (app()->isLocal()) {
    Route::get('/dev-login', function () {
        session([
            'cloud_token' => 'dev-token',
            'cloud_user' => [
                'id' => 1,
                'name' => 'Dev Manager',
                'email' => 'dev@chukka.test',
                'club_id' => 'dev-club',
            ],
        ]);

        return redirect('/admin');
    })->name('devLogin');

    Route::get('/dev-score/{match?}', function (string $match = 'dev-match') {
        session([
            'scorer_token' => 'dev-scorer-token',
            'scorer_match_id' => $match,
        ]);

        return redirect()->route('scoring.match', $match);
    })->name('devScore');
}

// ──────────────────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────────────────

Route::get('/login', [LoginController::class, 'create'])->name('login');
Route::post('/login', [LoginController::class, 'store']);
Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

Route::redirect('/', '/admin')->name('home');

// ──────────────────────────────────────────────────────────
// Admin (manager auth)
// ──────────────────────────────────────────────────────────

Route::prefix('admin')->middleware('manager')->group(function () {
    Route::get('/', Admin\DashboardController::class)->name('admin.dashboard');

    // Club
    Route::get('/club', [Admin\ClubController::class, 'show'])->name('admin.club.show');
    Route::put('/club', [Admin\ClubController::class, 'update'])->name('admin.club.update');

    // Rule sets
    Route::get('/club/rule-sets/create', [Admin\RuleSetController::class, 'create'])->name('admin.ruleSets.create');
    Route::post('/club/rule-sets', [Admin\RuleSetController::class, 'store'])->name('admin.ruleSets.store');
    Route::get('/club/rule-sets/{ruleSet}', [Admin\RuleSetController::class, 'show'])->name('admin.ruleSets.show');
    Route::put('/club/rule-sets/{ruleSet}', [Admin\RuleSetController::class, 'update'])->name('admin.ruleSets.update');
    Route::post('/club/rule-sets/{ruleSet}/clone', [Admin\RuleSetController::class, 'clone'])->name('admin.ruleSets.clone');

    // Teams
    Route::get('/teams', [Admin\TeamController::class, 'index'])->name('admin.teams.index');
    Route::get('/teams/create', [Admin\TeamController::class, 'create'])->name('admin.teams.create');
    Route::post('/teams', [Admin\TeamController::class, 'store'])->name('admin.teams.store');
    Route::get('/teams/{team}', [Admin\TeamController::class, 'show'])->name('admin.teams.show');
    Route::put('/teams/{team}', [Admin\TeamController::class, 'update'])->name('admin.teams.update');

    // Team players
    Route::post('/teams/{team}/players/{player}', [Admin\TeamPlayerController::class, 'store'])->name('admin.teams.players.store');
    Route::delete('/teams/{team}/players/{player}', [Admin\TeamPlayerController::class, 'destroy'])->name('admin.teams.players.destroy');

    // Team matches
    Route::get('/teams/{team}/matches', [Admin\MatchController::class, 'index'])->name('admin.matches.index');
    Route::get('/teams/{team}/matches/create', [Admin\MatchController::class, 'create'])->name('admin.matches.create');

    // Matches
    Route::post('/matches', [Admin\MatchController::class, 'store'])->name('admin.matches.store');
    Route::get('/matches/{match}', [Admin\MatchController::class, 'show'])->name('admin.matches.show');
    Route::put('/matches/{match}', [Admin\MatchController::class, 'update'])->name('admin.matches.update');

    // Roster
    Route::get('/matches/{match}/roster', [Admin\RosterController::class, 'show'])->name('admin.roster.show');
    Route::post('/matches/{match}/roster', [Admin\RosterController::class, 'store'])->name('admin.roster.store');

    // Scorer token
    Route::post('/matches/{match}/scorer-token', [Admin\ScorerTokenController::class, 'store'])->name('admin.scorerToken.store');
    Route::delete('/matches/{match}/scorer-token', [Admin\ScorerTokenController::class, 'destroy'])->name('admin.scorerToken.destroy');

    // Players
    Route::get('/players', [Admin\PlayerController::class, 'index'])->name('admin.players.index');
    Route::get('/players/create', [Admin\PlayerController::class, 'create'])->name('admin.players.create');
    Route::post('/players', [Admin\PlayerController::class, 'store'])->name('admin.players.store');
    Route::get('/players/{player}', [Admin\PlayerController::class, 'show'])->name('admin.players.show');
    Route::put('/players/{player}', [Admin\PlayerController::class, 'update'])->name('admin.players.update');

    // Statistics
    Route::get('/statistics', [Admin\StatisticsController::class, 'index'])->name('admin.statistics.index');
    Route::get('/statistics/teams/{team}', [Admin\StatisticsController::class, 'team'])->name('admin.statistics.team');
    Route::get('/statistics/players/{player}', [Admin\StatisticsController::class, 'player'])->name('admin.statistics.player');
    Route::get('/statistics/matches/{match}', [Admin\StatisticsController::class, 'match'])->name('admin.statistics.match');
});

// ──────────────────────────────────────────────────────────
// Scorer entry + live scoring
// ──────────────────────────────────────────────────────────

Route::get('/score', [ScorerAuthController::class, 'create'])->name('scoring.code');
Route::post('/score', [ScorerAuthController::class, 'storeCode'])->name('scoring.code.store');
Route::get('/match/{match}', [ScorerAuthController::class, 'store'])->name('scoring.entry');
Route::get('/match/{match}/score', [Scoring\MatchController::class, 'show'])
    ->middleware('scorer')
    ->name('scoring.match');
