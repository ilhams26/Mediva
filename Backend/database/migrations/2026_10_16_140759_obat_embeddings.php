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

        Schema::create('obat_embeddings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('obat_id')->unique()->constrained('obats')->onDelete('cascade');
            $table->text('content');
            $table->string('embedding_model')->default('text-embedding-004');
            $table->timestamps();
        });

        DB::statement('ALTER TABLE obat_embeddings ADD COLUMN embedding extensions.vector(768);');
    }

    public function down(): void
    {
        Schema::dropIfExists('obat_embeddings');
    }
};
