<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use App\Traits\ApiResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class OrdersController extends Controller
{
    use ApiResponse;

    public function __construct(private OrderService $orderService)
    {
    }

    /**
     * GET /api/orders — Daftar order.
     * Pembeli: hanya miliknya. Staf/Admin: semua (termasuk POS yang user_id NULL).
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $userId = $user->role === 'pembeli' ? $user->id : null;
        $status = $request->query('status');

        $orders = $this->orderService->getAllOrders($userId, $status);

        return $this->success(OrderResource::collection($orders), 'Daftar order berhasil diambil.');
    }

    /**
     * POST /api/orders — Buat order.
     *
     * Master Part 2 (kepentingan bisnis):
     *   Mobile Order: user_id wajib (ID pembeli), created_by NULL, order_source 'mobile'.
     *   Offline POS:  user_id NULL, created_by wajib (ID staf), order_source 'pos'.
     *
     * Master Part 3: Checkout -> reservation stok dengan FEFO (dengan status/timeline
     * sesuai metode pembayaran).
     */
    public function store(CreateOrderRequest $request): JsonResponse
    {
        $user = $request->user();
        $source = $request->input('order_source', 'mobile');

        if ($source === 'mobile') {
            if ($user->role !== 'pembeli') {
                throw ValidationException::withMessages([
                    'order_source' => ['Mobile order hanya dapat diakses oleh role pembeli.'],
                ]);
            }
            $data = [
                'user_id' => $user->id,
                'created_by' => null,
                'order_source' => 'mobile',
            ];
        } elseif ($source === 'pos') {
            if ($user->role !== 'staf') {
                throw ValidationException::withMessages([
                    'order_source' => ['POS hanya dapat diakses oleh role staf.'],
                ]);
            }
            $data = [
                'user_id' => null,
                'created_by' => $user->id,
                'order_source' => 'pos',
            ];
        } else {
            throw ValidationException::withMessages([
                'order_source' => ['Order source tidak valid (mobile|pos).'],
            ]);
        }

        $data += $request->validated();

        try {
            $order = $this->orderService->createOrder($data);
        } catch (\RuntimeException $e) {
            // Master Part 3 C: out of stock at reservation time -> validation response
            return $this->error('Stok tidak mencukupi untuk sebagian obat pesanan.', 422);
        }

        return $this->created(new OrderResource($order), 'Order berhasil dibuat.');
    }

    /**
     * GET /api/orders/{id} — Detail order.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $userId = $user->role === 'pembeli' ? $user->id : null;

        try {
            $order = $this->orderService->getOrderById($id, $userId);
        } catch (ModelNotFoundException) {
            return $this->notFound('Order tidak ditemukan.');
        } catch (ValidationException $e) {
            $errors = $e->errors();
            $message = $errors[array_key_first($errors)][0] ?? 'Akses ditolak.';
            return $this->error($message, 403);
        }

        return $this->success(new OrderResource($order), 'Detail order berhasil diambil.');
    }

    /**
     * PATCH /api/orders/{id}/status — Update status order.
     * Role: staf (PUT/PATCH, lihat routes/api.php).
     */
    public function updateStatus(UpdateOrderStatusRequest $request, int $id): JsonResponse
    {
        try {
            $order = $this->orderService->updateOrderStatus($id, $request->input('status'), $request->user()->id);
        } catch (ModelNotFoundException) {
            return $this->notFound('Order tidak ditemukan.');
        } catch (ValidationException $e) {
            $errors = $e->errors();
            $message = $errors[array_key_first($errors)][0] ?? 'Transisi status tidak valid.';
            return $this->error($message, 400);
        }

        return $this->success(new OrderResource($order), 'Status order berhasil diupdate.');
    }

    /**
     * POST /api/orders/{id}/confirm-payment — Konfirmasi pembayaran lunas.
     * Role: staf. Master Part 3 C: deduct fisik dari batch (reservation yang direservasi).
     */
    public function confirmPayment(Request $request, int $id): JsonResponse
    {
        if ($request->user()->role !== 'staf') {
            return $this->error('Akses ditolak. Hanya role staf yang dapat mengkonfirmasi pembayaran.', 403);
        }

        try {
            $order = Order::where('id', $id)->lockForUpdate()->firstOrFail();
        } catch (ModelNotFoundException) {
            return $this->notFound('Order tidak ditemukan.');
        }

        try {
            $order = $this->orderService->confirmPayment($order);
        } catch (ValidationException $e) {
            $errors = $e->errors();
            $message = $errors[array_key_first($errors)][0] ?? 'Status pesanan atau reservasi tidak valid.';
            return $this->error($message, 400);
        }

        return $this->success(new OrderResource($order), 'Pembayaran telah dikonfirmasi dan stok dikurangi.');
    }

    /**
     * DELETE /api/orders/{id}/cancel — Batalkan order.
     * Master Part 3 C: release reservation (fisik tidak dikeluarkan sebelum confirm).
     */
    public function cancel(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $userId = $user->role === 'pembeli' ? $user->id : null;

        try {
            $order = $this->orderService->getOrderById($id, $userId);
        } catch (ModelNotFoundException) {
            return $this->notFound('Order tidak ditemukan.');
        } catch (ValidationException) {
            return $this->forbidden('Anda tidak dapat membatalkan order orang lain.');
        }

        try {
            $order = $this->orderService->cancelOrder($order);
        } catch (ValidationException $e) {
            $errors = $e->errors();
            $message = $errors[array_key_first($errors)][0] ?? 'Order tidak dapat dibatalkan.';
            return $this->error($message, 400);
        }

        return $this->success(new OrderResource($order), 'Order berhasil dibatalkan.');
    }
}
