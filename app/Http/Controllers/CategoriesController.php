<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoriesController extends Controller
{
    public function create(Request $request) {
        $applied = [];
        $rejected = [];

        foreach($request->toAdd as $one) {
            $category = new Category;
            $category->name = $one;
            $added = $category->save(); //(bool)rand(0, 1)
            if (!$added) {
                array_push($rejected, $one);
                continue;
            }
            array_push($applied, [
                'name' => $one,
                'id' => $category->id
            ]);
        }
        return response(
            ['applied'=>$applied],
            ['rejected'=>$rejected]
        );
    }

    public function update(Request $request) {
        $rejected = [];

        foreach($request->toUpdate as $one) {
            $category = Category::find($one['id']);
            $category->name = $one['become'];
            $updated = $category->save();
            if (!$updated) {
                array_push($rejected, $one['id']);
            }
        }
        return response(['rejected'=>$rejected]);
    }

    public function delete(Request $request) {
        $rejected = [];

        foreach($request->toDelete as $one) {
            $category = Category::find($one);
            $deleted = $category->delete();
            if (!$deleted) {
                array_push($rejected, $one);
            }
        }
        return response(['rejected'=>$rejected]);
    }
}
