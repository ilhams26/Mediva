<?php

namespace Database\Seeders;

use App\Models\Batch;
use App\Models\Kategori;
use App\Models\Obat;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Database\Seeder;

class SalesReportSeeder extends Seeder
{
    public function run(): void
    {
        $staf = User::where('role', 'staf')->first() ?? User::first();
        $kat = Kategori::first();

        // 1. Pastikan Obat-obat di mockup ada
        // Paracetamol 500mg (harga 5000)
        $pct = Obat::firstOrCreate(['nama' => 'Paracetamol 500mg'], [
            'kategori_id' => $kat?->id ?? 1,
            'deskripsi' => 'Analgesik dan antipiretik',
            'harga' => 5000,
            'jenis' => 'biasa',
            'stok_minimum' => 20,
            'is_active' => true,
        ]);
        $batchPct = Batch::firstOrCreate(['batch_number' => 'PCT-REAL-594'], [
            'obat_id' => $pct->id,
            'expired_date' => '2027-12-31',
            'jumlah_awal' => 600,
            'jumlah_sisa' => 594,
        ]);

        // OBH Combi (harga 12000)
        $obh = Obat::firstOrCreate(['nama' => 'OBH Combi'], [
            'kategori_id' => $kat?->id ?? 1,
            'deskripsi' => 'Obat batuk berdahak',
            'harga' => 12000,
            'jenis' => 'biasa',
            'stok_minimum' => 10,
            'is_active' => true,
        ]);
        $batchObh = Batch::firstOrCreate(['batch_number' => 'OBH-REAL-499'], [
            'obat_id' => $obh->id,
            'expired_date' => '2027-10-15',
            'jumlah_awal' => 500,
            'jumlah_sisa' => 499,
        ]);

        // alpara (harga 14000)
        $alpara = Obat::firstOrCreate(['nama' => 'alpara'], [
            'kategori_id' => $kat?->id ?? 1,
            'deskripsi' => 'Obat flu, batuk, dan demam',
            'harga' => 14000,
            'jenis' => 'biasa',
            'stok_minimum' => 50,
            'is_active' => true,
        ]);
        $batchAlp = Batch::firstOrCreate(['batch_number' => 'ALP-REAL-5000'], [
            'obat_id' => $alpara->id,
            'expired_date' => '2028-01-01',
            'jumlah_awal' => 5020,
            'jumlah_sisa' => 5000,
        ]);

        // 2. Buat Transaksi Penjualan yang persis dengan mockup:
        // Transaksi 1: 27-04-2026 14:43 | Paracetamol 500mg | Qty: 5 | Rp 25.000
        $order1 = Order::firstOrCreate(
            ['order_code' => 'ORD-20260427-001'],
            [
                'created_by' => $staf->id,
                'order_source' => 'pos',
                'metode_pembayaran' => 'cash',
                'total_harga' => 25000,
                'status' => 'selesai',
                'payment_status' => 'paid',
                'created_at' => '2026-04-27 14:43:00',
            ]
        );
        OrderItem::firstOrCreate(
            ['order_id' => $order1->id, 'obat_id' => $pct->id],
            [
                'harga' => 5000,
                'qty' => 5,
                'subtotal' => 25000,
                'created_at' => '2026-04-27 14:43:00',
            ]
        );

        // Transaksi 2: 18-05-2026 11:27 | OBH Combi | Qty: 1 | Rp 12.000
        $order2 = Order::firstOrCreate(
            ['order_code' => 'ORD-20260518-002'],
            [
                'created_by' => $staf->id,
                'order_source' => 'pos',
                'metode_pembayaran' => 'cash',
                'total_harga' => 12000,
                'status' => 'selesai',
                'payment_status' => 'paid',
                'created_at' => '2026-05-18 11:27:00',
            ]
        );
        OrderItem::firstOrCreate(
            ['order_id' => $order2->id, 'obat_id' => $obh->id],
            [
                'harga' => 12000,
                'qty' => 1,
                'subtotal' => 12000,
                'created_at' => '2026-05-18 11:27:00',
            ]
        );

        // Transaksi 3: 06-06-2026 15:54 | alpara | Qty: 20 | Rp 280.000
        $order3 = Order::firstOrCreate(
            ['order_code' => 'ORD-20260606-003'],
            [
                'created_by' => $staf->id,
                'order_source' => 'pos',
                'metode_pembayaran' => 'cash',
                'total_harga' => 28000,
                'status' => 'selesai',
                'payment_status' => 'paid',
                'created_at' => '2026-06-06 15:54:00',
            ]
        );
        OrderItem::firstOrCreate(
            ['order_id' => $order3->id, 'obat_id' => $alpara->id],
            [
                'harga' => 14000,
                'qty' => 20,
                'subtotal' => 280000,
                'created_at' => '2026-06-06 15:54:00',
            ]
        );

        // Transaksi 4: 06-06-2026 16:17 | Paracetamol 500mg | Qty: 1 | Rp 5.000
        $order4 = Order::firstOrCreate(
            ['order_code' => 'ORD-20260606-004'],
            [
                'created_by' => $staf->id,
                'order_source' => 'pos',
                'metode_pembayaran' => 'cash',
                'total_harga' => 5000,
                'status' => 'selesai',
                'payment_status' => 'paid',
                'created_at' => '2026-06-06 16:17:00',
            ]
        );
        OrderItem::firstOrCreate(
            ['order_id' => $order4->id, 'obat_id' => $pct->id, 'qty' => 1],
            [
                'harga' => 5000,
                'subtotal' => 5000,
                'created_at' => '2026-06-06 16:17:00',
            ]
        );
    }
}
