<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Persons extends Model
{
    use HasFactory;
    protected $table = 'persons';
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
        'gender',
        'birthdate',
        'img_url',
        'img_file',
        'live_loc',
        'phone',
    ];

    public function whereSearch($query, $search) {
        if ($search) {
            return $query->where('name','like','%'+$search+'%');
        }
        return $query;
    }
}
