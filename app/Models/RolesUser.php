<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;
use App\Models\Roles;

class RolesUser extends Model
{
    use HasFactory;
    protected $table = 'roles_user';
    protected $primaryKey = 'id';
    protected $fillable = [
        'user_id',
        'role_id',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function role() {
        return $this->belongsTo(Roles::class, 'role_id', 'id');
    }
}
