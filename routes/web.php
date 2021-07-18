<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthorizationController;
use App\Http\Controllers\RegistrationController;

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

Route::post('auth', [AuthorizationController::class, 'do'])->name('authorization.do');
Route::get('exit', [AuthorizationController::class, 'exit']);
Route::post('create', [RegistrationController::class, 'create'])->name('registration.create');