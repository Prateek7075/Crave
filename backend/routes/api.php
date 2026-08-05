<?php

use App\Http\Controllers\Api\V1\Health\LiveHealthCheckController;
use App\Http\Controllers\Api\V1\Health\ReadyHealthCheckController;
use App\Http\Controllers\Api\V1\Auth\CustomerRequestCodeController;
use App\Http\Controllers\Api\V1\Auth\CustomerVerifyCodeController;
use App\Http\Controllers\Api\V1\Auth\CurrentCustomerController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;
use App\Http\Controllers\Api\V1\Customer\CustomerAddressController;
use Illuminate\Support\Facades\Route;

Route::get('/health/live', LiveHealthCheckController::class)->name('health.live');
Route::get('/health/ready', ReadyHealthCheckController::class)->name('health.ready');
Route::post('auth/customer/request-code', CustomerRequestCodeController::class)->name('auth.customer.request-code');
Route::post('auth/customer/verify-code', CustomerVerifyCodeController::class)->name('auth.customer.verify-code');
Route::get('/auth/me', CurrentCustomerController::class)->middleware('auth:sanctum')->name('auth.me');
Route::post('/auth/logout', LogoutController::class)->middleware('auth:sanctum')->name('auth.logout');
Route::middleware('auth:sanctum')->prefix('customer')->group(function (): void {
    Route::get('/addresses', [CustomerAddressController::class, 'index',],);
    Route::get('/addresses/{addressId}', [CustomerAddressController::class, 'show',],)->whereNumber('addressId');
    Route::post('/addresses', [CustomerAddressController::class, 'store',],);
    Route::delete('/addresses/{addressId}', [CustomerAddressController::class, 'destroy',],)->whereNumber('addressId');
    Route::put('/addresses/{addressId}', [CustomerAddressController::class, 'update',],)->whereNumber('addressId');
});
