<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Validator;
use App\Models\User;

class RegistrationController extends Controller
{
    public function create(Request $request) {
        if ($request->cookie('login')) return abort(400);
        $validator = Validator::make($request->all(), [
            'name'=>'required',
            'email'=>'required|email',
            'password'=>'required',
            'password-verify'=>'required|same:password'
        ], [
            'password-verify.same'=>'Пароли не совпадают'
        ]);

        if (!$validator->passes()) {
            return response(['errors'=>$validator->errors()->toArray()], 400);
        }



        $user = new User;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->created_at = now(); //date('d-m-Y H:i:s');

        if($request->role) {
            $user->role = $request->role;
        }
        
        $save = $user->save();
        if ($save) {
            return response(['data'=>['Регистрация прошла успешно']]);
        }
        return response(['errors'=>['Вас не удалось зарегистрировать']], 500);
    }
}
