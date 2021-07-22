<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;
    public function getAll() {
        /*
        SELECT * FROM news JOIN (SELECT name, parentCategory, new FROM categories 
        JOIN (SELECT new, category FROM news_categories) AS categoryId ON id = category) 
        AS categories ON new = id
        */
        $news = this::with('category')->get();
        dd($news);
    }
}
