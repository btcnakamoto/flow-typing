<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypingArticle extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'difficulty_level',
        'category',
        'language',
        'word_count',
        'average_word_length',
        'is_active',
        'times_practiced',
        'average_accuracy',
        'average_wpm',
        'tags',
    ];

    protected $casts = [
        'difficulty_level' => 'integer',
        'word_count' => 'integer',
        'average_word_length' => 'float',
        'is_active' => 'boolean',
        'times_practiced' => 'integer',
        'average_accuracy' => 'float',
        'average_wpm' => 'float',
        'tags' => 'array',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByDifficulty($query, $level)
    {
        return $query->where('difficulty_level', $level);
    }

    public function scopeByLanguage($query, $language)
    {
        return $query->where('language', $language);
    }
}