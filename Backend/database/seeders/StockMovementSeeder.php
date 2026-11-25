<?php

namespace Database\Seeders;

use App\Models\Batch;
use App\Models\Kategori;
use App\Models\Obat;
use App\Models\PergerakanStok;
use App\Models\User;
use Illuminate\Database\Seeder;

class StockMovementSeeder extends Seeder
{
    public function run(): void
    {
        $staf = User::where('role', 'staf')->first() ?? User::first();
        $admin = User::where('role', 'admin')->first() ?? $staf;
        $kategori = Kategori::first();

        // 1. Pastikan Sanmol Sirup tersedia (sesuai gambar mockup)
        $sanmol = Obat::firstOrCreate(['nama' => 'Sanmol Sirup'], [
            'kategori_id' => $kategori?->id ?? 1,
            'deskripsi' => 'Sirup penurun panas dan pereda nyeri untuk anak.',
            'harga' => 22000,
            'jenis' => 'biasa',
            'stok_minimum' => 10,
            'is_active' => true,
        ]);

        $batchSanmol = Batch::firstOrCreate(['batch_number' => 'SNM-2026-01'], [
            'obat_id' => $sanmol->id,
            'expired_date' => '2027-09-27',
            'jumlah_awal' => 100,
            'jumlah_sisa' => 100,
        ]);

        PergerakanStok::firstOrCreate(
            [
                'obat_id' => $sanmol->id,
                'batch_id' => $batchSanmol->id,
                'tipe' => 'masuk',
            ],
            [
                'jumlah' => 100,
                'sumber' => 'penerimaan_batch',
                'keterangan' => 'Pemasukan stok awal Sanmol Sirup',
                'created_by' => $staf->id,
                'created_at' => '2026-09-27 12:54:00',
            ]
        );

        // 2. Hubungkan SEMUA batch yang ada di database ke pergerakan_stok
        $allBatches = Batch::with('obat')->get();

        foreach ($allBatches as $batch) {
            if (!$batch->obat) {
                continue;
            }

            PergerakanStok::firstOrCreate(
                [
                    'obat_id' => $batch->obat_id,
                    'batch_id' => $batch->id,
                    'sumber' => 'penerimaan_batch',
                ],
                [
                    'tipe' => 'masuk',
                    'jumlah' => (int) ($batch->jumlah_awal > 0 ? $batch->jumlah_awal : 50),
                    'keterangan' => 'Penerimaan stok awal batch ' . $batch->batch_number,
                    'created_by' => $staf->id,
                    'created_at' => now()->subDays(rand(1, 30))->setTime(rand(8, 17), rand(10, 59)),
                ]
            );
        }
    }
}
