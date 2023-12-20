<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\RolesUser;

class Roles extends Model
{
    use HasFactory;
    protected $table = 'roles';
    protected $primaryKey = 'id';
    protected $fillable = [
        'role',
    ];

    public function users() {
        return $this->hasMany(RolesUser::class, 'role_id', 'id');
    }
}
