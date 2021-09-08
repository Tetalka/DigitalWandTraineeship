<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\UserCookies;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Foundation\Auth\User as Authenticatable;
//use Illuminate\Contracts\Auth\MustVerifyEmail;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Notifications\Notifiable;
/*
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $password
 */
class User extends Authenticatable
{
    //use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /*
    * Get all roles of user
    *
    * @return \Illuminate\Database\Eloquent\Relations\HasMany
    */
    public function roles() {

        return $this->belongsToMany(Role::class, 'users_roles', 'user', 'role');

    }

    /*
    * Check if user has a specific role
    *
    * @return bool
    */
    public function hasRole($name) {

        foreach ($this->roles()->get() as $role)
        {
            if ($role->role == $name)
            {
                return true;
            }
        }

        return false;

    }

    /*
    * Check if user has authorized by cookie 'Login'
    *
    * @return App\Models\User or null
    */
    public static function hasAuthorize($role = null) {

        $logined = UserCookies::where('crypt', '=', Cookie::get('login'))->where('expire', '>', Carbon::now())->first();
        if (!$logined) {
            return null;
        }
        $user = User::find($logined->userId);
        if ($role) return $user->hasRole($role)? $user : false;
        return $user;

    }
}
