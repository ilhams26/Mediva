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
        Schema::table('users', function (Blueprint $table) {
            $table->string('otp', 255)->nullable()->change();
            if (!Schema::hasColumn('users', 'otp_attempts')) {
                $table->integer('otp_attempts')->default(0)->after('otp');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('otp', 6)->nullable()->change();
            if (Schema::hasColumn('users', 'otp_attempts')) {
                $table->dropColumn('otp_attempts');
            }
        });
    }
};
