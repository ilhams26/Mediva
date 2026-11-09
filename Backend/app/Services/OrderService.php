<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Obat;
use App\Models\Batch;
use App\Models\PergerakanStok;
use App\Models\Resep;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * OrderService - Business logic untuk order management
 * 
 * Responsibilities:
 * - Create order dengan validation stok dan resep
 * - FEFO (First Expired First Out) logic untuk stock deduction
 * - Order status management
 * - Order cancellation dengan stock refund
 */
class OrderService
{
    /**
     * @param int $userId
     * @param array $items 
     * @param array $orderData 
     * @return Order
     * @throws ValidationException
     */
    public function createOrder(int $userId, array $items, array $orderData = []): Order
    {
        // Step 1: Validate dan ambil data obat
        $obatsData = $this->validateAndGetObats($items);
        
        // Step 2: Check obat keras (butuh resep)
        $this->validatePrescription($userId, $obatsData, $orderData['resep_id'] ?? null);
        
        // Step 3: Calculate total
        $totalHarga = $this->calculateTotal($obatsData, $items);
        
        // Step 4: Create order dalam transaction
        return DB::transaction(function () use ($userId, $items, $orderData, $obatsData, $totalHarga) {
            // Generate order code (format: ORD-20261103-001)
            $orderCode = $this->generateOrderCode();
            
            $order = Order::create([
                'user_id' => $userId,
                'order_code' => $orderCode,
                'total_harga' => $totalHarga,
                'metode_pembayaran' => $orderData['metode_pembayaran'] ?? 'cash',
                'status' => 'pending', // Pending payment
                'payment_status' => 'unpaid',
                'resep_id' => $orderData['resep_id'] ?? null,
            ]);
            
            foreach ($items as $item) {
                $obat = $obatsData[$item['obat_id']];
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'obat_id' => $obat->id,
                    'qty' => $item['qty'],
                    'harga' => $obat->harga,
                    'subtotal' => $obat->harga * $item['qty'],
                ]);
                
                $this->deductStock($obat->id, $item['qty'], $order->id, $userId);
            }
            
            return $order->fresh(['items.obat', 'user', 'resep']);
        });
    }
    
    /**
     * Validate items dan ambil data obat
     * 
     * @param array $items
     * @return array - Keyed by obat_id
     * @throws ValidationException
     */
    private function validateAndGetObats(array $items): array
    {
        if (empty($items)) {
            throw ValidationException::withMessages([
                'items' => ['Order harus memiliki minimal 1 item.'],
            ]);
        }
        
        $obatIds = array_column($items, 'obat_id');
        $obats = Obat::whereIn('id', $obatIds)
                    ->where('is_active', true)
                    ->get()
                    ->keyBy('id');
        
        // Validate setiap item
        $result = [];
        foreach ($items as $item) {
            $obatId = $item['obat_id'];
            $qty = $item['qty'];
            
            if (!$obats->has($obatId)) {
                throw ValidationException::withMessages([
                    "items.{$obatId}" => ["Obat dengan ID {$obatId} tidak ditemukan atau tidak aktif."],
                ]);
            }
            
            $obat = $obats->get($obatId);
            $totalStok = $this->getTotalAvailableStock($obatId);
            if ($totalStok < $qty) {
                throw ValidationException::withMessages([
                    "items.{$obatId}" => ["Stok {$obat->nama} tidak mencukupi. Tersedia: {$totalStok}, diminta: {$qty}."],
                ]);
            }
            
            $result[$obatId] = $obat;
        }
        
        return $result;
    }
    
    /**
     * Get total stok tersedia (dari batch yang belum expired)
     * 
     * @param int $obatId
     * @return int
     */
    private function getTotalAvailableStock(int $obatId): int
    {
        return Batch::where('obat_id', $obatId)
                   ->where('expired_date', '>', now())
                   ->sum('jumlah_sisa');
    }
    
    /**
     * Validate resep untuk obat keras
     */
    private function validatePrescription(int $userId, array $obatsData, $resepId): void
    {
        $hasObatKeras = collect($obatsData)->contains('jenis', 'keras');
        
        if (!$hasObatKeras) {
            return;
        }
        
        if (!$resepId) {
            throw ValidationException::withMessages([
                'resep_id' => ['Order mengandung obat keras. Resep wajib diupload dan divalidasi.'],
            ]);
        }
        
        $resep = Resep::where('id', $resepId)
                     ->where('user_id', $userId)
                     ->first();
        
        if (!$resep) {
            throw ValidationException::withMessages([
                'resep_id' => ['Resep tidak ditemukan atau bukan milik Anda.'],
            ]);
        }
        
        if ($resep->status !== 'disetujui') {
            throw ValidationException::withMessages([
                'resep_id' => ['Resep belum divalidasi oleh staf. Status: ' . $resep->status],
            ]);
        }
    }
    
    /**
     * Calculate total harga order
     * 
     * @param array $obatsData
     * @param array $items
     * @return float
     */
    private function calculateTotal(array $obatsData, array $items): float
    {
        $total = 0;
        foreach ($items as $item) {
            $obat = $obatsData[$item['obat_id']];
            $total += $obat->harga * $item['qty'];
        }
        return $total;
    }
    
    /**
     * Generate unique order code (Format: ORD-YYYYMMDD-XXX)
     */
    private function generateOrderCode(): string
    {
        $date = now()->format('Ymd');
        $prefix = "ORD-{$date}-";
        
        $lastOrder = Order::where('order_code', 'LIKE', "{$prefix}%")
                        ->orderBy('id', 'desc')
                        ->first();
        
        if (!$lastOrder) {
            $sequence = 1;
        } else {
            $lastCode = $lastOrder->order_code;
            $lastSequence = (int) substr($lastCode, -3);
            $sequence = $lastSequence + 1;
        }
        
        return $prefix . str_pad($sequence, 3, '0', STR_PAD_LEFT);
    }
    
    /**
     * Deduct stock dengan FEFO (First Expired First Out)
     * Batch expired date terdekat dipakai dulu
     */
    private function deductStock(int $obatId, int $qty, int $orderId, int $userId): void
    {
        $remaining = $qty;
        
        $batches = Batch::where('obat_id', $obatId)
                       ->where('expired_date', '>', now())
                       ->where('jumlah_sisa', '>', 0)
                       ->orderBy('expired_date', 'asc')
                       ->lockForUpdate()
                       ->get();
        
        foreach ($batches as $batch) {
            if ($remaining <= 0) {
                break;
            }
            
            $deduct = min($remaining, $batch->jumlah_sisa);
            
            $batch->jumlah_sisa -= $deduct;
            $batch->save();
            
            PergerakanStok::create([
                'obat_id' => $obatId,
                'batch_id' => $batch->id,
                'tipe' => 'keluar',
                'jumlah' => $deduct,
                'sumber' => 'order',
                'referensi_id' => $orderId,
                'keterangan' => "Penjualan order #{$orderId}",
                'created_by' => $userId,
            ]);
            
            $remaining -= $deduct;
        }
        
        if ($remaining > 0) {
            throw new \Exception("Stok tidak mencukupi untuk obat ID {$obatId}. Kurang: {$remaining}");
        }
    }
    
    /**
     * Get all orders dengan filter
     * 
     * @param int|null $userId - Untuk pembeli, filter by user_id
     * @param string|null $status - Filter by status
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAllOrders($userId = null, $status = null, int $perPage = 15)
    {
        $query = Order::with(['user', 'items.obat', 'resep']);
        
        if ($userId) {
            $query->where('user_id', $userId);
        }
        
        if ($status) {
            $query->where('status', $status);
        }
        
        return $query->orderBy('created_at', 'desc')
                    ->paginate($perPage);
    }
    
    /**
     * Get order by ID dengan authorization check
     */
    public function getOrderById(int $orderId, $userId = null): Order
    {
        $order = Order::with(['user', 'items.obat', 'resep'])
                     ->findOrFail($orderId);
        
        if ($userId && $order->user_id !== $userId) {
            throw ValidationException::withMessages([
                'order_id' => ['Anda tidak memiliki akses ke order ini.'],
            ]);
        }
        
        return $order;
    }
    
    /**
     * Update status order dengan validation transition
     */
    public function updateOrderStatus(int $orderId, string $newStatus, int $updatedBy): Order
    {
        $order = Order::findOrFail($orderId);
        
        $this->validateStatusTransition($order->status, $newStatus);
        
        $order->status = $newStatus;
        
        if ($newStatus === 'selesai') {
            $order->completed_at = now();
        }
        
        $order->save();
        
        return $order->fresh(['user', 'items.obat', 'resep']);
    }
    
    /**
     * Validate status transition
     * 
     * @param string $currentStatus
     * @param string $newStatus
     * @throws ValidationException
     */
    private function validateStatusTransition(string $currentStatus, string $newStatus): void
    {
        $validTransitions = [
            'pending' => ['diproses', 'dibatalkan'],
            'diproses' => ['siap_diambil', 'dibatalkan'],
            'siap_diambil' => ['selesai', 'dibatalkan'],
            'selesai' => [], // Final state
            'dibatalkan' => [], // Final state
        ];
        
        if (!in_array($newStatus, $validTransitions[$currentStatus] ?? [])) {
            throw ValidationException::withMessages([
                'status' => ["Tidak bisa mengubah status dari '{$currentStatus}' ke '{$newStatus}'."],
            ]);
        }
    }
    
    /**
     * Cancel order dengan stock refund
     */
    public function cancelOrder(int $orderId, int $cancelledBy): Order
    {
        return DB::transaction(function () use ($orderId, $cancelledBy) {
            $order = Order::with('items')->lockForUpdate()->findOrFail($orderId);
            
            if (!in_array($order->status, ['pending', 'diproses'])) {
                throw ValidationException::withMessages([
                    'status' => ['Order dengan status ' . $order->status . ' tidak bisa dibatalkan.'],
                ]);
            }
            
            foreach ($order->items as $item) {
                $this->refundStock($item->obat_id, $item->qty, $orderId, $cancelledBy);
            }
            
            $order->status = 'dibatalkan';
            $order->save();
            
            return $order->fresh(['user', 'items.obat', 'resep']);
        });
    }
    
    /**
     * Refund stock ke batch sesuai pergerakan_stok
     */
    private function refundStock(int $obatId, int $qty, int $orderId, int $userId): void
    {
        $movements = PergerakanStok::where('obat_id', $obatId)
                                  ->where('referensi_id', $orderId)
                                  ->where('tipe', 'keluar')
                                  ->get();
        
        foreach ($movements as $movement) {
            $batch = Batch::find($movement->batch_id);
            if ($batch) {
                $batch->jumlah_sisa += $movement->jumlah;
                $batch->save();
            }
            
            PergerakanStok::create([
                'obat_id' => $obatId,
                'batch_id' => $movement->batch_id,
                'tipe' => 'masuk',
                'jumlah' => $movement->jumlah,
                'sumber' => 'refund',
                'referensi_id' => $orderId,
                'keterangan' => "Refund pembatalan order #{$orderId}",
                'created_by' => $userId,
            ]);
        }
    }
}
