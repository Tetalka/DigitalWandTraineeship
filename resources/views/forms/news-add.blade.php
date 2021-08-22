<div class='news-add-window'>
  <h4 class='text-center'>Новая новость</h4>
  <div class=''>
    <form class='form news-item-form'>
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
            <input type='file' accept='image/*' class='form-control' name='image'>
        </label>
        <label>
            Текст
            <textarea class='form-control' name='text'></textarea>
        </label>
    </form>
  </div>
  <div class='mt-4'>
    <button class='btn btn-outline-success btn-submit'>Отправить</button>
  </div>
</div>