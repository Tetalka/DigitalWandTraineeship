

<div class='navbar navbar-dark navbar-expand-lg navbar-vertical' id='test1'>
    <button class="navbar-toggler navbar-vertical-btn" data-toggle="collapse" data-target="#test1" aria-controls="test1" aria-expanded="false" aria-label="Переключатель навигации">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class='collapse navbar-collapse w-100'>
        <?php 
            if ($user && $user->hasRole('Admin')) {
                echo "<h3 class='d-flex'>Категории<div class='btn-add btn-add-light btn-categories-add' data-toggle='modal' data-target='.categories-add-modal'></h3>";
            }
            else {
                echo "<h3>Категории</h3>";
            }
        ?>
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