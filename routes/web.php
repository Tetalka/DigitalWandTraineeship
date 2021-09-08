<?php

use App\Models\User;
use App\Models\NewsItem;
use App\Models\Comment;
use App\Models\UserCookies;
use App\Http\Controllers\CommentsController;
use App\Http\Controllers\AuthorizationController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\NewsController;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/*Route::get('/', function () {
    return view('welcome');
});*/

Route::get('/', function() {

    return view('main');
    
});

Route::prefix('user')->group(function () {
    Route::post('auth', [AuthorizationController::class, 'do']);
    Route::post('create', [RegistrationController::class, 'create']);
    Route::get('exit', [AuthorizationController::class, 'exit']);
});

Route::prefix('news')->group(function () {
    Route::get('/category/{categoryId}', [NewsController::class, 'withCategory']);
    Route::post('create', [NewsController::class, 'create']);
    Route::delete('{id}', [NewsController::class, 'delete']);
    Route::post('update/{id}', [NewsController::class, 'update']);
    Route::prefix('comments')->group(function () {
        Route::prefix('moderate')->group(function () {
            Route::get('/', function() {

                $user = User::hasAuthorize('Admin');
                if (!$user) return response([], 403);
                return view('comments-moderate', compact('user'));

            })->name('news.comments.moderate');

            Route::put('/', [CommentsController::class, 'approve']);
            Route::delete('/', [CommentsController::class, 'reject']);
        });
        Route::get('/{id}', function($id) { // !!! Тут проблема, что он всё принимает за параметр
                
            $newsItem = NewsItem::find($id);
            if (!$newsItem) {
                return abort(404);
            }
            //$comments = News::where('id', '=', $id)->with('comments')->get();
            //$comments = $new_item->comments()->get(['author', 'text', 'created_at']);
            $comments = $newsItem->comments()->latest()->get();

            $return = [];
            
            foreach($comments as $comment) {
                array_push($return, [
                    'author' => $comment->author()->name, //!!! Лучше, наверное, через select и join //Да, лучше
                    'text' => $comment->text,
                    'date' => $comment->created_at,
                ]);
            }

            //return response($comments->toJson());
            return response($return);
        });

        Route::post('create', [NewsController::class, 'newComment']);
    });
});

Route::prefix('categories')->group(function () {
    Route::post('/', [CategoriesController::class, 'create']);
    Route::put('/', [CategoriesController::class, 'update']);
    Route::delete('/', [CategoriesController::class, 'delete']);
});