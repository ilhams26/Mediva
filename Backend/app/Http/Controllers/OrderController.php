<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * List orders (pembeli: hanya milik sendiri, staf/admin: semua)
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $userId = $user->role === 'pembeli' ? $user->id : null;
        $status = $request->query('status');
        
        $orders = $this->orderService->getAllOrders($userId, $status);
        
        return $this->success(
            OrderResource::collection($orders),
            'Daftar order berhasil diambil.'
        );
    }

    /**
     * Create order baru
     */
    public function store(CreateOrderRequest $request): JsonResponse
    {
        $user = $request->user();
        
        $order = $this->orderService->createOrder(
            $user->id,
            $request->input('items'),
            $request->only(['metode_pembayaran', 'resep_id'])
        );
        
        return $this->created(
            new OrderResource($order),
            'Order berhasil dibuat.'
        );
    }

    /**
     * Show order detail
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $userId = $user->role === 'pembeli' ? $user->id : null;
        
        $order = $this->orderService->getOrderById($id, $userId);
        
        return $this->success(
            new OrderResource($order),
            'Detail order berhasil diambil.'
        );
    }

    /**
     * Update order status (staf/admin only)
     */
    public function updateStatus(UpdateOrderStatusRequest $request, int $id): JsonResponse
    {
        $order = $this->orderService->updateOrderStatus(
            $id,
            $request->input('status'),
            $request->user()->id
        );
        
        return $this->success(
            new OrderResource($order),
            'Status order berhasil diupdate.'
        );
    }

    /**
     * Cancel order
     */
    public function cancel(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        
        $order = $this->orderService->getOrderById($id, $user->role === 'pembeli' ? $user->id : null);
        
        $order = $this->orderService->cancelOrder($id, $user->id);
        
        return $this->success(
            new OrderResource($order),
            'Order berhasil dibatalkan.'
        );
    }
}
