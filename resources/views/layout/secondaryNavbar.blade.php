<?php 
$admin = $user && $user->hasRole('Admin');
?>
<div class='navbar navbar-dark navbar-expand-lg navbar-vertical' id='nav-vertical' style='--role: {{ $admin? "var(--success)": "var(--warning)"}}'>
    <button class="navbar-toggler navbar-vertical-btn" data-toggle="collapse" data-target="#nav-vertical" aria-controls="nav-vertical" aria-expanded="false" aria-label="Переключатель навигации">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class='collapse navbar-collapse w-100'>
        <div class=''>
                @if ($admin)
                    <h3 class='d-flex'>Категории<div class='btn-add btn-add-light btn-categories-add' data-toggle='modal' data-target='.categories-add-modal'></h3>
                @else 
                    <h3>Категории</h3>
                @endif
            <div class='categories'>
                @foreach ($categories as $category)
                    <div class='badge category border' data-id='{{ $category->id }}'
                        style='
                        --background-color: {{ $category->background_color }};
                        --font-color: {{ $category->font_color }};'
                        >
                        {{ $category->name }}
                    </div>
                @endforeach
            </div>
        </div>
        @if ($admin)
            <div class='my-4 border-top'></div>
            <div>
                @if (Route::currentRouteName() == 'news.comments.moderate')
                    <a href='/' class='btn btn-outline-light w-100'>Главная</a>
                @else
                    <a href='{{ route("news.comments.moderate") }}' class='btn btn-outline-success w-100'>Модерация</a>
                @endif
            </div>
        @endif
    </div>
</div>