<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class OTPService
{
    private const OTP_LENGTH = 6;
    private const OTP_EXPIRY_MINUTES = 10;

    public function generateOTP(User $user): string
    {
        $otp = str_pad((string) random_int(100000, 999999), self::OTP_LENGTH, '0', STR_PAD_LEFT);
        
        $user->update([
            'otp' => Hash::make($otp),
            'otp_expired_at' => now()->addMinutes(self::OTP_EXPIRY_MINUTES),
            'otp_verified_at' => null,
        ]);

        return $otp;
    }

    public function sendOTP(User $user, string $otp): void
    {
        Log::info('OTP sent', [
            'user_id' => $user->id,
            'username' => $user->username,
            'no_hp' => $user->no_hp,
            'otp' => $otp,
            'expires_at' => $user->otp_expired_at,
        ]);
    }

    public function verifyOTP(User $user, string $otp): bool
    {
        if (!$user->otp || $this->isOTPExpired($user)) {
            return false;
        }

        if (Hash::check($otp, $user->otp)) {
            $user->update(['otp_verified_at' => now()]);
            return true;
        }

        return false;
    }

    public function clearOTP(User $user): void
    {
        $user->update([
            'otp' => null,
            'otp_expired_at' => null,
            'otp_verified_at' => null,
        ]);
    }

    public function isOTPExpired(User $user): bool
    {
        return !$user->otp_expired_at || $user->otp_expired_at->isPast();
    }

    public function isOTPVerified(User $user): bool
    {
        return $user->otp_verified_at !== null && !$this->isOTPExpired($user);
    }
}
