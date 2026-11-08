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
Route::get('/health', [HealthController::class, 'check']);

// Authentication
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:7,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// ============================================
// PROTECTED ENDPOINTS (Perlu Bearer Token)
// ============================================

Route::get('/obat/count', [ObatController::class, 'count']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/obat/count', [ObatController::class, 'count'])->middleware('role:admin');

});
