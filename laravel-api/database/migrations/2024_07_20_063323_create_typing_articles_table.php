<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTypingArticlesTable extends Migration
{
    public function up()
    {
        Schema::create('typing_articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->unsignedTinyInteger('difficulty_level');
            $table->string('category', 50)->nullable();
            $table->string('language', 50);
            $table->unsignedInteger('word_count');
            $table->decimal('average_word_length', 4, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('times_practiced')->default(0);
            $table->decimal('average_accuracy', 5, 2)->nullable();
            $table->decimal('average_wpm', 6, 2)->nullable();
            $table->json('tags')->nullable();
            $table->timestamps();

            $table->index('difficulty_level');
            $table->index('category');
            $table->index('language');
            $table->index('is_active');
        });
    }

    public function down()
    {
        Schema::dropIfExists('typing_articles');
    }
}