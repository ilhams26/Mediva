<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\PaymentService;
use App\Traits\ApiResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    use ApiResponse;

    public function __construct(private PaymentService $paymentService)
    {
    }

    /**
     * POST /api/orders/{id}/pay — Buat token Midtrans Snap untuk order.
     * Role: pembeli (miliknya) atau staf/admin (kasir/ambil pesanan).
     */
    public function initiate(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        try {
            $order = Order::with(['user', 'items.obat', 'resep', 'reservation'])->findOrFail($id);
        } catch (ModelNotFoundException) {
            return $this->notFound('Order tidak ditemukan.');
        }

        $isOwner = $user->role === 'pembeli' && (int) $order->user_id === (int) $user->id;
        $isStaff = in_array($user->role, ['staf', 'admin'], true);

        if (! $isOwner && ! $isStaff) {
            return $this->forbidden('Akses ditolak. Anda tidak memiliki izin untuk membayar order ini.');
        }

        try {
            $result = $this->paymentService->initiate($order);
        } catch (\Exception) {
            return $this->error('Gagal membuat token pembayaran Midtrans. Silakan coba lagi.', 422);
        }

        return $this->success($result, 'Token pembayaran Midtrans berhasil dibuat.');
    }

    /**
     * POST /api/payment/midtrans/callback — Midtrans webhook notification.
     * Verifikasi signature -> proses notifikasi -> konfirmasi pembayaran order.
     */
    public function callback(Request $request): JsonResponse
    {
        $notification = $request->all();

        $result = $this->paymentService->handleNotification($notification);

        if ($result['status'] === 'invalid_signature') {
            return response()->json(['status' => 'failed'], 403);
        }

        // Selalu balas cepat (2xx) agar Midtrans tidak retry terus
        return response()->json(['status' => 'success'], 200);
    }
}
