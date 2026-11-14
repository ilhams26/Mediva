<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ChangePasswordTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create([
            'username' => 'testuser',
            'password' => Hash::make('oldpassword123'),
        ]);
        $this->token = $this->user->createToken('test')->plainTextToken;
    }

    public function test_change_password_success(): void
    {
        $response = $this->withToken($this->token)->postJson('/api/change-password', [
            'current_password' => 'oldpassword123',
            'password' => 'newpassword456',
            'password_confirmation' => 'newpassword456',
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->user->refresh();
        $this->assertTrue(Hash::check('newpassword456', $this->user->password));
        $this->assertCount(0, $this->user->tokens);
    }

    public function test_change_password_wrong_current_password(): void
    {
        $response = $this->withToken($this->token)->postJson('/api/change-password', [
            'current_password' => 'wrongpassword',
            'password' => 'newpassword456',
            'password_confirmation' => 'newpassword456',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['current_password']);
    }

    public function test_change_password_unauthenticated(): void
    {
        $response = $this->postJson('/api/change-password', [
            'current_password' => 'oldpassword123',
            'password' => 'newpassword456',
            'password_confirmation' => 'newpassword456',
        ]);

        $response->assertStatus(401);
    }
}
