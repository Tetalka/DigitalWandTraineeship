<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentsController extends Controller
{  

    public function reject(Request $request) {

        $user = User::hasAuthorize();
        if (!$user) {
            return abort(403);
        }
        
        $comment = Comment::find($request->id);
        $rejected = $comment->delete();
        if(!$rejected) {
            return abort(500);
        }
        return response([], 200);

    }

    public function approve(Request $request) {

        $user = User::hasAuthorize();
        if (!$user) {
            return abort(403);
        }

        $comment = Comment::find($request->id);
        $comment->approved = true;
        $approved = $comment->save();
        if(!$approved) {
            return abort(500);
        }
        return response([], 200);
    }

}
