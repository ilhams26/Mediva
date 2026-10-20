<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        User::firstOrCreate(
            ['username' => 'admin'],
            [
                'no_hp' => '081234567890',
                'password' => 'admin123',
                'role' => 'admin',
                'jenis_kelamin' => 'L',
                'tanggal_lahir' => '1995-01-01',
                'is_active' => true,
            ]
        );

        // Staf
        User::firstOrCreate(
            ['username' => 'staf_mediva'],
            [
                'no_hp' => '081234567891',
                'password' => 'staf123',
                'role' => 'staf',
                'jenis_kelamin' => 'P',
                'tanggal_lahir' => '1998-05-15',
                'is_active' => true,
            ]
        );

        // Pembeli
        User::firstOrCreate(
            ['username' => 'budi_pembeli'],
            [
                'no_hp' => '081234567892',
                'password' => 'pembeli123',
                'role' => 'pembeli',
                'jenis_kelamin' => 'L',
                'tanggal_lahir' => '2000-08-20',
                'is_active' => true,
            ]
        );
    }
}
