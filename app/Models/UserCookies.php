<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserCookies extends Model
{
    use HasFactory;

    protected $table = 'users_cookies';
    const CREATED_AT = null;
    const UPDATED_AT = null;
}
