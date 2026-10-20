<?php

namespace Database\Seeders;

use App\Models\Batch;
use App\Models\Kategori;
use App\Models\Obat;
use Illuminate\Database\Seeder;

class ObatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $katBebas = Kategori::where('nama', 'Obat Bebas')->first()?->id ?? 1;
        $katTerbatas = Kategori::where('nama', 'Obat Bebas Terbatas')->first()?->id ?? 2;
        $katKeras = Kategori::where('nama', 'Obat Keras')->first()?->id ?? 3;
        $katVitamin = Kategori::where('nama', 'Vitamin & Suplemen')->first()?->id ?? 4;
        $katHerbal = Kategori::where('nama', 'Herbal & Tradisional')->first()?->id ?? 5;

        $daftarObat = [
            [
                'kategori_id' => $katBebas,
                'nama' => 'Paracetamol 500 mg',
                'deskripsi' => 'Analgesik dan antipiretik yang digunakan untuk meredakan demam, sakit kepala, sakit gigi, dan nyeri ringan hingga sedang.',
                'harga' => 12000.00,
                'jenis' => 'biasa',
                'stok_minimum' => 20,
                'is_active' => true,
                'batches' => [
                    ['batch_number' => 'PCT-2026-A1', 'expired_date' => '2026-12-15', 'jumlah_awal' => 50, 'jumlah_sisa' => 50],
                    ['batch_number' => 'PCT-2027-B2', 'expired_date' => '2027-08-20', 'jumlah_awal' => 100, 'jumlah_sisa' => 100],
                ],
            ],
            [
                'kategori_id' => $katTerbatas,
                'nama' => 'Ibuprofen 400 mg',
                'deskripsi' => 'Obat antiinflamasi nonsteroid (OAINS) untuk mengurangi rasa sakit, radang, demam, dismenore, serta nyeri otot atau sendi.',
                'harga' => 18000.00,
                'jenis' => 'biasa',
                'stok_minimum' => 15,
                'is_active' => true,
                'batches' => [
                    ['batch_number' => 'IBU-2026-01', 'expired_date' => '2026-11-30', 'jumlah_awal' => 40, 'jumlah_sisa' => 40],
                    ['batch_number' => 'IBU-2027-02', 'expired_date' => '2027-06-15', 'jumlah_awal' => 80, 'jumlah_sisa' => 80],
                ],
            ],
            [
                'kategori_id' => $katKeras,
                'nama' => 'Amoxicillin 500 mg',
                'deskripsi' => 'Antibiotik penisilin berspektrum luas untuk mengobati berbagai infeksi bakteri pada telinga, hidung, tenggorokan, saluran kemih, dan kulit. Memerlukan resep dokter.',
                'harga' => 25000.00,
                'jenis' => 'keras',
                'stok_minimum' => 20,
                'is_active' => true,
                'batches' => [
                    ['batch_number' => 'AMX-2026-11', 'expired_date' => '2026-10-31', 'jumlah_awal' => 60, 'jumlah_sisa' => 60],
                    ['batch_number' => 'AMX-2027-12', 'expired_date' => '2027-09-10', 'jumlah_awal' => 100, 'jumlah_sisa' => 100],
                ],
            ],
            [
                'kategori_id' => $katKeras,
                'nama' => 'Cetirizine 10 mg',
                'deskripsi' => 'Antihistamin generasi kedua untuk mengatasi gejala rinitis alergi, bersin-bersin, mata berair, hidung tersumbat, dan biduran (urtikaria).',
                'harga' => 15000.00,
                'jenis' => 'keras',
                'stok_minimum' => 10,
                'is_active' => true,
                'batches' => [
                    ['batch_number' => 'CTZ-2027-A', 'expired_date' => '2027-03-25', 'jumlah_awal' => 50, 'jumlah_sisa' => 50],
                ],
            ],
            [
                'kategori_id' => $katBebas,
                'nama' => 'Antasida Doen Tablet Kunyah',
                'deskripsi' => 'Kombinasi aluminium hidroksida dan magnesium hidroksida untuk menetralkan asam lambung, meringankan sakit maag, nyeri ulu hati, dan kembung.',
                'harga' => 9000.00,
                'jenis' => 'biasa',
                'stok_minimum' => 25,
                'is_active' => true,
                'batches' => [
                    ['batch_number' => 'ATD-2026-05', 'expired_date' => '2026-12-01', 'jumlah_awal' => 100, 'jumlah_sisa' => 100],
                    ['batch_number' => 'ATD-2027-08', 'expired_date' => '2027-11-20', 'jumlah_awal' => 100, 'jumlah_sisa' => 100],
                ],
            ],
            [
                'kategori_id' => $katBebas,
                'nama' => 'Betadine Antiseptic Solution 30 ml',
                'deskripsi' => 'Antiseptik luka dengan povidone-iodine 10% untuk mencegah infeksi pada luka iris, luka lecet, luka bakar ringan, dan khitanan.',
                'harga' => 28000.00,
                'jenis' => 'biasa',
                'stok_minimum' => 10,
                'is_active' => true,
                'batches' => [
                    ['batch_number' => 'BTD-2027-X', 'expired_date' => '2027-12-31', 'jumlah_awal' => 30, 'jumlah_sisa' => 30],
                ],
            ],
            [
                'kategori_id' => $katVitamin,
                'nama' => 'Vitamin C 500 mg Tablet',
                'deskripsi' => 'Suplemen vitamin C (asam askorbat) untuk menjaga daya tahan tubuh, mempercepat pemulihan tubuh setelah sakit, dan antioksidan.',
                'harga' => 15000.00,
                'jenis' => 'biasa',
                'stok_minimum' => 30,
                'is_active' => true,
                'batches' => [
                    ['batch_number' => 'VTC-2026-99', 'expired_date' => '2026-11-15', 'jumlah_awal' => 70, 'jumlah_sisa' => 70],
                    ['batch_number' => 'VTC-2027-01', 'expired_date' => '2027-10-10', 'jumlah_awal' => 120, 'jumlah_sisa' => 120],
                ],
            ],
            [
                'kategori_id' => $katVitamin,
                'nama' => 'Vitamin D3 1000 IU',
                'deskripsi' => 'Suplemen vitamin D3 (cholecalciferol) untuk penyerapan kalsium, kesehatan tulang dan gigi, serta fungsi kekebalan tubuh yang optimal.',
                'harga' => 35000.00,
                'jenis' => 'biasa',
                'stok_minimum' => 15,
                'is_active' => true,
                'batches' => [
                    ['batch_number' => 'VTD-2027-03', 'expired_date' => '2027-05-18', 'jumlah_awal' => 50, 'jumlah_sisa' => 50],
                ],
            ],
            [
                'kategori_id' => $katVitamin,
                'nama' => 'Curcuma Plus Sirup 120 ml',
                'deskripsi' => 'Sirup multivitamin dengan ekstrak temulawak dan minyak ikan kod untuk membantu meningkatkan nafsu makan serta mendukung perkembangan anak.',
                'harga' => 22000.00,
                'jenis' => 'biasa',
                'stok_minimum' => 10,
                'is_active' => true,
                'batches' => [
                    ['batch_number' => 'CRC-2027-04', 'expired_date' => '2027-07-22', 'jumlah_awal' => 40, 'jumlah_sisa' => 40],
                ],
            ],
            [
                'kategori_id' => $katHerbal,
                'nama' => 'Tolak Angin Cair Herbal',
                'deskripsi' => 'Obat herbal terstandar dengan ekstrak jahe, mint, adas, kayu ules, dan madu untuk meredakan masuk angin, perut mual, kembung, dan pusing.',
                'harga' => 24000.00,
                'jenis' => 'biasa',
                'stok_minimum' => 25,
                'is_active' => true,
                'batches' => [
                    ['batch_number' => 'TLK-2026-08', 'expired_date' => '2026-12-28', 'jumlah_awal' => 80, 'jumlah_sisa' => 80],
                    ['batch_number' => 'TLK-2027-09', 'expired_date' => '2027-11-30', 'jumlah_awal' => 120, 'jumlah_sisa' => 120],
                ],
            ],
            [
                'kategori_id' => $katKeras,
                'nama' => 'Omeprazole 20 mg',
                'deskripsi' => 'Obat golongan PPI (Proton Pump Inhibitor) yang bekerja menghambat sekresi asam lambung, efektif untuk GERD dan tukak lambung kronis.',
                'harga' => 32000.00,
                'jenis' => 'keras',
                'stok_minimum' => 15,
                'is_active' => true,
                'batches' => [
                    ['batch_number' => 'OMZ-2027-01', 'expired_date' => '2027-04-12', 'jumlah_awal' => 60, 'jumlah_sisa' => 60],
                ],
            ],
            [
                'kategori_id' => $katKeras,
                'nama' => 'Salbutamol 2 mg',
                'deskripsi' => 'Bronkodilator kerja cepat untuk mengatasi bronkospasme pada asma bronkial, bronkitis kronis, dan emfisema. Memerlukan resep dokter.',
                'harga' => 14000.00,
                'jenis' => 'keras',
                'stok_minimum' => 10,
                'is_active' => true,
                'batches' => [
                    ['batch_number' => 'SBT-2027-02', 'expired_date' => '2027-09-01', 'jumlah_awal' => 50, 'jumlah_sisa' => 50],
                ],
            ],
            [
                'kategori_id' => $katBebas,
                'nama' => 'Oralit Sachet',
                'deskripsi' => 'Bubuk rehidrasi oral berisi campuran natrium klorida, kalium klorida, dan glukosa untuk mencegah serta mengatasi dehidrasi akibat diare dan muntaber.',
                'harga' => 3000.00,
                'jenis' => 'biasa',
                'stok_minimum' => 50,
                'is_active' => true,
                'batches' => [
                    ['batch_number' => 'ORL-2026-07', 'expired_date' => '2026-11-20', 'jumlah_awal' => 150, 'jumlah_sisa' => 150],
                    ['batch_number' => 'ORL-2028-01', 'expired_date' => '2028-01-15', 'jumlah_awal' => 200, 'jumlah_sisa' => 200],
                ],
            ],
            [
                'kategori_id' => $katTerbatas,
                'nama' => 'CTM (Chlorpheniramine Maleate) 4 mg',
                'deskripsi' => 'Antihistamin generasi pertama untuk mengatasi reaksi alergi seperti urtikaria, gatal-gatal pada kulit, bersin, dan hidung tersumbat. Menyebabkan kantuk.',
                'harga' => 5000.00,
                'jenis' => 'biasa',
                'stok_minimum' => 30,
                'is_active' => true,
                'batches' => [
                    ['batch_number' => 'CTM-2027-05', 'expired_date' => '2027-08-30', 'jumlah_awal' => 100, 'jumlah_sisa' => 100],
                ],
            ],
            [
                'kategori_id' => $katKeras,
                'nama' => 'Dexamethasone 0.5 mg',
                'deskripsi' => 'Kortikosteroid potensi tinggi untuk mengatasi reaksi peradangan parah, penyakit alergi berat, penyakit rematik, dan imunosupresan. Wajib resep dokter.',
                'harga' => 11000.00,
                'jenis' => 'keras',
                'stok_minimum' => 20,
                'is_active' => true,
                'batches' => [
                    ['batch_number' => 'DEX-2026-10', 'expired_date' => '2026-12-10', 'jumlah_awal' => 60, 'jumlah_sisa' => 60],
                    ['batch_number' => 'DEX-2027-11', 'expired_date' => '2027-10-25', 'jumlah_awal' => 100, 'jumlah_sisa' => 100],
                ],
            ],
        ];

        foreach ($daftarObat as $item) {
            $batches = $item['batches'];
            unset($item['batches']);

            $obat = Obat::firstOrCreate(
                ['nama' => $item['nama']],
                $item
            );

            foreach ($batches as $batchData) {
                Batch::firstOrCreate(
                    [
                        'obat_id' => $obat->id,
                        'batch_number' => $batchData['batch_number'],
                    ],
                    $batchData
                );
            }
        }
    }
}
