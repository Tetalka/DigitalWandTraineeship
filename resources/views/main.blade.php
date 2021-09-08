<?php
use App\Models\User;
use App\Models\NewsItem;
use App\Models\Category;
    
$news = NewsItem::get();
$user = User::hasAuthorize();
$admin = $user && $user->hasRole('Admin');
$categories = Category::get();
$title = 'Новости';
?>

@extends('layout.master')

@section('content')
    @if ($admin) 
        @section('page-title')
            {{ $title }}<div class='btn-add btn-news-add'>
        @endsection
    @else 
        @section('page-title')
            {{ $title }}
        @endsection
    @endif
    <div class='row news'>
        @foreach ($news as $news_item)
            <div class='col-12 col-md-6 px-3 news-item-wrap'>
                <div class='card news-item shadow-sm' data-id='{{ $news_item->id }}'>
                    <div class='news-item__head no-wrap'>
                        <div class='news-item__title-wrap'>
                            <h3 class='news-item__title text-truncate interactable'>{{ $news_item->title }}</h3>
                            @if ($admin)
                            <div class='btn-group ml-2 news-item__actions'>
                                <div class="dropdown">
                                    <button class="btn btn-outline-success" data-toggle="dropdown">
                                        <i class='bi bi-three-dots'></i>
                                    </button>
                                    <div class="dropdown-menu font-italic">
                                        <button class="dropdown-item btn btn-outline-warning news-item__action btn-edit"><i class='bi bi-pencil'></i> Изменить</button>
                                        <button class="dropdown-item btn btn-outline-warning news-item__action btn-delete"><i class="bi bi-x-circle"></i> Удалить</button>
                                    </div>
                                </div>
                            </div>
                            @endif
                        </div>
                        <div class='news-item__subtitle-wrap text-muted interactable'><strong class='news-item__subtitle text-truncate'>{{ $news_item->subtitle }}</strong></div>
                        <div class='news-item__categories text-muted text-truncate'>
                        @foreach ($news_item->categories as $category)
                            <div class='badge news-item__category'
                                data-id='{{ $category->id }}'
                                style='
                                --background-color: {{ $category->background_color }};
                                --font-color: {{ $category->font_color }};'
                            >
                                {{ $category->name }}
                            </div>
                        @endforeach
                        </div>
                    </div>
                    <div class='news-item__content'>
                        <div class='news-item__image-wrap interactable'>
                            <img src='images/{{ $news_item->image }}' class='img-fluid news-item__image'>
                        </div>
                        <div class='w-100 news-item__text text-truncate'>
                            {{ $news_item->description }}
                        </div>
                    </div>
                    <div class='news-item__footer'>
                        <div class='d-flex justify-content-center'>
                            <div class='news-item__comments text-muted interactable'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-chat-square-text" viewBox="0 0 16 16">
                                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                    <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                                </svg>
                                <div class='text-center'>
                                    {{ $news_item->comments()->count() }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
@endsection

@section('modals')
        @if ($admin) 
            @include('forms.news-add')
            @include('forms.categories-add')
        @else 
            @include('forms.login-regis')
        @endif
        @include('forms.comment')
@endsection

@section('scripts')
    @if ($admin) 
        <script src='https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/js/bootstrap-select.min.js'></script>
        <script src='/scripts/roles/admin/main.js'></script>
    @endif
@endsection