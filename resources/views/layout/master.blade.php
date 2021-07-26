<?php 
use App\Models\Category;

$categories = Category::get();
?>
<!DOCTYPE html>
<html lang='ru'>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-Piv4xVNRyMGpqkS2by6br4gNJ7DXjqk09RmUpJ8jgGtD7zP9yug3goQfGII0yAns" crossorigin="anonymous"></script>
    <?php 
      if ($user && $user->hasRole('Admin')) {
        echo "<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/css/bootstrap-select.min.css'>";
      }
    ?>
    <link rel="stylesheet" href="/css/main.css">
    <title>DigitalWand Laravel</title>
</head>
<body>
  <div class='navbar navbar-wrap'>
    <div class='navbar navbar-expand-md fixed-top bg-dark px-5'>
      <div class='d-flex ml-auto position-relative'>
        <?php
        if ($user) {
          echo "
          <div class='btn-group badge border user' data-toggle='dropdown' aria-expanded='false'>
            <div class='dropdown-toggle text-truncate navbutton' >{$user->name}</div>
            <ul class='dropdown-menu bg-dark user__menu'>
              <li class='dropdown-item user__item exitButton'>Выход</li>
            </ul>
          </div>
          ";
        }
        else echo "
          <div class='mr-3 navbutton login' data-toggle='modal' data-target='.login-regis-modal'>Войти</div>
          <div class='navbutton regis' data-toggle='modal' data-target='.login-regis-modal'>Регистрация</div>
          ";
        ?>
      </div>
    </div>
  </div>
@include('layout.secondaryNavbar')
@yield('content')
@yield('modals')
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4" crossorigin="anonymous"></script>
<script src='/scripts/module.js'></script>
<script src='/scripts/main.js'></script>
<?php 
  if($user && $user->hasRole('Admin')) {
    echo "
    <script src='/scripts/admin.js'></script>
    <script src='https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/js/bootstrap-select.min.js'></script>
    ";
  }
?>
</body>
</html>