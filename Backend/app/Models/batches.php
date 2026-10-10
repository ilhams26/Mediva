<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class batches extends Model
{
    protected $table = 'batches';
    protected $fillable = [
        'obat_id',
        'batch_number',
        'expired_date',
        'jumlah_awal',
        'jumlah_sisa',
    ];

    protected $casts = [
        'expired_date' => 'date',
    ];

    public function obat()
    {
        return $this->belongsTo(obat::class, 'obat_id');
    }
}
