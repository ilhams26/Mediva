<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Models\PergerakanStok;
use App\Services\StockService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockMovementController extends Controller
{
    use ApiResponse;

    public function __construct(private StockService $stockService)
    {
    }

    /**
     * GET /api/stock/movements — Riwayat pergerakan stok (history).
     */
    public function index(Request $request): JsonResponse
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $obatId = $request->query('obat_id') ? (int) $request->query('obat_id') : null;
        $tipe = $request->query('tipe');
        $perPage = $request->query('per_page') ? (int) $request->query('per_page') : 100;

        $movements = $this->stockService->getMovements(
            $obatId,
            $tipe,
            $startDate,
            $endDate,
            $perPage
        );

        $mappedData = $movements->map(function ($m) {
            $pemasukan = $m->tipe === 'masuk' ? (int) $m->jumlah : 0;
            $pengeluaran = $m->tipe === 'keluar' ? (int) $m->jumlah : 0;
            $stokAkhir = $m->batch?->jumlah_sisa ?? $m->obat?->batches()->sum('jumlah_sisa') ?? $m->jumlah;

            return [
                'id' => $m->id,
                'obat_id' => $m->obat_id,
                'nama_obat' => $m->obat?->nama ?? ('Obat #' . $m->obat_id),
                'batch_id' => $m->batch_id,
                'batch_number' => $m->batch?->batch_number ?? '-',
                'tipe' => $m->tipe,
                'jumlah' => (int) $m->jumlah,
                'pemasukan' => $pemasukan,
                'pengeluaran' => $pengeluaran,
                'stok_akhir' => (int) $stokAkhir,
                'sumber' => $m->sumber,
                'referensi_id' => $m->referensi_id,
                'keterangan' => $m->keterangan ?? '-',
                'petugas' => $m->createdBy?->username ?? 'Staf',
                'created_by' => $m->created_by,
                'tanggal' => $m->created_at ? $m->created_at->format('d-m-Y H:i') : '-',
                'created_at' => $m->created_at?->toIso8601String(),
            ];
        });

        return $this->success([
            'data' => $mappedData,
            'pagination' => [
                'current_page' => $movements->currentPage(),
                'last_page' => $movements->lastPage(),
                'per_page' => $movements->perPage(),
                'total' => $movements->total(),
            ],
            'summary' => [
                'total_pemasukan' => $mappedData->sum('pemasukan'),
                'total_pengeluaran' => $mappedData->sum('pengeluaran'),
                'total_stok_akhir' => $mappedData->sum('stok_akhir'),
            ],
        ], 'Riwayat pergerakan stok berhasil diambil.');
    }

    /**
     * GET /api/stock/sales-report — Laporan penjualan obat untuk Admin.
     * Format kolom: No, Tanggal, Nama Obat, Jumlah, Pemasukan, Stok Real
     */
    public function salesReport(Request $request): JsonResponse
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $perPage = (int) ($request->query('per_page') ?? 100);

        $query = OrderItem::query()
            ->with(['order', 'obat.batches'])
            ->whereHas('order', function ($q) use ($startDate, $endDate) {
                if (!empty($startDate)) {
                    $q->whereDate('created_at', '>=', $startDate);
                }
                if (!empty($endDate)) {
                    $q->whereDate('created_at', '<=', $endDate);
                }
            })
            ->orderBy('id', 'asc');

        $items = $query->paginate($perPage);

        $mappedData = $items->map(function ($item) {
            $stokReal = $item->obat?->batches()->sum('jumlah_sisa') ?? 0;
            $tanggal = $item->created_at ? $item->created_at->format('d-m-Y H:i') : ($item->order?->created_at ? $item->order->created_at->format('d-m-Y H:i') : '-');

            return [
                'id' => $item->id,
                'tanggal' => $tanggal,
                'nama_obat' => $item->obat?->nama ?? ('Obat #' . $item->obat_id),
                'jumlah' => (int) $item->qty,
                'pemasukan' => (float) ($item->subtotal ?? ($item->qty * $item->harga)),
                'stok_real' => (int) $stokReal,
                'created_at' => $item->created_at?->toIso8601String(),
            ];
        });

        return $this->success([
            'data' => $mappedData,
            'summary' => [
                'total_penjualan' => $mappedData->sum('pemasukan'),
                'total_jumlah' => $mappedData->sum('jumlah'),
            ],
            'pagination' => [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(),
                'total' => $items->total(),
            ],
        ], 'Laporan penjualan obat berhasil diambil.');
    }
}
