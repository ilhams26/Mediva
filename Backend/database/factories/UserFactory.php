<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     * 
     * Default user adalah pembeli yang aktif.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'username' => fake()->unique()->userName(),
            'no_hp' => '08' . fake()->unique()->numerify('##########'),
            'password' => static::$password ??= Hash::make('password123'),
            'role' => 'pembeli',
            'jenis_kelamin' => fake()->randomElement(['L', 'P']),
            'tanggal_lahir' => fake()->date('Y-m-d', '-18 years'),
            'is_active' => true,
            'otp' => null,
            'otp_verified_at' => null,
            'otp_expired_at' => null,
        ];
    }

    /**
     * Buat user dengan role admin
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
        ]);
    }

    /**
     * Buat user dengan role staf
     */
    public function staf(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'staf',
        ]);
    }

    /**
     * Buat user yang tidak aktif (dinonaktifkan)
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
