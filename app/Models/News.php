<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    /*
    * Get all of the categories for the NewsController
    *
    * @return \Illuminate\Database\Eloquent\Relations\HasMany
    */
    public function categories() {

        return $this->belongsToMany(Category::class, 'news_categories', 'new', 'category');

    }
}
