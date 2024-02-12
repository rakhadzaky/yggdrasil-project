<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTablePersonPhotos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('person_photos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pid');
            $table->string('img_address');
            $table->boolean('is_main_image');
            $table->timestamps();

            $table->foreign('pid')->references('id')->on('persons')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('person_photos');
    }
}
