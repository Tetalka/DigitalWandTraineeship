<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsItem extends Model
{
    protected $table = 'news';
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

    /*
    * Get all comments of a news item
    *
    * @return \Illuminate\Database\Eloquent\Relations\HasMany
    */
    public function comments() {

        return $this->hasMany(Comment::class, 'news_item', 'id')->where('approved', '=', true);

    }

    /*
    * Get author of a news item
    *
    * @return \Illuminate\Database\Eloquent\Relations\HasOne
    */
    public function author() {

        return $this->hasOne(User::class, 'id', 'author')->get()->first();

    }
    
    /*
    * Get all news for specific category
    *
    * @return \Illuminate\Database\Eloquent\Relations\HasMany
    */
    /*public static function allForCategory($name) {

        $news = this::get();

        $returnedNews = [];

        foreach ($news as $new_item) {
            foreach ($new_item->categories()->get() as $category)
            {
                if ($category->name == $name)
                {
                    array_push($returnedNews, $new_item);
                    break;
                }
            }
        }

        return $returnedNews;
    }*/
}
