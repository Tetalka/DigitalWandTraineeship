<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{   
    const CREATED_AT = null;
    const UPDATED_AT = null;
    
    /*
    * Get all categories of a news item
    *
    * @return \Illuminate\Database\Eloquent\Relations\HasMany
    */
    public function categories() {

        return $this->belongsToMany(Category::class, 'news_categories', 'news_item', 'category');

    }
    
    public function comments() {

        return $this->hasMany(Comment::class, 'news_item', 'id');

    }
}
