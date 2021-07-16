<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AuthorizationController extends Controller
{
    function do(Request $request) {
        $request->validate([
            'login' => 'required',
            'password' => 'required',
        ]);
    }
}
