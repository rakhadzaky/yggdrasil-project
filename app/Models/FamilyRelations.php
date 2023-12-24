<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Families;
use App\Models\Persons;

class FamilyRelations extends Model
{
    use HasFactory;
    protected $table = 'family_relations';
    protected $primaryKey = 'id';
    protected $fillable = [
        'person_id', 'family_id'
    ];

    public function family() {
        return $this->belongsTo(Families::class, 'family_id', 'id');
    }

    public function person() {
        return $this->belongsTo(Persons::class, 'person_id', 'id');
    }
}
