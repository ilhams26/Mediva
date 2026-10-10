<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class orders extends Model
{
    protected $table = 'orders';

    protected $fillable = [
        'user_id',
        'order_code',
        'metode_pembayaran',
        'total_harga',
        'status',
        'payment_status',
        'completed_at'
    ];

    protected $casts = [
        'total_harga' => 'decimal:2',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(user::class, 'user_id');
    }

    public function items()
    {
        return $this->hasMany(order_items::class, 'order_id');
    }
}
