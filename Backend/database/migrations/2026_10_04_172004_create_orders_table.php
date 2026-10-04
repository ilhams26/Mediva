<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('order_code')->unique();
            $table->enum('metode_pembayaran', ['midtrans', 'cash']);
            $table->decimal('total_harga', 10, 2);
            $table->enum('status', ['diproses', 'siap_diambil', 'selesai', 'dibatalkan'])->default('diproses');
            $table->enum('payment_status', ['paid', 'unpaid'])->default('unpaid');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
