<div class="modal fade login-regis-modal" tabindex="-1" aria-labelledby="login-regis-modalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="login-regis-modalLabel">Вход</h5>
        <button class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">X</span>
        </button>
      </div>
      <div class="modal-body">
        <form class="form login-form active-form">
            <label>
                Логин
                <input class='form-control' name='login'>
            </label>
            <label>
                Пароль
                <input  type="password" class='form-control' name='password'>
            </label>
        </form>
        <form class="form regis-form">
            <label>
                Имя
                <input class='form-control' name='name'>
            </label>
            <label>
                Почта
                <input class='form-control' name='email'>
            </label>
            <label>
                Пароль
                <input type="password" class='form-control' name='password'>
            </label>
            <label>
                Подтвердите пароль
                <input type="password" class='form-control' name='password-verify'>
            </label>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline-secondary" data-dismiss="modal">Закрыть</button>
        <button class="btn btn-outline-success btn-submit">Войти</button>
      </div>
    </div>
  </div>
</div>