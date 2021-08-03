<?php

namespace App\Http\Controllers;

use Validator;
use App\Models\User;
use App\Models\Comment;
use App\Models\NewsItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    public function create(Request $request) {

        $user = User::hasAuthorize();
        if (!$user) {
            return response([], 403);
        }

        $validator = Validator::make($request->all(), [
            'title'=>'required',
            'subtitle'=>'required',
            'image'=>'required|file|image|dimensions:min_width=500,min_height=240|max:4096',
            'categories'=> 'required|array|min:1',
            'text'=>'required|min:600'
        ], [
            'image.required'=>'Необходимо выбрать файл',
            'image.dimensions'=>'Размер изображения должен быть от :min_widthx:min_height пикселей',
        ]);

        //$image = $request->file('image');
        //$image = $request->image->store('public/images');

        //$image->storeAs('/public/images', );
        //$image->move('/public/images', rand().$image->extension());

        if(!$validator->passes()) {
            return response(['errors'=>$validator->errors()->toArray()], 400);
        }

        //$image = Storage::putFile('public/images', $request->image, 'public');
        $image = $request->image->move(public_path('images'), rand().'.'.$request->image->extension());
        

        $news_item = new NewsItem;
        $news_item->title = $request->title;
        $news_item->titleComment = $request->subtitle;
        $news_item->categories()->attach($request->categories);
        $news_item->image = $image->getFilename();
        $news_item->description = $request->text;
        $news_item->author = $user->id;

        $created = $news_item->save();
        if($created) {
            return response(['data'=>['Новость добавлена']]);
        }
        return response(['errors'=>['Не удалось добавить новость']], 500);
    }

    public function newComment(Request $request) {
        $user = User::hasAuthorize();
        if (!$user) {
            return response([], 403);
        }

        $validator = Validator::make($request->all(), [
            'text'=>'required|max:999',
        ]);
        if (!$validator->passes()) {
            return response(['errors'=>$validator->errors()->toArray()], 400);
        }

        $news_item = NewsItem::where('id', '=', $request->news_itemId)->get()->first();
        if (!$news_item) {
            return abort(404);
        }

        $comment = new Comment;
        $comment->author = $user->id;
        $comment->news_item = $news_item->id;
        $comment->text = $request->text;

        $added = $comment->save();
        if ($added) {
            return response(['date'=>$comment->created_at, 'approved'=>$comment->approved], 200);
        }
        return abort(500);
    }
}
