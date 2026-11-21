<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Membuat tabel stock_reservations dan stock_reservation_items untuk implementasi
 * Stock Reservation / Holding (Master Part 3):
 *
 * - stock_reservations: satu baris per order (FK orders ON DELETE RESTRICT),
 *   status default 'reserved' (reserved|confirmed|expired|released), expires_at nullable.
 * - stock_reservation_items: baris per batch yang direservasi
 *   (FK stock_reservations CASCADE, FK batches RESTRICT), jumah integer, timestamps.
 *
 * FK ke batches/orders menggunakan ON DELETE RESTRICT agar data yang direferensi
 * oleh reservasi tidak dihapus.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('restrict');
            $table->string('status')->default('reserved'); // reserved | confirmed | expired | released
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->unique('order_id');
        });

        Schema::create('stock_reservation_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained('stock_reservations')->onDelete('cascade');
            $table->foreignId('batch_id')->constrained('batches')->onDelete('restrict');
            $table->integer('jumlah');
            $table->timestamps();

            $table->unique(['reservation_id', 'batch_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_reservation_items');
        Schema::dropIfExists('stock_reservations');
    }
};
