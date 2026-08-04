<?php

use App\Http\Controllers\Api\V1\Health\LiveHealthCheckController;
use App\Http\Controllers\Api\V1\Health\ReadyHealthCheckController;
use Illuminate\Support\Facades\Route;

Route::get('/health/live', LiveHealthCheckController::class)->name('health.live');
Route::get('/health/ready', ReadyHealthCheckController::class)->name('health.ready');
