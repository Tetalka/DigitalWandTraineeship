@extends('layout')

@section('content')
<div class='container'>
    <h1 class='mb-4'>Новости</h1>
    <div class='row'>
        @foreach ($news as $new)
            <div class=' col-6 p-3 mb-3'>
                <div class='card new shadow-sm'>
                    <div class='row no-wrap'>
                        <div class='new__head'>
                            <div class='new__title-wrap'><h3 class='new__title text-truncate'>{{ $new->title }}</h3></div>
                            <div class='new__title-comment-wrap text-muted'><strong class='new__title-comment text-truncate'>{{ $new->titleComment }}</strong></div>
                        </div>
                        <div class='float-right new__category text-muted text-truncate'>
                        <!--foreach ($news->categories as $category)
                            $category
                        endforeach-->
                        </div>
                    </div>
                    <div class='new__content'>
                        <div class='row'>
                            <div class='col-6 new__image-wrap'>
                                <img src='images/{{ $new->image }}' class='position-absolute left-0 img-fluid'>
                            </div>
                            <div class='col-6 w-100 new__text text-truncate'>
                                {{ $new->description }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>
@endsection