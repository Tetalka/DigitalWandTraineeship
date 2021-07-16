<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Illuminate\Support\MessageBag;
use App\Models\User;
//use Illuminate\Contracts\Validation\Validator;

class RegistrationController extends Controller
{
    /*protected function validator(array $data) {
        return Validator::make($data, [
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'
        ]);
    }

    public function save(Request $request) {
        $validateFields = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::create()
    }*/

    function create(Request $request) {
        dd($request->all());
        /*$validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required',
            'password-verify' => 'required'
        ]);

        $user = new $user;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = $request->password;*/
        //$user->created_at = time();
        //$query = $user->save();

        //if ($query) return 
    }
}
