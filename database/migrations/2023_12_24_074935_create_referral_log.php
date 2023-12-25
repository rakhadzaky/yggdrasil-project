<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReferralLog extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('referral_log', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('submited_pid');
            $table->string('referral_code');
            $table->date('expired_time');
            $table->boolean('is_used');
            $table->string('used_by_email');
            $table->string('created_by_email');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('referral_log');
    }
}
