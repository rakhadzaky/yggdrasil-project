<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\FamilyRelations;

class Persons extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'persons';
    protected $softDelete = true;
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

    public function families() {
        return $this->hasMany(FamilyRelations::class, 'person_id', 'id');
    }
}
