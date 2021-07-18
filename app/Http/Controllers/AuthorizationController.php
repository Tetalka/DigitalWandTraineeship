<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Cookie;

class AuthorizationController extends Controller
{
    function do(Request $request) {
        if ($request->cookie('login')) return abort(400);
        $validator = Validator::make($request->all(), [
            'login'=>'required',
            'password'=>'required'
        ]);
        if ($validator->passes()) {
            $user = User::where('email', '=', $request->login)->first();

            if ($user) {
                if (Hash::check($request->password, $user->password)) {
                    Cookie::queue('login', $user->id, 60*24);
                    /*$update = User::where('id', '=', $user->id)->first()->update(['remeber_token' => Cookie::get('login')]);
                    if ($update) {*/
                        return response([], 200);
                    /*}
                    else return abort(500);*/
                }
                else {
                    return response(['errors'=>'Неправильный логин или пароль'], 400);
                }
            }
            else {
                return response(['errors'=>'Неправильный логин или пароль'], 400);
            }
        }
        else {
            return response(['errors'=>$validator->errors()->toArray()], 400);
        }
    }
    function exit() {
        //$update = User::where('email', '=', $request->cookie('login'))->first()->update(['remeber_token' => null]);
        //Cookie::forget('login');
        Cookie::queue('login', null, -1);
        abort(200);
        //return response()->cookie('login', null, -1);
    }
}
