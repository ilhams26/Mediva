<?php

namespace App\Http\Controllers;

use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Requests\VerifyOtpRequest;
use App\Models\User;
use App\Services\OTPService;
use Illuminate\Support\Facades\Hash;

class ForgotPasswordController extends Controller
{
    public function __construct(private OTPService $otpService) {}

    public function sendOtp(ForgotPasswordRequest $request)
    {
        $user = User::where('username', $request->identifier)
            ->orWhere('no_hp', $request->identifier)
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        $otp = $this->otpService->generateOTP($user);
        $this->otpService->sendOTP($user, $otp);

        return response()->json([
            'success' => true,
            'message' => 'Kode OTP telah dikirim',
            'data' => [
                'expires_at' => $user->otp_expired_at->format('Y-m-d H:i:s')
            ]
        ]);
    }

    public function verifyOtp(VerifyOtpRequest $request)
    {
        $user = User::where('username', $request->identifier)
            ->orWhere('no_hp', $request->identifier)
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        if (!$this->otpService->verifyOTP($user, $request->otp)) {
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP tidak valid atau sudah kedaluwarsa'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Kode OTP berhasil diverifikasi'
        ]);
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $user = User::where('username', $request->identifier)
            ->orWhere('no_hp', $request->identifier)
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        if (!$this->otpService->isOTPVerified($user)) {
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP belum diverifikasi atau sudah kedaluwarsa'
            ], 403);
        }

        $user->update(['password' => Hash::make($request->password)]);
        $this->otpService->clearOTP($user);
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil direset. Silakan login dengan password baru'
        ]);
    }
}
