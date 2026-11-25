<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Obat;
use App\Models\Resep;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * OrderService — Business logic untuk order management (kepentingan Master:
 * Mobile Order & Offline POS).
 *
 * Responsibilities:
 * - CreateOrder: validasi stok, resep, buat order + items, reservation (Master Part 3)
 * - Status transitions (Part 2 C2: kanonis = diproses/siap_diambil/selesai/dibatalkan)
 * - confirmPayment (idempotent, Master Part 3 C)
 * - cancelOrder (release reservation, Master Part 3 C)
 */
class OrderService
{
    public function __construct(private StockReservationService $stockReservation)
    {
    }

    /**
     * Buat order baru.
     *
     * Master Part 2 (kepentingan):
     *   Mobile: user_id wajib, created_by NULL, status dimulai 'diproses'.
     *   POS:    user_id boleh NULL, created_by wajib, status dimulai 'selesai'.
     *
     * Master Part 3: checkout -> reservation stok (FEFO), physical dikurangi
     * saat confirmPayment (POS) atau pay-on-pickup (mobile).
     *
     * @param array $data ['user_id'=>?int, 'created_by'=>?int, 'order_source'=>'mobile'|'pos',
     *                     'items'=>array, 'metode_pembayaran'=>string, 'resep_id'=>?int]
     * @return Order
     * @throws ValidationException
     */
    public function createOrder(array $data): Order
    {
        $items = $data['items'];

        $obatsData = $this->validateAndGetObats($items);
        $this->validatePrescription($obatsData, $data['user_id'] ?? null, $data['resep_id'] ?? null);
        $totalHarga = $this->calculateTotal($obatsData, $items);

        $orderSource = $data['order_source'] ?? 'mobile';
        $isMobile = $orderSource === 'mobile';

        if ($isMobile && !($data['user_id'] ?? null)) {
            throw ValidationException::withMessages(['user_id' => ['Order mobile membutuhkan user_id (pembeli).']]);
        }
        if (!$isMobile && !($data['created_by'] ?? null)) {
            throw ValidationException::withMessages(['created_by' => ['Order POS membutuhkan created_by (staff).']]);
        }

        return DB::transaction(function () use ($data, $obatsData, $totalHarga, $isMobile): Order {
            $order = Order::create([
                'user_id' => $isMobile ? $data['user_id'] : null,
                'created_by' => $isMobile ? null : $data['created_by'],
                'order_source' => $isMobile ? 'mobile' : 'pos',
                'order_code' => $this->generateOrderCode(),
                'metode_pembayaran' => $data['metode_pembayaran'] ?? ($isMobile ? 'cash' : 'cash'),
                'total_harga' => $totalHarga,
                // Keadaan awal: mobile = diproses (payment unpaid); POS = selesai (payment paid)
                'status' => $isMobile ? 'diproses' : 'selesai',
                'payment_status' => $isMobile ? 'unpaid' : 'paid',
            ]);

            foreach ($items as $item) {
                $obat = $obatsData[$item['obat_id']];
                OrderItem::create([
                    'order_id' => $order->id,
                    'obat_id' => $obat->id,
                    'harga' => $obat->harga,
                    'qty' => $item['qty'],
                    'subtotal' => $obat->harga * $item['qty'],
                ]);
            }

            // Link resep (resep di-upload via mobile app, divalidasi staf)
            if (!empty($data['resep_id'])) {
                $resep = Resep::find($data['resep_id']);
                if ($resep) {
                    $resep->order_id = $order->id;
                    $resep->save();
                }
            }

            // Master Part 3: checkout -> reservation FEFO (physical diturunkan pada confirm)
            $this->stockReservation->reserveForOrder($order);

            // POS: fisik dikeluarkan + lunas langsung (cash di-pickup)
            if (!$isMobile) {
                $this->stockReservation->confirmPayment($order);
            }

            return $order->fresh(['items.obat', 'user', 'resep', 'reservation']);
        });
    }

    /**
     * Validasi items + obat: obat aktif, stok tersedia (physical - reserved).
     */
    private function validateAndGetObats(array $items): array
    {
        if (empty($items)) {
            throw ValidationException::withMessages([
                'items' => ['Order harus memiliki minimal 1 item.'],
            ]);
        }

        $obatIds = array_column($items, 'obat_id');
        $obats = Obat::whereIn('id', $obatIds)->where('is_active', true)->get()->keyBy('id');

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
            $available = $this->stockReservation->availableStock($obatId);
            if ($available < $qty) {
                throw ValidationException::withMessages([
                    "items.{$obatId}" => ["Stok {$obat->nama} tidak mencukupi. Tersedia: {$available}, diminta: {$qty}."],
                ]);
            }

            $result[$obatId] = $obat;
        }

