<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableGusetAccess extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('guest_access_log', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('focus_pid');
            $table->string('guest_access_code');
            $table->date('expired_time');
            $table->integer('counter_used');
            $table->string('created_by_email');
            $table->timestamps();

            $table->foreign('focus_pid')->references('id')->on('persons')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('guest_access_log');
    }
}
