<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HealthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ObatController;

// ============================================
// PUBLIC ENDPOINTS (Tidak perlu authentication)
// ============================================

// Health Check - untuk monitoring server dan database
Route::get('/health', [HealthController::class, 'check'])
    ->name('health');

// Authentication
Route::post('/register', [AuthController::class, 'register'])
    ->name('register')
    ->middleware('throttle:7,1');

Route::post('/login', [AuthController::class, 'login'])
    ->name('login')
    ->middleware('throttle:5,1');

// ============================================
// PROTECTED ENDPOINTS (Perlu Bearer Token)
// ============================================

Route::middleware('auth:sanctum')->group(function () {
    
    // User endpoints
    Route::post('/logout', [AuthController::class, 'logout'])
        ->name('logout');
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->name('user');

    // Admin only endpoints
    Route::middleware('role:admin')->group(function () {
        Route::get('/obat/count', [ObatController::class, 'count'])
            ->name('obat.count');
    });

});
