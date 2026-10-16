<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InteraksiPengguna extends Model
{
    protected $table = 'interaksi_penggunas';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'obat_id',
        'event_type',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function obat()
    {
        return $this->belongsTo(Obat::class, 'obat_id');
    }
}
