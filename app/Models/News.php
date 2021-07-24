<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    /*
    * Get all categories of a news item
    *
    * @return \Illuminate\Database\Eloquent\Relations\HasMany
    */
    public function categories() {

        return $this->belongsToMany(Category::class, 'news_categories', 'new', 'category');

    }
}
