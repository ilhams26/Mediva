<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'no_hp' => '081234567890',
                'password' => Hash::make('Admin123!'),
                'role' => 'admin',
                'is_active' => true,
                'otp_verified_at' => now(),
            ]
        );

        // Staff user
        User::updateOrCreate(
            ['username' => 'staff'],
            [
                'no_hp' => '081234567891',
                'password' => Hash::make('Staff123!'),
                'role' => 'staf',
                'is_active' => true,
                'otp_verified_at' => now(),
            ]
        );

        // Buyer user
        User::updateOrCreate(
            ['username' => 'buyer'],
            [
                'no_hp' => '081234567892',
                'password' => Hash::make('Buyer123!'),
                'role' => 'pembeli',
                'is_active' => true,
                'otp_verified_at' => now(),
            ]
        );

        $this->command->info('Test users created successfully!');
    }
}
