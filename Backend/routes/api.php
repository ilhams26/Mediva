<?php

use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HealthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Mediva Backend
|--------------------------------------------------------------------------
*/

// --- FASE 1: Health Check ---
Route::get('/health', [HealthController::class, 'check']);

// --- FASE 2: Public Authentication & Password Reset ---
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:api');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');

Route::prefix('forgot-password')->middleware('throttle:otp')->group(function () {
    Route::post('/send-otp', [AuthController::class, 'forgotPassword']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('/reset', [AuthController::class, 'resetPassword']);
});

// --- Authenticated User Routes (Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // --- FASE 2: Admin User Management ---
    Route::middleware('role:admin')->prefix('admin/users')->group(function () {
        Route::get('/', [AdminUserController::class, 'index']);
        Route::post('/', [AdminUserController::class, 'store']);
        Route::get('/{id}', [AdminUserController::class, 'show']);
        Route::put('/{id}', [AdminUserController::class, 'update']);
        Route::patch('/{id}/toggle-active', [AdminUserController::class, 'toggleActive']);
        Route::delete('/{id}', [AdminUserController::class, 'destroy']);
    });
});
