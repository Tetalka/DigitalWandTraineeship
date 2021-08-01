<div class='modal fade categories-add-modal' tabindex='-1' aria-labelledby='categories-add-modalLabel' aria-hidden='true'>
  <div class='modal-dialog'>
    <div class='modal-content'>
      <div class='modal-header'>
        <h5 class='modal-title' id='categories-add-modalLabel'>Новая новость</h5>
        <button class='close' data-dismiss='modal' aria-label='Close'>
          <span aria-hidden='true'>X</span>
        </button>
      </div>
      <div class='modal-body'>
        <div class='row flex-wrap px-2 pb-3 mx-0 '>
            @foreach($categories as $category) 
                <div class='badge category border p-0 pl-3' value='{{ $category->name }}' data-id='{{ $category->name }}'
                    style='
                    --background-color: {{ $category->background_color }};
                    --font-color: {{ $category->font_color }};'
                    >
                    {{ $category->name }}
                    <div class="btn-group pl-3" role="group" aria-label="Basic example">
                        <button class="btn btn-outline-warning btn-edit"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-outline-danger btn-delete"><span aria-hidden='true'>X</span></button>
                    </div>
                </div>
            @endforeach
        </div>
        <div class='modal-footer justify-content-center px-2 py-0 pt-3'>
          <div class='categories-add-form w-100'>
            <label class='d-flex flex-row align-items-center justify-content-between m-0'>
                Название
                <input class='form-control w-auto mt-0' name='name'>
                <button class='btn btn-insert btn-outline-success'>Добавить</button>
            </label>
          </div>
        </div>
      </div>
      <div class='modal-footer'>
        <button class='btn btn-outline-secondary' data-dismiss='modal'>Закрыть</button>
        <button class='btn btn-outline-success btn-submit'>Сохранить</button>
      </div>
    </div>
  </div>
</div>