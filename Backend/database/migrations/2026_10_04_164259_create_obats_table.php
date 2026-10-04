<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use function Laravel\Prompts\table;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('obats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kategori_id')->constrained('kategoris')->onDelete('cascade');
            $table->string('nama', 255);
            $table->text('deskripsi')->nullable();
            $table->decimal('harga', 10, 2);
            $table->enum('jenis', ['biasa', 'keras'])->default('biasa');
            $table->integer('stok_minimum')->default(0);
            $table->string('foto', 255)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('obats');
    }
};
