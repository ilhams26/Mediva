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
        Schema::create('batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('obat_id')->constrained('obats')->onDelete('cascade');
            $table->string('batch_number');
            $table->date('expired_date');
            $table->integer('jumlah_awal');
            $table->integer('jumlah_sisa');
            $table->timestamps();
            $table->index(['obat_id', 'expired_date']);
        });
        DB::statement('ALTER TABLE batches ADD CONSTRAINT check_batches_jumlah_sisa CHECK (jumlah_sisa >= 0);');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batches');
    }
};
