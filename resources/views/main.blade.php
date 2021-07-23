@extends('layout')

@section('content')
<div class='container-sm'>
    <h1 class='mb-4'>Новости</h1>
    <div class='row'>
        @foreach ($news as $new)
            <div class=' col-12 col-md-6 p-3 mb-3'>
                <div class='card new shadow-sm'>
                    <div class='new__head no-wrap'>
                        <div class='new__title-wrap'><h3 class='new__title text-truncate'>{{ $new->title }}</h3></div>
                        <div class='new__title-comment-wrap text-muted'><strong class='new__title-comment text-truncate'>{{ $new->titleComment }}</strong></div>
                        <div class='float-right new__categories text-muted text-truncate'>
                        @foreach ($new->categories as $category)
                            <div class='badge new__category' style='
                                background-color: {{ $category->background_color }};
                                color: {{ $category->font_color}};
                            '>
                                {{ $category->name }}
                            </div>
                        @endforeach
                        </div>
                    </div>
                    <div class='new__content'>
                        <div class='new__image-wrap'>
                            <img src='images/{{ $new->image }}' class='img-fluid'>
                        </div>
                        <div class='w-100 new__text text-truncate'>
                            {{ $new->description }}
                        </div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>
@endsection