<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonRelations extends Model
{
    use HasFactory;
    protected $table = 'persons_relations';
    protected $primaryKey = 'id';
    protected $fillable = [
        'pid',
        'mid',
        'fid',
        'pid_relation',
        'hfid',
    ];

    /**
     * Get the person data of the head of family.
     */
    public function headOfFamilyPerson()
    {
        return $this->hasOne(Persons::class, 'id', 'hfid');
    }

    /**
     * Get the father person data.
     */
    public function fatherPerson()
    {
        return $this->hasOne(Persons::class, 'id', 'fid');
    }

    /**
     * Get the mother person data.
     */
    public function motherPerson()
    {
        return $this->hasOne(Persons::class, 'id', 'mid');
    }

    /**
     * Get the partner person data.
     */
    public function partnerPerson()
    {
        return $this->hasOne(Persons::class, 'id', 'pid_relation');
    }
}
