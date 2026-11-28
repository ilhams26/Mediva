<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\KasirController;
use App\Http\Controllers\ObatController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ResepController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// PUBLIC ENDPOINTS

Route::get('/health', [HealthController::class, 'check'])->name('health');

// Product Catalog — Katalog publik (akses tanpa auth khusus; untuk pembeli & staf/admin)
Route::get('/katalog/kategoris', [KategoriController::class, 'index'])->name('katalog.kategoris');
Route::get('/katalog/obats', [ObatController::class, 'catalogIndex'])->name('katalog.obats');
Route::get('/katalog/obats/{id}', [ObatController::class, 'catalogShow'])->name('katalog.obats.show');

// Authentication
Route::post('/register', [AuthController::class, 'register'])
    ->name('register')
    ->middleware('throttle:1,5');

Route::post('/verify-otp-register', [AuthController::class, 'verifyOtpRegister'])
    ->name('verify-otp-register')
    ->middleware('throttle:5,10');

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
    
    //Dashboard 
    Route::get('/dashboard/stats',[ObatController::class,'dashboardStats'])->name('dashboard.stats');

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
        Route::get('/', [OrdersController::class, 'index'])->name('orders.index');
        Route::post('/', [OrdersController::class, 'store'])->name('orders.store');
        Route::get('/{id}', [OrdersController::class, 'show'])->name('orders.show');
        Route::patch('/{id}/status', [OrdersController::class, 'updateStatus'])
            ->name('orders.updateStatus')
            ->middleware('role:staf');
        Route::post('/{id}/confirm-payment', [OrdersController::class, 'confirmPayment'])->name('orders.confirm-payment');
        Route::post('/{id}/pay', [PaymentController::class, 'initiate'])->name('orders.pay');
        Route::post('/{id}/cancel', [OrdersController::class, 'cancel'])->name('orders.cancel');
    });

    // Resep
    Route::prefix('resep')->group(function () {
        Route::get('/', [ResepController::class, 'index'])->name('resep.index');
        Route::post('/', [ResepController::class, 'store'])->name('resep.store');
        Route::get('/{id}', [ResepController::class, 'show'])->name('resep.show');
        Route::post('/{id}/validate', [ResepController::class, 'validate'])
            ->name('resep.validate')
            ->middleware('role:staf');
    });

    // Product Catalog — Management obat 
    Route::middleware(['auth:sanctum', 'role:staf,admin'])->prefix('obat')->group(function () {
        Route::get('/', [ObatController::class, 'index'])->name('obat.index');
        Route::get('/{id}', [ObatController::class, 'show'])->name('obat.show');
    });

    Route::middleware(['auth:sanctum', 'role:staf'])->prefix('obat')->group(function () {
        Route::post('/', [ObatController::class, 'store'])->name('obat.store');
        Route::put('/{id}', [ObatController::class, 'update'])->name('obat.update');
        Route::delete('/{id}', [ObatController::class, 'destroy'])->name('obat.destroy');
    });

    // Product Catalog — Management kategori (staf only)
    Route::middleware(['auth:sanctum', 'role:staf'])->prefix('kategoris')->group(function () {
        Route::post('/', [KategoriController::class, 'store'])->name('kategoris.store');
        Route::put('/{id}', [KategoriController::class, 'update'])->name('kategoris.update');
        Route::delete('/{id}', [KategoriController::class, 'destroy'])->name('kategoris.destroy');
    });

    // Stock & Batch Management (Fase 4)
    Route::middleware(['auth:sanctum', 'role:staf,admin'])->prefix('batches')->group(function () {
        Route::get('/', [BatchController::class, 'index'])->name('batches.index');
        Route::get('/{id}', [BatchController::class, 'show'])->name('batches.show');
        Route::post('/', [BatchController::class, 'store'])->name('batches.store');
        Route::put('/{id}/adjust', [BatchController::class, 'adjust'])->name('batches.adjust');
    });

    // POS Kasir (Fase 5)
    Route::middleware(['auth:sanctum', 'role:staf'])->post('/kasir/transaksi', [KasirController::class, 'store'])->name('kasir.transaksi');

    // Stock movement history (Fase 4)
    Route::middleware(['auth:sanctum', 'role:staf,admin'])->prefix('stock')->group(function () {
        Route::get('/movements', [StockMovementController::class, 'index'])->name('stock.movements');
    });
});

// PAYMENT WEBHOOK — Midtrans notification (signature-based, no auth user)
Route::post('/payment/midtrans/callback', [PaymentController::class, 'callback'])->name('payment.midtrans.callback');
