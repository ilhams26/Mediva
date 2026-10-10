<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class order_items extends Model
{
    protected $table = 'order_items';

    protected $fillable = [
        'order_id',
        'obat_id',
        'harga',
        'qty',
        'subtotal'
    ];

    protected $casts = [
        'harga' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function order()
    {
        return $this->belongsTo(orders::class, 'order_id');
    }

    public function obat()
    {
        return $this->belongsTo(obat::class, 'obat_id');
    }
}