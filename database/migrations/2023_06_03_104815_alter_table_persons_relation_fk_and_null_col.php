<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTablePersonsRelationFkAndNullCol extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('persons_relations', function (Blueprint $table) {
            $table->unsignedBigInteger('pid')->nullable()->change();
            $table->unsignedBigInteger('mid')->nullable()->change();
            $table->unsignedBigInteger('fid')->nullable()->change();
            $table->unsignedBigInteger('pid_relation')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('persons_relations', function (Blueprint $table) {
            $table->unsignedBigInteger('pid')->change();
            $table->unsignedBigInteger('mid')->change();
            $table->unsignedBigInteger('fid')->change();
            $table->dropColumn('pid_relation');
        });
    }
}
