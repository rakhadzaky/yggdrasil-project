<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterForeignKeyReferralLog extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('referral_log', function (Blueprint $table) {
            $table->string('sent_to_email')->after('is_used');
            
            $table->dropColumn('used_by_email');

            $table->foreign('submited_pid')->references('id')->on('persons')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('referral_log', function (Blueprint $table) {
            $table->string('used_by_email')->nullable()->after('is_used');

            $table->dropColumn('sent_to_email');

            $table->dropForeign(['submited_pid']);
        });
    }
}
