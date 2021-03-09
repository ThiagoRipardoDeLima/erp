<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$id = 0;
if(isset($_POST['id'])){
    $id = $_POST['id'];
}

require_once '../../../model/pessoaFisica.php';
$pf = new pessoaFisica();
$pf->setPfid($id);
$pf->carregaPFbyIP();
$funcionarioassinatura= $pf->getPfassinatura();

echo $funcionarioassinatura;