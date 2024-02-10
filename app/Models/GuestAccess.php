<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuestAccess extends Model
{
    use HasFactory;
    protected $table = 'guest_access_log';
    protected $primaryKey = 'id';
    protected $fillable = [
        'focus_pid',
        'guest_access_code',
        'expired_time',
        'counter_used',
        'created_by_email',
        'created_at',
        'updated_at',
    ];
}