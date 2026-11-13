<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class OtpService
{
    public function generate(): string
    {
        return str_pad(
            (string) random_int(0, 999999),
            6,
            '0',
            STR_PAD_LEFT
        );
    }

    public function sendOTP(User $user, string $otp): void
    {
        $user->forceFill([
            'otp' => Hash::make($otp),
            'otp_verified_at' => null,
            'otp_expired_at' => now()->addMinutes(5),
        ])->save();

        if (! app()->environment('production')) {
            Log::info("Mediva OTP untuk {$user->no_hp}: {$otp}");
        }
    }

    public function verify(User $user, string $inputOtp): bool
    {
        if (empty($user->otp) || $this->isExpired($user)) {
            return false;
        }

        return Hash::check($inputOtp, $user->otp);
    }

    public function isExpired(User $user): bool
    {
        return ! $user->otp_expired_at
            || $user->otp_expired_at->isPast();
    }

    public function clear(User $user): void
    {
        $user->forceFill([
            'otp' => null,
            'otp_expired_at' => null,
            'otp_verified_at' => now(),
        ])->save();
    }
}