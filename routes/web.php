<?php

use App\Models\User;
use App\Models\News;
use App\Models\UserCookies;
use App\Http\Controllers\AuthorizationController;
use App\Http\Controllers\RegistrationController;
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
    $news = News::get();
    $logined = UserCookies::where('crypt', '=', Cookie::get('login'))->where('expire', '>', Carbon::now())->first();
    $user = null;
    if ($logined) {
        $user = User::find($logined->userId);
    }
    return view('main', compact('news', 'logined', 'user'));
});

Route::post('auth', [AuthorizationController::class, 'do'])->name('authorization.do');
Route::get('exit', [AuthorizationController::class, 'exit']);
Route::post('create', [RegistrationController::class, 'create'])->name('registration.create');