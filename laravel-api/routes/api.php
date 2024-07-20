<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController;

Route::middleware('api')->group(function () {
    Route::get('/article/random', [ArticleController::class, 'getRandomArticle']);
});