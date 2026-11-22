<?php

namespace Tests\Feature;

use App\Models\Kategori;
use App\Models\Obat;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ObatCatalogTest extends TestCase
{
    use RefreshDatabase;

    private Kategori $kategori;

    protected function setUp(): void
    {
        parent::setUp();

        $this->kategori = Kategori::create([
            'nama' => 'Analgesik',
        ]);
    }

    public function test_staf_can_create_obat(): void
    {
        $staf = User::factory()->staf()->create();

        $response = $this->actingAs($staf, 'sanctum')->postJson('/api/obat', [
            'kategori_id' => $this->kategori->id,
            'nama' => 'Paracetamol 500mg',
            'harga' => 50000,
            'jenis' => 'biasa',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('obats', [
            'nama' => 'Paracetamol 500mg',
            'is_active' => true,
        ]);
    }

    public function test_admin_cannot_create_obat(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/obat', [
            'kategori_id' => $this->kategori->id,
            'nama' => 'Paracetamol 500mg',
            'harga' => 50000,
        ]);

        $response->assertStatus(403);
    }

    public function test_staf_can_list_obats_with_search(): void
    {
        $staf = User::factory()->staf()->create();

        Obat::create([
            'kategori_id' => $this->kategori->id,
            'nama' => 'Paracetamol 500mg',
            'harga' => 50000,
            'is_active' => true,
        ]);

        Obat::create([
            'kategori_id' => $this->kategori->id,
            'nama' => 'Aspirin 100mg',
            'harga' => 25000,
            'is_active' => true,
        ]);

        $response = $this->actingAs($staf, 'sanctum')->getJson('/api/obat?search=Paracetamol');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data.data');
    }

    public function test_public_katalog_returns_only_active_obats(): void
    {
        Obat::create([
            'kategori_id' => $this->kategori->id,
            'nama' => 'Paracetamol 500mg',
            'harga' => 50000,
            'is_active' => true,
        ]);

        Obat::create([
            'kategori_id' => $this->kategori->id,
            'nama' => 'Aspirin 100mg',
            'harga' => 25000,
            'is_active' => false,
        ]);

        $response = $this->getJson('/api/katalog/obats');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data.data');
    }

    public function test_staf_can_soft_delete_obat(): void
    {
        $staf = User::factory()->staf()->create();

        $obat = Obat::create([
            'kategori_id' => $this->kategori->id,
            'nama' => 'Paracetamol 500mg',
            'harga' => 50000,
            'is_active' => true,
        ]);

        $response = $this->actingAs($staf, 'sanctum')->deleteJson("/api/obat/{$obat->id}");

        $response->assertStatus(200);
        $this->assertDatabaseHas('obats', [
            'id' => $obat->id,
            'is_active' => false,
        ]);
    }
}
