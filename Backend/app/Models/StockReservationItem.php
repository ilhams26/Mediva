<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockReservationItem extends Model
{
    protected $table = 'stock_reservation_items';

    protected $fillable = ['reservation_id', 'batch_id', 'jumlah'];

    protected $casts = [
        'jumlah' => 'integer',
    ];

    public function reservation(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(StockReservation::class, 'reservation_id');
    }

    public function batch(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Batch::class, 'batch_id');
    }
}
