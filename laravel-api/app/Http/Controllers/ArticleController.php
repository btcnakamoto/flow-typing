<?php

namespace App\Http\Controllers;

use App\Models\TypingArticle;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function getRandomArticle()
    {
        $article = TypingArticle::inRandomOrder()->first();

        if (!$article) {
            return response()->json(['error' => 'No articles found'], 404);
        }

        return response()->json([
            'id' => $article->id,
            'title' => $article->title,
            'content' => $article->content,
            'difficulty_level' => $article->difficulty_level,
            'language' => $article->language,
            'word_count' => $article->word_count,
        ]);
    }

    public function getArticleById($id)
    {
        $article = TypingArticle::find($id);

        if (!$article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        return response()->json([
            'id' => $article->id,
            'title' => $article->title,
            'content' => $article->content,
            'difficulty_level' => $article->difficulty_level,
            'language' => $article->language,
            'word_count' => $article->word_count,
        ]);
    }
}