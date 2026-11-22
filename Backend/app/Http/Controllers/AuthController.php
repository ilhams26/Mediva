<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\VerifyOtpRegisterRequest;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(private AuthService $authService) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->registerUser($request->validated());
        
        $message = config('services.fonnte.enabled')
            ? 'Pendaftaran berhasil. Kode OTP telah dikirim ke WhatsApp Anda'
            : 'Pendaftaran berhasil. Kode OTP: ' . $result['otp'];

        return $this->success($result, $message, 201);
    }

    public function verifyOtpRegister(VerifyOtpRegisterRequest $request): JsonResponse
    {
        $result = $this->authService->verifyOtpAndActivate(
            $request->no_hp,
            $request->otp
        );

        return $this->success($result, 'Akun berhasil diverifikasi. Selamat datang di Mediva!');
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->loginUser($request->validated());
        return $this->success($result, 'Login berhasil');
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return $this->success(null, 'Logout berhasil');
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $this->authService->changePassword(
            $request->user(),
            $request->current_password,
            $request->password
        );

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diubah. Silakan login kembali',
        ], 200);
    }
}
