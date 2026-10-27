<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * Uji pembeli baru berhasil registrasi dan mendapatkan token.
     */
    public function test_user_can_register_as_buyer(): void
    {
        $payload = [
            'username'              => 'pembelibaru_' . time(),
            'no_hp'                 => '0812' . rand(10000000, 99999999),
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'jenis_kelamin'         => 'L',
            'tanggal_lahir'         => '2000-01-01',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'status'  => 'success',
                'message' => 'Pendaftaran berhasil.',
            ])
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'user' => [
                        'id',
                        'username',
                        'no_hp',
                        'role',
                        'is_active',
                    ],
                    'token',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'username' => $payload['username'],
            'role'     => 'pembeli',
            'is_active'=> true,
        ]);
    }

    /**
     * Uji registrasi gagal jika username atau nomor HP duplikat.
     */
    public function test_user_cannot_register_with_duplicate_credentials(): void
    {
        $existing = User::factory()->create([
            'username' => 'existinguser_' . time(),
            'no_hp'    => '0812' . rand(10000000, 99999999),
        ]);

        $response = $this->postJson('/api/register', [
            'username'              => $existing->username,
            'no_hp'                 => $existing->no_hp,
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'status' => 'error',
            ])
            ->assertJsonValidationErrors(['username', 'no_hp']);
    }

    /**
     * Uji user bisa login menggunakan username.
     */
    public function test_user_can_login_with_username(): void
    {
        $user = User::factory()->create([
            'username'  => 'loginuser_' . time(),
            'password'  => Hash::make('secret123'),
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/login', [
            'login_id' => $user->username,
            'password' => 'secret123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status'  => 'success',
                'message' => 'Login berhasil.',
            ])
            ->assertJsonStructure([
                'data' => ['user', 'token'],
            ]);
    }

    /**
     * Uji user bisa login menggunakan nomor HP.
     */
    public function test_user_can_login_with_phone_number(): void
    {
        $user = User::factory()->create([
            'no_hp'     => '0813' . rand(10000000, 99999999),
            'password'  => Hash::make('secret123'),
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/login', [
            'login_id' => $user->no_hp,
            'password' => 'secret123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status'  => 'success',
                'message' => 'Login berhasil.',
            ]);
    }

    /**
     * Uji login gagal jika password salah.
     */
    public function test_user_cannot_login_with_wrong_password(): void
    {
        $user = User::factory()->create([
            'username'  => 'wrongpass_' . time(),
            'password'  => Hash::make('secret123'),
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/login', [
            'login_id' => $user->username,
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'status' => 'error',
            ])
            ->assertJsonValidationErrors(['login_id']);
    }

    /**
     * Uji user yang dinonaktifkan ditolak saat login.
     */
    public function test_inactive_user_cannot_login(): void
    {
        $user = User::factory()->create([
            'username'  => 'inactive_' . time(),
            'password'  => Hash::make('secret123'),
            'is_active' => false,
        ]);

        $response = $this->postJson('/api/login', [
            'login_id' => $user->username,
            'password' => 'secret123',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'status' => 'error',
            ])
            ->assertJsonValidationErrors(['login_id']);
    }

    /**
     * Uji endpoint /api/me untuk mengambil profil yang sedang login.
     */
    public function test_user_can_get_profile_via_me(): void
    {
        $user = User::factory()->create(['is_active' => true]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/me');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data'   => [
                    'id'       => $user->id,
                    'username' => $user->username,
                ],
            ]);
    }

    /**
     * Uji logout mencabut personal access token.
     */
    public function test_user_can_logout(): void
    {
        $user = User::factory()->create(['is_active' => true]);
        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson([
                'status'  => 'success',
                'message' => 'Logout berhasil.',
            ]);

        $this->assertCount(0, $user->fresh()->tokens);
    }

    /**
     * Uji user dapat mengganti password dengan password saat ini yang benar.
     */
    public function test_user_can_change_password(): void
    {
        $user = User::factory()->create([
            'password'  => Hash::make('oldpassword123'),
            'is_active' => true,
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/change-password', [
            'current_password'      => 'oldpassword123',
            'new_password'          => 'newpassword123',
            'new_password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status'  => 'success',
                'message' => 'Password berhasil diperbarui.',
            ]);

        $this->assertTrue(Hash::check('newpassword123', $user->fresh()->password));
    }

    /**
     * Uji alur lupa password: kirim OTP, verifikasi, dan reset password.
     */
    public function test_forgot_password_flow_with_otp(): void
    {
        $user = User::factory()->create([
            'username'  => 'otptest_' . time(),
            'password'  => Hash::make('initialpass123'),
            'is_active' => true,
        ]);

        // 1. Minta OTP
        $sendResponse = $this->postJson('/api/forgot-password/send-otp', [
            'login_id' => $user->username,
        ]);

        $sendResponse->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ]);

        $plainOtp = $sendResponse->json('data.debug_otp');
        $this->assertNotEmpty($plainOtp);

        // Verifikasi bahwa di database tersimpan hash, BUKAN plain OTP
        $freshUser = $user->fresh();
        $this->assertNotEquals($plainOtp, $freshUser->otp);
        $this->assertEquals(hash('sha256', $plainOtp), $freshUser->otp);

        // 2. Verifikasi OTP
        $verifyResponse = $this->postJson('/api/forgot-password/verify-otp', [
            'login_id' => $user->username,
            'otp'      => $plainOtp,
        ]);

        $verifyResponse->assertStatus(200)
            ->assertJson([
                'status'  => 'success',
                'message' => 'Kode OTP valid.',
            ]);

        // 3. Reset Password
        $resetResponse = $this->postJson('/api/forgot-password/reset', [
            'login_id'              => $user->username,
            'otp'                   => $plainOtp,
            'password'              => 'brandnewpass123',
            'password_confirmation' => 'brandnewpass123',
        ]);

        $resetResponse->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ]);

        // Pastikan password baru bisa digunakan untuk login
        $this->assertTrue(Hash::check('brandnewpass123', $user->fresh()->password));
        $this->assertNull($user->fresh()->otp);
    }

    /**
     * Uji OTP gagal jika kode salah dan menghitung percobaan.
     */
    public function test_otp_verification_fails_with_invalid_code(): void
    {
        $user = User::factory()->create([
            'username'       => 'otpfail_' . time(),
            'otp'            => hash('sha256', '123456'),
            'otp_expired_at' => now()->addMinutes(5),
            'otp_attempts'   => 0,
            'is_active'      => true,
        ]);

        $response = $this->postJson('/api/forgot-password/verify-otp', [
            'login_id' => $user->username,
            'otp'      => '999999',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['otp']);

        $this->assertEquals(1, $user->fresh()->otp_attempts);
    }

    /**
     * Uji OTP gagal jika sudah kedaluwarsa.
     */
    public function test_otp_verification_fails_when_expired(): void
    {
        $user = User::factory()->create([
            'username'       => 'otpexpired_' . time(),
            'otp'            => hash('sha256', '123456'),
            'otp_expired_at' => now()->subMinute(), // Sudah lewat 1 menit
            'otp_attempts'   => 0,
            'is_active'      => true,
        ]);

        $response = $this->postJson('/api/forgot-password/verify-otp', [
            'login_id' => $user->username,
            'otp'      => '123456',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['otp']);
    }
}
