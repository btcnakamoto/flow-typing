<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController;

Route::get('/article/random', [ArticleController::class, 'getRandomArticle']);

