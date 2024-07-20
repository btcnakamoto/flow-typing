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


    //分页
    public function getPaginatedArticle($id, Request $request)
    {
        $start = $request->query('start', 0);
        $length = $request->query('length', 1000);

        $article = TypingArticle::find($id);

        if (!$article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        $content = mb_substr($article->content, $start, $length);
        $hasMore = $start + $length < mb_strlen($article->content);

        return response()->json([
            'id' => $article->id,
            'title' => $article->title,
            'content' => $content,
            'difficulty_level' => $article->difficulty_level,
            'language' => $article->language,
            'word_count' => $article->word_count,
            'has_more' => $hasMore,
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