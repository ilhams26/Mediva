<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';

    protected $fillable = [
        'user_id',
        'order_code',
        'metode_pembayaran',
        'total_harga',
        'status',
        'payment_status',
        'snap_token',
        'midtrans_transaction_id',
        'paid_at',
        'completed_at',
    ];

    protected $casts = [
        'total_harga' => 'decimal:2',
        'completed_at' => 'datetime',
        'paid_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function resep()
    {
        return $this->hasOne(Resep::class, 'order_id');
    }
}
