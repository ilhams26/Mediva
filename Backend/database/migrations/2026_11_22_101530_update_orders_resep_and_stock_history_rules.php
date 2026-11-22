<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Update orders, resep dan pergerakan_stok sesuai keputusan bisnis Mediva:
 * - orders.user_id nullable (support POS walk-in)
 * - orders.created_by nullable FK users (staff yang buat via POS)
 * - orders.order_source enum('mobile','pos') default 'mobile'
 * - orders_user_id_foreign: ON DELETE CASCADE -> ON DELETE SET NULL (pertahankan riwayat transaksi)
 * - pergerakan_stok.created_by: ON DELETE CASCADE -> ON DELETE SET NULL (pertahankan riwayat pergerakan stok)
 * - resep.status: enum('menunggu_validasi','disetujui','ditolak') default 'menunggu_validasi'
 *   (data lama dengan 'pending' dipetakan ke 'menunggu_validasi')
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. orders: user_id menjadi nullable + FK ON DELETE SET NULL
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign('orders_user_id_foreign');
            $table->unsignedBigInteger('user_id')->nullable()->change();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });

        // 2. orders: tambah created_by (staff yang buat via POS) + order_source
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->enum('order_source', ['mobile', 'pos'])->default('mobile');
        });

        // 3. pergerakan_stok.created_by: FK ON DELETE SET NULL (pertahankan riwayat pergerakan stok)
        Schema::table('pergerakan_stok', function (Blueprint $table) {
            $table->dropForeign('pergerakan_stok_created_by_foreign');
            $table->unsignedBigInteger('created_by')->nullable()->change();
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        });

        // 4. resep.status: ganti CHECK constraint -> ('menunggu_validasi', 'disetujui', 'ditolak')
        //    via SQL mentah karena Laravel PG grammar tidak menyediakan CHECK inline pada change().
        DB::statement('ALTER TABLE resep DROP CONSTRAINT resep_status_check');

        // Peta data lama: 'pending' -> 'menunggu_validasi'
        DB::statement("UPDATE resep SET status = 'menunggu_validasi' WHERE status NOT IN ('menunggu_validasi', 'disetujui', 'ditolak')");

        DB::statement("ALTER TABLE resep ADD CONSTRAINT resep_status_check CHECK (status IN ('menunggu_validasi', 'disetujui', 'ditolak'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign('orders_created_by_foreign');
            $table->dropColumn('created_by', 'order_source');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign('orders_user_id_foreign');
            $table->unsignedBigInteger('user_id')->change();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('pergerakan_stok', function (Blueprint $table) {
            $table->dropForeign('pergerakan_stok_created_by_foreign');
            $table->unsignedBigInteger('created_by')->change();
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });

        DB::statement('ALTER TABLE resep DROP CONSTRAINT resep_status_check');
    }
};
