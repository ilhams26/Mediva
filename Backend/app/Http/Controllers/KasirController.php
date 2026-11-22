<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Services\OrderService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * KasirController — POS Kasir (Fase 5).
 *
 * Menyimpan transaksi offline POS: order source 'pos', user_id NULL,
 * created_by = staf, status awal 'selesai', payment_status 'paid' (cash).
 * Stock deduction via reservation FEFO + confirm (StockReservationService).
 */
class KasirController extends Controller
{
    use ApiResponse;

    public function __construct(private OrderService $orderService)
    {
    }

    public function store(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'staf') {
            return $this->error('Akses ditolak. Hanya role staf yang dapat melakukan transaksi POS.', 403);
        }

        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.obat_id' => ['required', 'integer', 'exists:obats,id'],
            'items.*.qty' => ['required', 'integer', 'min:1'],
            'metode_pembayaran' => ['required', 'in:cash'],
        ]);

        $data = [
            'user_id' => null,
            'created_by' => $request->user()->id,
            'order_source' => 'pos',
            'items' => $validated['items'],
            'metode_pembayaran' => $validated['metode_pembayaran'],
            'resep_id' => $request->input('resep_id'),
        ];

        try {
            $order = $this->orderService->createOrder($data);
        } catch (\RuntimeException $e) {
            // Out of stock saat reservation
            return $this->error('Stok tidak mencukupi untuk sebagian obat pesanan.', 422);
        }

        return $this->created(new OrderResource($order), 'Transaksi POS berhasil disimpan.');
    }
}
