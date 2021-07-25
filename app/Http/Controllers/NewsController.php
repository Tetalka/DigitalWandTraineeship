<?php

namespace App\Http\Controllers;

use Validator;
use App\Models\User;
use App\Models\News;
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
        

        $new_item = new News;
        $new_item->title = $request->title;
        $new_item->titleComment = $request->subtitle;
        $new_item->categories()->attach($request->categories);
        $new_item->image = $image->getFilename();
        $new_item->description = $request->text;
        $new_item->author = $user->id;

        $created = $new_item->save();
        if($created) {
            return response(['data'=>['Новость добавлена']]);
        }
        return response(['errors'=>['Не удалось добавить новость']], 500);
    }
}
