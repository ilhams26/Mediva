<?php

namespace App\Http\Controllers;

use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\VerifyOtpRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\User;
use App\Services\AuthService;
use App\Services\OTPService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly OTPService $otpService,
        private readonly AuthService $authService
    ) {}

    public function requestOtp(
        ForgotPasswordRequest $request
    ): JsonResponse {
        $user = User::where('no_hp', $request->validated('no_hp'))
            ->where('is_active', true)
            ->first();

        if (! $user) {
            return $this->error(
                'Akun tidak dapat menggunakan pemulihan kata sandi.',
                422
            );
        }

        $cooldownKey = 'otp_cooldown:' . hash(
            'sha256',
            $user->no_hp
        );

        if (! Cache::add(
            $cooldownKey,
            true,
            now()->addMinute()
        )) {
            return $this->error(
                'Permintaan OTP baru dapat dilakukan setelah 1 menit.',
                429
            );
        }

        $otp = $this->otpService->generate();

        $this->otpService->sendOTP($user, $otp);

        return $this->success(
            null,
            'Permintaan OTP berhasil diproses. Kode berlaku selama 5 menit.'
        );
    }

    public function verifyOtp(
        VerifyOtpRequest $request
    ): JsonResponse {
        $user = User::where('no_hp', $request->validated('no_hp'))
            ->where('is_active', true)
            ->first();

        if (! $user || ! $this->otpService->verify(
            $user,
            $request->validated('otp')
        )) {
            return $this->error(
                'Kode OTP tidak valid atau sudah kedaluwarsa.',
                422
            );
        }

        $this->otpService->clear($user);

        $resetToken = Str::random(64);

        Cache::put(
            'password_reset:' . hash('sha256', $resetToken),
            $user->id,
            now()->addMinutes(15)
        );

        return $this->success(
            ['reset_token' => $resetToken],
            'OTP berhasil diverifikasi. Silakan buat kata sandi baru.'
        );
    }

    public function resetPassword(
        ResetPasswordRequest $request
    ): JsonResponse {
        $tokenKey = 'password_reset:' . hash(
            'sha256',
            $request->validated('reset_token')
        );

        $userId = Cache::pull($tokenKey);

        if (! $userId) {
            return $this->error(
                'Token reset tidak valid atau sudah kedaluwarsa.',
                422
            );
        }

        $user = User::whereKey($userId)
            ->where('is_active', true)
            ->first();

        if (! $user) {
            return $this->error(
                'Akun tidak ditemukan atau tidak aktif.',
                422
            );
        }

        $this->authService->resetPassword(
            $user,
            $request->validated('password')
        );

        return $this->success(
            null,
            'Kata sandi berhasil diubah. Silakan login kembali.'
        );
    }
}