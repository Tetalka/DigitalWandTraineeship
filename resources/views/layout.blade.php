<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
    <link rel="stylesheet" href="/css/main.css">
    <title>DigitalWand Laravel</title>
</head>
<body>
<div class="navbar navbar-dark bg-dark px-3 mb-3">
    <div class='float-right d-flex ms-auto'>
        <div class='me-3 navbutton login' data-bs-toggle="modal" data-bs-target=".login-regis-modal">Войти</div>
        <div class='navbutton regis' data-bs-toggle="modal" data-bs-target=".login-regis-modal">Регистрация</div>
    </div>
</div>
<div class="modal fade login-regis-modal" tabindex="-1" aria-labelledby="login-regis-modalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="login-regis-modalLabel">Вход</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form class="form login-form active-form">
            <label>Логин<input class='form-control' name='login'></label>
            <label>Пароль<input  type="password" class='form-control' name='password'></label>
        </form>
        <form class="form regis-form">
            <label>Логин<input class='form-control' name='login'></label>
            <label>Пароль<input type="password" class='form-control' name='password'></label>
            <label>Подтвердите пароль<input type="password" class='form-control' name='password-verify'></label>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
        <button type="button" class="btn btn-success btn-submit">Войти</button>
      </div>
    </div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4" crossorigin="anonymous"></script>
<script src='/scripts/main.js'></script>
</body>
</html>