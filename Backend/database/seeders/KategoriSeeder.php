<?php

namespace Database\Seeders;

use App\Models\Kategori;
use Illuminate\Database\Seeder;

class KategoriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kategoris = [
            ['nama' => 'Obat Bebas'],
            ['nama' => 'Obat Bebas Terbatas'],
            ['nama' => 'Obat Keras'],
            ['nama' => 'Vitamin & Suplemen'],
            ['nama' => 'Herbal & Tradisional'],
        ];

        foreach ($kategoris as $kategori) {
            Kategori::firstOrCreate(['nama' => $kategori['nama']]);
        }
    }
}
