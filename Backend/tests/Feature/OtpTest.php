<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class OtpTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create([
            'username' => 'testuser',
            'no_hp' => '081234567890',
            'password' => Hash::make('password123'),
        ]);
    }

    public function test_send_otp_success(): void
    {
        $response = $this->postJson('/api/forgot-password', [
            'identifier' => 'testuser',
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure(['data' => ['expires_at']]);

        $this->user->refresh();
        $this->assertNotNull($this->user->otp);
        $this->assertNotNull($this->user->otp_expired_at);
    }

    public function test_send_otp_user_not_found(): void
    {
        $response = $this->postJson('/api/forgot-password', [
            'identifier' => 'nonexistent',
        ]);

        $response->assertStatus(404)
            ->assertJson(['success' => false]);
    }

    public function test_send_otp_rate_limit(): void
    {
        for ($i = 0; $i < 3; $i++) {
            $this->postJson('/api/forgot-password', ['identifier' => 'testuser']);
        }

        $response = $this->postJson('/api/forgot-password', ['identifier' => 'testuser']);
        $response->assertStatus(429);
    }

    public function test_verify_otp_success(): void
    {
        $this->user->update([
            'otp' => Hash::make('123456'),
            'otp_expired_at' => now()->addMinutes(10),
        ]);

        $response = $this->postJson('/api/verify-otp', [
            'identifier' => 'testuser',
            'otp' => '123456',
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->user->refresh();
        $this->assertNotNull($this->user->otp_verified_at);
    }

    public function test_verify_otp_invalid(): void
    {
        $this->user->update([
            'otp' => Hash::make('123456'),
            'otp_expired_at' => now()->addMinutes(10),
        ]);

        $response = $this->postJson('/api/verify-otp', [
            'identifier' => 'testuser',
            'otp' => '999999',
        ]);

        $response->assertStatus(400)
            ->assertJson(['success' => false]);
    }

    public function test_verify_otp_expired(): void
    {
        $this->user->update([
            'otp' => Hash::make('123456'),
            'otp_expired_at' => now()->subMinutes(1),
        ]);

        $response = $this->postJson('/api/verify-otp', [
            'identifier' => 'testuser',
            'otp' => '123456',
        ]);

        $response->assertStatus(400);
    }

    public function test_reset_password_success(): void
    {
        $this->user->update([
            'otp' => Hash::make('123456'),
            'otp_expired_at' => now()->addMinutes(10),
            'otp_verified_at' => now(),
        ]);

        $response = $this->postJson('/api/reset-password', [
            'identifier' => 'testuser',
            'otp' => '123456',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->user->refresh();
        $this->assertTrue(Hash::check('newpassword123', $this->user->password));
        $this->assertNull($this->user->otp);
    }
}
