<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PergerakanStok extends Model
{
    protected $table = 'pergerakan_stok';

    protected $fillable = [
        'obat_id',
        'batch_id',
        'tipe',
        'jumlah',
        'sumber',
        'referensi_id',
        'keterangan',
        'created_by',
    ];

    protected $casts = [
        'jumlah' => 'integer',
        'referensi_id' => 'integer',
    ];

    public function obat()
    {
        return $this->belongsTo(Obat::class, 'obat_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    
    public function batch()
    {
        return $this->belongsTo(Batch::class, 'batch_id');
    }
}
