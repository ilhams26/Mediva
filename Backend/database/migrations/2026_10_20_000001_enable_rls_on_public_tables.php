<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tables = [
            'users',
            'kategoris',
            'obats',
            'batches',
            'orders',
            'order_items',
            'pergerakan_stok',
            'resep',
            'notifikasis',
            'interaksi_penggunas',
            'obat_embeddings',
        ];

        foreach ($tables as $table) {
            DB::statement("ALTER TABLE {$table} ENABLE ROW LEVEL SECURITY;");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'users',
            'kategoris',
            'obats',
            'batches',
            'orders',
            'order_items',
            'pergerakan_stok',
            'resep',
            'notifikasis',
            'interaksi_penggunas',
            'obat_embeddings',
        ];

        foreach ($tables as $table) {
            DB::statement("ALTER TABLE {$table} DISABLE ROW LEVEL SECURITY;");
        }
    }
};
