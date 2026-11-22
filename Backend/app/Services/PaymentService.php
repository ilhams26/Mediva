<?php

namespace App\Services;

use App\Models\Order;
use App\Services\OrderService;
use Exception;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Transaction;

/**
 * PaymentService — Payment gateway Midtrans (Fase 6).
 *
 * - initiate(): generate Snap token + redirect URL untuk order.
 * - verifySignature(): verifikasi signature webhook
 *   SHA512(order_id + status_code + gross_amount + serverKey) === signature_key.
 * - handleNotification(): verifikasi -> cek status via Midtrans API -> konfirmasi bayar.
 */
class PaymentService
{
    public function __construct(private OrderService $orderService)
    {
    }

    /**
     * Buat transaksi Snap untuk order (jika belum dibayar).
     *
     * @return array{snap_token: string, redirect_url: string, transaction_id: string|null, status: string}
     */
    public function initiate(Order $order): array
    {
        if ($order->payment_status === 'paid') {
            return [
                'snap_token' => (string) ($order->snap_token ?? ''),
                'redirect_url' => '',
                'transaction_id' => $order->midtrans_transaction_id,
                'status' => 'paid',
            ];
        }

        $response = $this->createSnapToken($order);

        $order->snap_token = $response->token;
        $order->midtrans_transaction_id = $response->transaction_id;
        $order->save();

        return [
            'snap_token' => (string) $response->token,
            'redirect_url' => (string) ($response->redirect_url ?? ''),
            'transaction_id' => $response->transaction_id,
            'status' => 'pending',
        ];
    }

    /**
     * Generate Midtrans Snap token untuk order.
     */
    private function createSnapToken(Order $order)
    {
        Config::$serverKey = (string) config('midtrans.server_key');
        Config::$clientKey = (string) config('midtrans.client_key');
        Config::$isProduction = (bool) config('midtrans.is_production', false);
        Config::$appendNotifUrl = (string) config('midtrans.notification_url');
        Config::$overrideNotifUrl = (string) config('midtrans.notification_url');

        $grossAmount = (int) round((float) $order->total_harga);

        $transactionData = [
            'transaction_details' => [
                'order_id' => (string) $order->order_code,
                'gross_amount' => $grossAmount,
            ],
            'payment_type' => 'credit_card',
            'customer_name' => (string) ($order->user?->username ?? 'Pelanggan Mediva'),
            'customer_email' => '',
            'customer_phone' => (string) ($order->user?->no_hp ?? ''),
        ];

        $response = Snap::createTransaction($transactionData);

        if (empty($response->token)) {
            throw new Exception('Gagal membuat token Snap Midtrans.');
        }

        return $response;
    }

    /**
     * Verifikasi signature webhook Midtrans.
     *
     * SHA512(order_id + status_code + gross_amount + serverKey) === signature_key
     */
    public function verifySignature(array $notification): bool
    {
        $serverKey = (string) config('midtrans.server_key');

        if ($serverKey === '') {
            return false;
        }

        $orderId = (string) ($notification['order_id'] ?? '');
        $statusCode = (string) ($notification['status_code'] ?? '');
        $grossAmount = isset($notification['gross_amount'])
            ? sprintf('%.2f', (float) $notification['gross_amount'])
            : '0.00';
        $signatureKey = (string) ($notification['signature_key'] ?? '');

        if ($signatureKey === '') {
            return false;
        }

        $expected = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        return hash_equals($expected, $signatureKey);
    }

    /**
     * Proses notifikasi Midtrans:
     * verifikasi signature -> cek status transaksi -> konfirmasi pembayaran order.
     *
     * @param array $notification
     * @return array{status: string, message?: string}
     */
    public function handleNotification(array $notification): array
    {
        if (! $this->verifySignature($notification)) {
            return ['status' => 'invalid_signature'];
        }

        $transactionId = (string) ($notification['transaction_id'] ?? '');
        if ($transactionId === '') {
            return ['status' => 'invalid_payload'];
        }

        try {
            $transactionResponse = Transaction::status($transactionId);
        } catch (Exception) {
            // Gagal memanggil Midtrans -> jangan update order
            return ['status' => 'pending'];
        }

        if ((int) ($transactionResponse->status_code ?? 0) !== 200) {
            return ['status' => 'pending'];
        }

        $fraudStatus = strtolower(trim((string) ($transactionResponse->fraud_status ?? '')));
        if ($fraudStatus !== '' && $fraudStatus !== 'accept') {
            return ['status' => 'fraud_rejected'];
        }

        $transactionStatus = strtolower(trim((string) ($transactionResponse->transaction_status ?? '')));
        if (! in_array($transactionStatus, ['settlement', 'capture', 'paid'], true)) {
            return ['status' => 'pending'];
        }

        $order = Order::where('midtrans_transaction_id', $transactionId)->first()
            ?? Order::where('order_code', (string) ($notification['merchant_order_id'] ?? $transactionId))->first();

        if (! $order) {
            return ['status' => 'order_not_found'];
        }

        if ($order->payment_status !== 'paid') {
            $order->midtrans_transaction_id = $transactionId;
            $order->save();

            $this->orderService->confirmPayment($order);
        }

        return ['status' => 'paid'];
    }
}
