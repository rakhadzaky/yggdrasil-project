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
    ];
}
