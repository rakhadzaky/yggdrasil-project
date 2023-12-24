<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\FamilyRelations;

class Families extends Model
{
    use HasFactory;
    protected $table = 'families';
    protected $primaryKey = 'id';
    protected $fillable = [
        'family_name', 'main_address'
    ];

    public function persons() {
        return $this->hasMany(FamilyRelations::class, 'family_id', 'id');
    }
}
