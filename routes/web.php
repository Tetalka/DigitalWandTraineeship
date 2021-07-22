<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthorizationController;
use App\Http\Controllers\RegistrationController;

use App\Models\News;

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
    return view('main', compact('news'));
});

Route::post('auth', [AuthorizationController::class, 'do'])->name('authorization.do');
Route::get('exit', [AuthorizationController::class, 'exit']);
Route::post('create', [RegistrationController::class, 'create'])->name('registration.create');