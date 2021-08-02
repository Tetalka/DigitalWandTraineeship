<?php
use App\Models\Comment;
use App\Models\User;
use App\Models\NewsItem;

//$comments = Comment::where('approved', '=', false)->with('news_item.author')->get();
$comments = Comment::where('approved', '=', false)->get(['id', 'news_item', 'author', 'text', 'created_at']);
/*dd($comments[0]->hasManyThrough(
    User::class,
    NewsItem::class,
    'id',
    'id',
    'id',
    'author'
)->get());*/
$title = 'Модерация комментариев';
?>

@extends('layout.master')

@section('content')
    @section('page-title')
        {{ $title }}
    @endsection
    <div class='row m-0 comments'>
        @foreach ($comments as $comment)
            <div class='col-12 px-0 mb-4 shadow-sm card comment' data-id='{{ $comment->id }}'>
                <div class='px-4 my-4'>
                    <div class='row mb-4 mx-0'>
                        <h5 class='w-100'>{{ $comment->author()->name }}</h5>
                        <div class='w-100 text-muted'>{{ $comment->created_at }}</div>
                    </div>
                    <div class='row mx-0'>
                        <div>{{ $comment->text }}</div>
                    </div>
                </div>
                <div class='row m-0 py-2 px-4 border-top'>
                    <div class='ml-auto'>
                        <button class='btn btn-outline-danger mr-3 btn-reject'>Отклонить</button>
                        <button class='btn btn-outline-success btn-approve'>Принять</button>
                    </div>
                </div>
            </div>
        @endforeach
        @if ($comments->count() == 0)
            <h5 class='text-center'>Нет комментариев для модерации</h5>
        @endif
    </div>
@endsection

@section('scripts')
    <script src='/scripts/roles/admin/comment-moderate.js'></script>
@endsection