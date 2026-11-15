<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonteService
{
    private bool $enabled;
    private ?string $token;
    private string $baseUrl;

    public function __construct()
    {
        $this->enabled = config('services.fonnte.enabled', false);
        $this->token = config('services.fonnte.token');
        $this->baseUrl = config('services.fonnte.base_url', 'https://api.fonnte.com');
    }

    public function sendOTP(string $phone, string $otp, string $expiresAt): bool
    {
        $sanitizedPhone = $this->sanitizePhoneNumber($phone);
        $message = $this->buildMessage($otp, $expiresAt);

        // TESTING MODE: Log OTP to storage/logs/otp.log
        if (!$this->enabled) {
            Log::channel('otp')->info('OTP Registration', [
                'phone' => $sanitizedPhone,
                'otp' => $otp,
                'expires_at' => $expiresAt,
                'message' => $message,
            ]);
            return true;
        }

        // PRODUCTION MODE: Send via Fonnte API
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->token,
            ])->post("{$this->baseUrl}/send", [
                'target' => $sanitizedPhone,
                'message' => $message,
                'countryCode' => '62',
            ]);

            if ($response->successful()) {
                Log::info('Fonnte OTP sent', ['phone' => $sanitizedPhone]);
                return true;
            }

            Log::error('Fonnte API failed', [
                'phone' => $sanitizedPhone,
                'status' => $response->status(),
                'response' => $response->body(),
            ]);

            return false;
        } catch (\Exception $e) {
            Log::error('Fonnte exception', [
                'phone' => $sanitizedPhone,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    public function sanitizePhoneNumber(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (str_starts_with($phone, '08')) {
            return '628' . substr($phone, 2);
        }

        if (str_starts_with($phone, '8')) {
            return '628' . substr($phone, 1);
        }

        if (str_starts_with($phone, '62')) {
            return $phone;
        }

        return '628' . $phone;
    }

    private function buildMessage(string $otp, string $expiresAt): string
    {
        return "🏥 MEDIVA - Smart Medicine Platform\n\n" .
               "Kode verifikasi Anda: *{$otp}*\n\n" .
               "Berlaku 10 menit.\n\n" .
               "Jangan bagikan kode ini ke siapa pun.";
    }
}
