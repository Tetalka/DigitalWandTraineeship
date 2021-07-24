<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = new User;
        $user->name = 'Admin';
        $user->email = 'admin@admin.ru';
        $user->password = Hash::make('Admin');
        $user->created_at = now();
        $user->save();

        $role = new Role;
        $role->role = 'Admin';
        $role->save();

        $user->roles()->attach($role->id);
    }
}
