<?php

use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\MatchStateController;
use Illuminate\Support\Facades\Route;

Route::prefix('matches/{match}')->middleware('scorer')->group(function () {
    Route::post('/events', [EventController::class, 'store'])->name('api.events.store');
    Route::post('/events/batch', [EventController::class, 'batch'])->name('api.events.batch');
    Route::get('/state', [MatchStateController::class, 'show'])->name('api.match-state.show');
});
