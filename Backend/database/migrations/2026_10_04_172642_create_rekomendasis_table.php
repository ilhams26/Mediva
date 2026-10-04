<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rekomendasis', function (Blueprint $table) {
            $table->foreignId('obat_id')->unique()->constrained('obats')->onDelete('cascade');
            $table->text('content');
            $table->string('embedding_model')->default('text-embedding-004');
            $table->timestamps();
        });
        DB::statement('ALTER TABLE obats ADD COLUMN embedding extensions.vector(384);');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rekomendasis');
    }
};
