<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon;
use Illuminate\Database\Eloquent\Model;


class Comment extends Model
{
    const UPDATED_AT = null;

    /*public function getCreatedAtAttribute($date) // !!! работает не всегда
    {
        return Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $date);
    }
    public function created_at() {
        return $this->created_at->format('Y-m-d H:i:s');
    }*/
    
   /*
    * Get the news item the comment attached to
    *
    * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
    */
    public function newsItem() {

        return $this->belongsTo(NewsItem::class, 'news_item', 'id')->get()->first();

    }

   /*А оно надо?
    * Get the author of the Comment
    *
    * @return \Illuminate\Database\Eloquent\Relations\HasOne
    */
    public function author() {

        return $this->newsItem()->author();
        return $this->hasOneThrough(
            User::class,
            NewsItem::class,
            'id',
            'id',
            'id',
            'author'
        )->get()->first();

    }
}
