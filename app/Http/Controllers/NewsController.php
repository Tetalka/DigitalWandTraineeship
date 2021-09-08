<?php

namespace App\Http\Controllers;

use Validator;
use App\Models\User;
use App\Models\Comment;
use App\Models\NewsItem;
use Illuminate\Http\Request;
//use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    public function create(Request $request) {
        $user = User::hasAuthorize();
        if (!$user || !$user->hasRole('Admin')) {
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
        $news_item->subtitle = $request->subtitle;
        $news_item->image = $image->getFilename();
        $news_item->description = $request->text;
        $news_item->author = $user->id;

        $created = $news_item->save();
        if($created) {
            $news_item->categories()->attach($request->categories);
            $created = $news_item->save();
            return response(['data'=>['Новость добавлена']]);
        }
        return response(['errors'=>['Не удалось добавить новость']], 500);
        
    }

    public function update(Request $request) {
        $user = User::hasAuthorize();
        if (!$user || !$user->hasRole('Admin')) {
            return response([], 403);
        }

        $validator = Validator::make($request->all(), [
            'title'=>'required',// ??? excluded if ??? sometimes
            'subtitle'=>'required',
            'image'=>'sometimes|required|file|image|dimensions:min_width=500,min_height=240|max:4096',
            'categories'=> 'required|array|min:1',
            'text'=>'required|min:600'
        ], [
            'image.required'=>'Необходимо выбрать файл',
            'image.dimensions'=>'Размер изображения должен быть от :min_widthx:min_height пикселей',
        ]);

        if(!$validator->passes()) {
            return response(['errors'=>$validator->errors()->toArray()], 400);
        }

        //frontend: flag new_image
        $image = null;
        if ($request->image)
        $image = $request->image->move(public_path('images'), rand().'.'.$request->image->extension());

        $news_item = NewsItem::find($request->id);
        if (!$news_item) return abort(404);
        if ($request->title) $news_item->title = $request->title;
        if ($request->subtitle) $news_item->subtitle = $request->subtitle;
        if ($request->categories) {
            $toAdd = collect([]);
            $categories = $news_item->categories();
            foreach($request->categories as $cat) {
                $contain = false;
                foreach($categories->get() as $itemCat) {
                    if ($itemCat->id == $cat) {
                        $contain = true;
                        break;
                    }
                }
                if (!$contain) $toAdd->push($cat);
            }
            $categories->attach($toAdd);
        }
        if ($image) $news_item->image = $image->getFilename();
        if ($request->text) $news_item->description = $request->text;
        $updated = $news_item->save();
        if($updated) {
            return response(['data'=>['Новость обновлена']]);
        }
        return response(['errors'=>['Не удалось обновить новость']], 500);
    }

    public function delete(Request $request) {
        $user = User::hasAuthorize();
        if (!$user || !$user->hasRole('Admin')) {
            return response([], 403);
        }

        $news_item = NewsItem::find($request->id);
        if (!$news_item) return abort(404);
        $deleted = $news_item->delete();
        if($deleted) {
            return response([]);
        }
        return response(['errors'=>['Не удалось удалить новость']], 500);
    }

    public function newComment(Request $request) {
        $user = User::hasAuthorize();
        if (!$user || !$user->hasRole('Admin')) {
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
