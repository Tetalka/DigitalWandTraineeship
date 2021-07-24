@extends('layout')

@section('content')
<div class='container-sm'>
    <?php 
        if ($logined && $user && $user->hasRole('Admin')) {
            echo "<h1 class='mb-2 d-flex justify-content-center'>Новости<div class='btn-news-add'></h1>";
        }
        else {
            echo "<h1 class='mb-2 text-center'>Новости</h1>";
        }
    ?>
    <div class='row'>
        @foreach ($news as $news_item)
            <div class=' col-12 col-md-6 p-3 mb-3'>
                <div class='card news-item shadow-sm'>
                    <div class='news-item__head no-wrap'>
                        <div class='news-item__title-wrap'><h3 class='news-item__title text-truncate'>{{ $news_item->title }}</h3></div>
                        <div class='news-item__title-comment-wrap text-muted'><strong class='news-item__title-comment text-truncate'>{{ $news_item->titleComment }}</strong></div>
                        <div class='float-right news-item__categories text-muted text-truncate'>
                        @foreach ($news_item->categories as $category)
                            <div class='badge news-item__category' style='
                                background-color: {{ $category->background_color }};
                                color: {{ $category->font_color}};
                            '>
                                {{ $category->name }}
                            </div>
                        @endforeach
                        </div>
                    </div>
                    <div class='news-item__content'>
                        <div class='news-item__image-wrap'>
                            <img src='images/{{ $news_item->image }}' class='img-fluid'>
                        </div>
                        <div class='w-100 news-item__text text-truncate'>
                            {{ $news_item->description }}
                        </div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>
@endsection