<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ResepController;
use App\Http\Controllers\UserController;
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

    // Order Management endpoints
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index'])
            ->name('orders.index');
        
        Route::post('/', [OrderController::class, 'store'])
            ->name('orders.store');
        
        Route::get('/{id}', [OrderController::class, 'show'])
            ->name('orders.show');
        
        Route::patch('/{id}/status', [OrderController::class, 'updateStatus'])
            ->name('orders.updateStatus')
            ->middleware('role:admin');
        
        Route::post('/{id}/cancel', [OrderController::class, 'cancel'])
            ->name('orders.cancel');
    });

    // Resep Management endpoints
    Route::prefix('resep')->group(function () {
        Route::get('/', [ResepController::class, 'index'])
            ->name('resep.index');
        
        Route::post('/', [ResepController::class, 'store'])
            ->name('resep.store');
        
        Route::get('/{id}', [ResepController::class, 'show'])
            ->name('resep.show');
        
        Route::post('/{id}/validate', [ResepController::class, 'validate'])
            ->name('resep.validate')
            ->middleware('role:admin');
    });

    // ── User Management (hanya admin) ──────────────────────────────────────────
    Route::middleware('role:admin')->group(function () {
        Route::get('/users',                [UserController::class, 'index']);
        Route::post('/users',               [UserController::class, 'store']);
        Route::get('/users/{id}',           [UserController::class, 'show']);
        Route::put('/users/{id}',           [UserController::class, 'update']);
        Route::delete('/users/{id}',        [UserController::class, 'destroy']);
        Route::patch('/users/{id}/status',  [UserController::class, 'toggleStatus']);
    });

});
