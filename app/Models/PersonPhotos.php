<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonPhotos extends Model
{
    use HasFactory;
    protected $table = 'person_photos';
    protected $primaryKey = 'id';
    protected $fillable = [
        'id',
        'pid',
        'img_address',
        'is_main_image',
        'created_at',
        'updated_at',
    ];
}