        return $result;
    }

    /**
     * Validasi resep untuk obat keras.
     * Master Part 2: resep hanya dari pembeli mobile;
     * Master Part 4 C3: resep.user_id wajib NOT NULL; staf divalidasi.
     */
    private function validatePrescription(array $obatsData, ?int $buyerUserId, ?int $resepId): void
    {
        $hasKeras = collect($obatsData)->contains('jenis', 'keras');
        if (!$hasKeras) {
            return;
        }

        if (!$resepId) {
            throw ValidationException::withMessages([
                'resep_id' => ['Order mengandung obat keras. Resep wajib diupload dan divalidasi.'],
            ]);
        }

        $resep = Resep::where('id', $resepId)->first();
        if (!$resep) {
            throw ValidationException::withMessages([
                'resep_id' => ['Resep tidak ditemukan.'],
            ]);
        }

        if ($resep->status !== 'disetujui') {
            throw ValidationException::withMessages([
                'resep_id' => ['Resep belum divalidasi oleh staf. Status: ' . $resep->status],
            ]);
        }

        if ($buyerUserId && $resep->user_id !== $buyerUserId) {
            throw ValidationException::withMessages([
                'resep_id' => ['Resep tidak ditemukan atau tidak dapat ditautkan dengan order ini.'],
            ]);
        }
    }

    private function calculateTotal(array $obatsData, array $items): float
    {
        $total = 0;
        foreach ($items as $item) {
            $obat = $obatsData[$item['obat_id']];
            $total += $obat->harga * $item['qty'];
        }
        return $total;
    }

    private function generateOrderCode(): string
    {
        $date = now()->format('Ymd');
        $prefix = "ORD-{$date}-";

        $lastOrder = Order::where('order_code', 'LIKE', "{$prefix}%")
            ->orderBy('id', 'desc')
            ->first();

        $sequence = ($lastOrder ? (int) substr($lastOrder->order_code, -3) : 0) + 1;

        return $prefix . str_pad($sequence, 3, '0', STR_PAD_LEFT);
    }

    public function getAllOrders($userId = null, $status = null, int $perPage = 15, ?string $startDate = null, ?string $endDate = null)
    {
        $query = Order::with(['user', 'items.obat', 'reservation']);

        if ($userId) {
            $query->where('user_id', $userId);
        }
        if ($status) {
            $query->where('status', $status);
        }
        if (!empty($startDate)) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        if (!empty($endDate)) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getOrderById(int $orderId, $userId = null): Order
    {
        $order = Order::with(['user', 'items.obat', 'resep', 'reservation'])->findOrFail($orderId);

        if ($userId && $order->user_id !== $userId) {
            throw ValidationException::withMessages([
                'order_id' => ['Anda tidak memiliki akses ke order ini.'],
            ]);
        }

        return $order;
    }

    /**
     * Update status order — Part 2: transisi kanonis konsisten antar DB/Service/Request.
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

        return $order->fresh(['user', 'items.obat', 'resep', 'reservation']);
    }

    private function validateStatusTransition(string $currentStatus, string $newStatus): void
    {
        $validTransitions = [
            'diproses' => ['siap_diambil', 'dibatalkan'],
            'siap_diambil' => ['selesai', 'dibatalkan'],
            'selesai' => [],
            'dibatalkan' => [],
        ];

        if (!in_array($newStatus, $validTransitions[$currentStatus] ?? [])) {
            throw ValidationException::withMessages([
                'status' => ["Tidak bisa mengubah status dari '{$currentStatus}' ke '{$newStatus}'."],
            ]);
        }
    }

    /**
     * Master Part 3 C — Konfirmasi pembayaran lunas (idempotent):
     * keluarkan fisik dari batch + tandai reservation 'confirmed'.
     */
    public function confirmPayment(Order $order): Order
    {
        $this->stockReservation->confirmPayment($order);
        return $order->fresh(['user', 'items.obat', 'resep', 'reservation']);
    }

    /**
     * Master Part 3 C — Batalkan order dan release reservation.
     */
    public function cancelOrder(Order $order): Order
    {
        return DB::transaction(function () use ($order): Order {
            // Lock baris order untuk menghindari double-release pada konkurensi
            $locked = Order::where('id', $order->id)->lockForUpdate()->firstOrFail();

            if (!in_array($locked->status, ['diproses'], true)) {
                throw ValidationException::withMessages([
                    'status' => ['Order dengan status ' . $locked->status . ' tidak bisa dibatalkan.'],
                ]);
            }

            $this->stockReservation->releaseReservation($locked);

            $locked->status = 'dibatalkan';
            $locked->save();

            return $locked->fresh(['user', 'items.obat', 'resep', 'reservation']);
        });
    }
}
