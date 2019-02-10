<?php
session_start();
require_once('db_connect.php');
$result=sparql_query($_POST['sparql_req']);
if( !$result ) {print  sparql_errno().": " +sparql_error()."\n"; exit; }
$rows_number=sparql_num_rows( $result );
$page_limit=50;
$pages=ceil($rows_number/$page_limit);
$_SESSION['sparql_req']=$_POST['sparql_req'];$_SESSION['pages']=$pages;
$_SESSION['total_rows']=$rows_number;$_SESSION['page_limit']=$page_limit;
?>
