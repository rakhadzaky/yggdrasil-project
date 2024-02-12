<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Photos extends Model
{
    use HasFactory;
    protected $table = 'photos';
    protected $primaryKey = 'id';
    protected $fillable = [
        'id',
        'gallery_id',
        'img_address',
        'description',
        'created_at',
        'updated_at',
    ];
}