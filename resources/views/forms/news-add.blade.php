<?php 
use App\Models\Category;

$categories = Category::get();
?>
<div class="modal fade news-add-modal" tabindex="-1" aria-labelledby="news-add-modalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="news-add-modalLabel">Новая новость</h5>
        <button class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form class="form news-item-form">
            <label>
                Заголовок
                <input class='form-control' name='title'>
            </label>
            <label>
                Подзаголовок
                <input class='form-control' name='subtitle'>
            </label>
            <label>
                Категории
                <select class='w-100' name='categories[]' multiple>
                  @foreach ($categories as $category)
                    <option value='{{ $category->id }}'>{{ $category->name }}</option>
                  @endforeach
                </select>
            </label>
            <label>
                Картинка
                <input type="file" accept="image/*" class='form-control' name='image'>
            </label>
            <label>
                Текст
                <textarea class='form-control' name='text'></textarea>
            </label>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
        <button class="btn btn-success btn-submit">Отправить</button>
      </div>
    </div>
  </div>
</div>