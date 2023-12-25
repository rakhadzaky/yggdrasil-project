<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;
use App\Models\Persons;

class ReferralLog extends Model
{
    use HasFactory;
    protected $table = 'referral_log';
    protected $primaryKey = 'id';
    protected $fillable = [
        'submited_pid',
        'referral_code',
        'expired_time',
        'is_used',
        'sent_to_email',
        'created_by_email',
    ];

    public function creators() {
        return $this->belongsTo(User::class, 'created_by_email', 'email');
    }

    public function usedBy() {
        return $this->belongsTo(User::class, 'sent_to_email', 'email');
    }

    public function relatedPerson() {
        return $this->belongsTo(Persons::class, 'submited_pid', 'id');
    }
}
