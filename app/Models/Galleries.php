<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Galleries extends Model
{
    use HasFactory;
    protected $table = 'galleries';
    protected $primaryKey = 'id';
    protected $fillable = [
        'family_id',
        'gallery_title',
        'description',
        'gallery_date',
        'created_at',
        'updated_at',
    ];
}