<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Batch extends Model
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
        'jumlah_awal' => 'integer',
        'jumlah_sisa' => 'integer',
    ];

    public function obat()
    {
        return $this->belongsTo(Obat::class, 'obat_id');
    }

    public function pergerakanStoks()
    {
        return $this->hasMany(PergerakanStok::class, 'batch_id');
    }
}
