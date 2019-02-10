<?php
session_start();
?>
<html lang="en">
<head>
  <title>Movies ontology</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
  <script src="jquery.simplePagination.js"></script>
  <script>
  $(document).ready(function(){
    $("#button1").click(function(){
      var sparql_req=document.getElementById('sparql_request').value;
      $("#results1").load("pages_count.php",{
        sparql_req: sparql_req
      },function(){
        location.reload(true);
      })
    });
  })
  </script>
</head>
<body >
  <div class="container">
    <h1>Movies ontology</h1>
    <h4>Here you can execute your sparl requests</h4>
<?php if(!isset($_SESSION['pages'])):?>
  <form>
    <div class="form-group">
      <textarea class="form-control" rows="5" id="sparql_request">select distinct * where {
?x ?y ?z
} limit 25</textarea>
  </div>
  </form>
  <button  id="button1" class="btn btn-default">Submit</button>
  <div id="results1">
  </div>
<?php else:$total_pages=$_SESSION['pages'];unset($_SESSION['pages']);?>
  <script>
  $(document).ready(function(){
    $("#button2").click(function(){
      var sparql_req=document.getElementById('sparql_request2').value;
      $("#results").load("pages_count.php",{
        sparql_req: sparql_req
      },function(){
        location.reload(true);
      })
    });
    $('.pagination').pagination({
     items: <?php echo $_SESSION['total_rows'];?>,
     itemsOnPage: <?php echo $_SESSION['page_limit'];?>,
     cssStyle: 'light-theme',
     currentPage : 1,
     onPageClick : function(pageNumber) {
         jQuery("#results").html('loading...');
         jQuery("#results").load("pagination.php?page=" + pageNumber);
     },
     onInit :function() {
         jQuery("#results").html('loading...');
         jQuery("#results").load("pagination.php?page=1");
     }
   });
  });
  </script>
  <form>
    <div class="form-group">
      <textarea class="form-control" rows="5" id="sparql_request2"><?php echo $_SESSION['sparql_req'];?></textarea>
  </div>
  </form>
  <button id="button2" class="btn btn-default">Submit</button>
    <div id="results">
    </div>
    <nav><ul class="pagination">
    <?php for($i=1; $i<=$total_pages; $i++):
                if($i == 1):?>
                <li class='active'  id="<?php echo $i;?>"><a href='pagination.php?page=<?php echo $i;?>'><?php echo $i;?></a></li>
                <?php else:?>
                <li id="<?php echo $i;?>"><a href='pagination.php?page=<?php echo $i;?>'><?php echo $i;?></a></li>
            <?php endif;?>
    <?php endfor;?>
    </ul></nav>
<?php endif;?>
  </div>
</body>
</html>
