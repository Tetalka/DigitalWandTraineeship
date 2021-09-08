<?php

namespace App\Http\Controllers;

use Validator;
use Carbon\Carbon;
use App\Models\User;
use App\Models\UserCookies;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;


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

        $user = User::where('email', '=', $request->login)->orWhere('name', '=', $request->login)->first();
        if (!$user) {
            return response(['errors'=>'Неправильный логин или пароль'], 400);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response(['errors'=>'Неправильный логин или пароль'], 400);
        }

        $test = UserCookies::where('userId', '=', $user->id)->delete();
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

        Cookie::queue('login', null, -1);
        $cookie = Cookie::get('login');
        $delete = UserCookies::where('crypt', $cookie)->delete();
        abort(200);

    }
}
