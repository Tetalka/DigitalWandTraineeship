<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\UserCookies;
use Illuminate\Support\Facades\Cookie;
use Carbon\Carbon;

class AuthorizationController extends Controller
{
    public function do(Request $request) {
        $cookieLogin = 'login';
        if ($request->cookie($cookieLogin)) {
            return abort(400);
        }

        $validator = Validator::make($request->all(), [
            'login'=>'required',
            'password'=>'required'
        ]);

        if (!$validator->passes()) {
            return response(['errors'=>$validator->errors()->toArray()], 400);
        }

        $user = User::where('email', '=', $request->login)->first();
        if (!$user) {
            return response(['errors'=>'Неправильный логин или пароль'], 400);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response(['errors'=>'Неправильный логин или пароль'], 400);
        }
        $nameCrypt = Crypt::encrypt($user->name);
        Cookie::queue($cookieLogin, $nameCrypt, 60*24);
        $update = UserCookies::upsert([
                ['userId' => $user->id, 'name' => $cookieLogin, 'crypt' => $nameCrypt, 'expire' => Carbon::now()->addMinutes(60*24)],
            ],
            ['userId', 'name', 'crypt', 'expire']
        );
        if (!$update) {
            Cookie::unqueue($cookieLogin);
        }
        return response([], 200);
    }
    public function exit() {
        //$update = User::where('email', '=', $request->cookie('login'))->first()->update(['remeber_token' => null]);
        //Cookie::forget('login');
        Cookie::queue('login', null, -1);
        $cookie = Cookie::get('login');
        $delete = UserCookies::where('crypt', $cookie)->delete();
        abort(200);
        //return response()->cookie('login', null, -1);
    }
}
