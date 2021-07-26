<div class='navbar navbar-vertical'>
    <div class='w-100'>
        <h3>Категории</h3>
        <div class='categories'>
            @foreach ($categories as $category)
                <div class='badge category border' 
                    style='
                    --background-color: {{ $category->background_color }};
                    --font-color: {{ $category->font_color }};'
                    >
                    {{ $category->name }}
                </div>
            @endforeach
        </div>
    </div>
  </div>