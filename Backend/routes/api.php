<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\ObatController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ResepController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// PUBLIC ENDPOINTS

Route::get('/health', [HealthController::class, 'check'])->name('health');

// Authentication
Route::post('/register', [AuthController::class, 'register'])
    ->name('register')
    ->middleware('throttle:7,1');

Route::post('/login', [AuthController::class, 'login'])
    ->name('login')
    ->middleware('throttle:5,1');

// OTP & Forgot Password
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendOtp'])
    ->name('forgot-password')
    ->middleware('throttle:3,10');

Route::post('/verify-otp', [ForgotPasswordController::class, 'verifyOtp'])
    ->name('verify-otp')
    ->middleware('throttle:5,10');

Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword'])
    ->name('reset-password')
    ->middleware('throttle:3,10');

// PROTECTED ENDPOINTS

Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/change-password', [AuthController::class, 'changePassword'])->name('change-password');
    Route::get('/user', fn(Request $request) => $request->user())->name('user');

    // Admin only
    Route::middleware('role:admin')->group(function () {
        Route::get('/obat/count', [ObatController::class, 'count'])->name('obat.count');
        
        // User Management
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index']);
            Route::post('/', [UserController::class, 'store']);
            Route::get('/{id}', [UserController::class, 'show']);
            Route::put('/{id}', [UserController::class, 'update']);
            Route::delete('/{id}', [UserController::class, 'destroy']);
            Route::patch('/{id}/status', [UserController::class, 'toggleStatus']);
        });
    });

    // Orders
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index'])->name('orders.index');
        Route::post('/', [OrderController::class, 'store'])->name('orders.store');
        Route::get('/{id}', [OrderController::class, 'show'])->name('orders.show');
        Route::patch('/{id}/status', [OrderController::class, 'updateStatus'])
            ->name('orders.updateStatus')
            ->middleware('role:admin');
        Route::post('/{id}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    });

    // Resep
    Route::prefix('resep')->group(function () {
        Route::get('/', [ResepController::class, 'index'])->name('resep.index');
        Route::post('/', [ResepController::class, 'store'])->name('resep.store');
        Route::get('/{id}', [ResepController::class, 'show'])->name('resep.show');
        Route::post('/{id}/validate', [ResepController::class, 'validate'])
            ->name('resep.validate')
            ->middleware('role:admin');
    });
});
