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
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'no_hp' => '081234567890',
                'password' => '12345',
                'role' => 'admin',
                'jenis_kelamin' => 'L',
                'tanggal_lahir' => '1995-01-01',
            ]
        );

        // Staf
        User::updateOrCreate(
            ['username' => 'staf'],
            [
                'no_hp' => '081234567891',
                'password' => '12345',
                'role' => 'staf',
                'jenis_kelamin' => 'P',
                'tanggal_lahir' => '1998-05-15',
            ]
        );

        // Pembeli
        User::updateOrCreate(
            ['username' => 'ilham'],
            [
                'no_hp' => '081234567892',
                'password' => '12345',
                'role' => 'pembeli',
                'jenis_kelamin' => 'L',
                'tanggal_lahir' => '2000-08-20',
            ]
        );
        User::updateOrCreate(
            ['username' => 'tsaabita'],
            [
                'no_hp' => '081234567893',
                'password' => '12345',
                'role' => 'pembeli',
                'jenis_kelamin' => 'P',
                'tanggal_lahir' => '2000-08-20',
            ]
        );
        User::updateOrCreate(
            ['username' => 'aisiti'],
            [
                'no_hp' => '081234567894',
                'password' => '12345',
                'role' => 'pembeli',
                'jenis_kelamin' => 'P',
                'tanggal_lahir' => '2000-08-20',
            ]
        );
    }
}
