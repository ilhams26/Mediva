<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ObatEmbedding extends Model
{
    protected $table = 'obat_embeddings';

    protected $fillable = [
        'obat_id',
        'content',
        'embedding_model',
        'embedding',
    ];

    public function obat()
    {
        return $this->belongsTo(Obat::class, 'obat_id');
    }
}
