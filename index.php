<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>ERP - Construtora Cuiabá</title>
  <!-- Tell the browser to be responsive to screen width -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="./dist/img/favicon.ico" />
  <!-- Font Awesome -->
  <link rel="stylesheet" href="plugins/fontawesome-free/css/all.min.css">
  <!-- icheck bootstrap -->
  <link rel="stylesheet" href="plugins/icheck-bootstrap/icheck-bootstrap.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="dist/css/adminlte.min.css">

  <link rel="stylesheet" href="dist/css/erp.min.css">
</head>

<?php 
    $errorcode= isset($_GET['error']) ? $_GET['error'] : 0;
    $msgerro= isset($_GET['msg']) ? $_GET['msg'] : ($errorcode == 3 ? 'Tempo de sessão expirado!' : '');
?>

<body class="hold-transition login-page erp-blue-bgcolor">
<div class="login-box">
  <!-- /.login-logo -->
  <div class="card">
    <div class="card-body login-card-body">

        <form action="application/control/acesso/logar.php" method="post">
          <div class="mb-3 text-center">
            <a href="#"><img src="dist/img/erp.png" alt="Construtora Cuiabá"></a>
          </div>
            
        <div class="mb-3">
            <?php if($errorcode != 0){ echo '<div class="text-danger text-center">'.$msgerro.'</div>';}  ?>
        </div>
          
        <div class="input-group mb-3">
          <input type="text" class="form-control" name="email" placeholder="Usuário" required>
          <div class="input-group-append">
            <div class="input-group-text">
                <span class="fas fa-user erp-orange-color"></span>
            </div>
          </div>
        </div>
        <div class="input-group mb-3">
            <input type="password" class="form-control" name="password" placeholder="Senha" required="true" minlength="5">
          <div class="input-group-append">
            <div class="input-group-text">
              <span class="fas fa-lock erp-orange-color"></span>
            </div>
          </div>
        </div>
        <div class="row">
          <!-- /.col -->
          <div class="col-12">
              <button type="submit" class="btn btn-primary btn-block sesc-blue-bgcolor">Entrar</button>
          </div>
          <!-- /.col -->
        </div>
      </form>


    </div>
    <!-- /.login-card-body -->
  </div>
</div>
<!-- /.login-box -->

<!-- jQuery -->
<script src="plugins/jquery/jquery.min.js"></script>
<!-- Bootstrap 4 -->
<script src="plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- AdminLTE App -->
<script src="dist/js/adminlte.min.js"></script>

<div class="footer-copyright">
    Copyright © 2020 - <a href="#" target="_blank" class="text-white">ERP</a>
</div>
</body>

</html>
