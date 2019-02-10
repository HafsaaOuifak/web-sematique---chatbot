<?php
session_start();
  require_once('db_connect.php');
  if(empty($_GET['page'])) $page=1;
  else $page=$_GET['page'];
  $start_from = ($page-1) * $_SESSION['page_limit'];
  $sparql=$_SESSION['sparql_req'];
  $result = sparql_query($sparql);
  $fields = sparql_field_array( $result);
  print "<div class='table-responsive'>";
  print "<table class='table table-hover table-bordered'>";
  print "<tr>";
  foreach( $fields as $field )
  {
  	print "<th>$field</th>";
  }
  print "</tr>";
  $rows=sparql_fetch_all( $result );
  $stop_at=$start_from+$_SESSION['page_limit'];
  $length=count($rows);
  if ($stop_at>$length) $stop_at=$length;
  for($i=$start_from;$i<$stop_at;$i++)
  {
  	print "<tr>";
    $row=$rows[$i];
  	foreach( $fields as $field )
  	{
  		 print "<td>$row[$field]</td>";
  	}
  	print "</tr>";
  }
  $start_from++;
  print "<p>showing ".$start_from." to ".$stop_at." from ".sparql_num_rows( $result )." entities.</p>";
  print "</table>";
  print "</div>"
?>
