<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Mafia game</title>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
     <link rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Lobster">
    <style> body {background-color: #E0E0E0;} </style>
  </head>
  <body>

    <!--custom section-->
    <div class="container">
      <h1 class="text-center">Mafia game</h1>
      <hr>
      <div class="container">
        <div class="row font-weight-bold" style="font-size : 1.25em;">
          <div class="col-sm text-center" style="color:#2a6aff;"> Day </div>
          <div class="col-sm text-center" style="color:#98503C;"> Vote </div>
          <div class="col-sm text-center" style="color:#000000;"> Night </div>
        </div>
      </div>

      <div class="row" style="height : 40em;">
        <div class="col-8 col-md-8">
          <div class="card mt-3" style="height : 80%; overflow-y: scroll">
          </div>
          <div class="form-group mt-1">
            <input class="form-control" id="exampleFormControlTextarea1" rows="1"></input>
          </div>
          <div class=text-right>
            <button type="button" class="btn btn-primary" style="cursor: pointer;">submit</button>
          </div>
        </div>

        <div class="col-md-4 mt-3">
          <h2 class="text-center" style="font-family : Lobster;">You are <span style="color : red; font-size : 1.25em;"> Mafia </span></h2>
          <h2 class="text-center" style="font-family : Lobster; font-size: 1.5em"> Select To <span style="color : red; font-size : 1.25em;"> Kill </span> </h2> 
          <div class="card mt-3" style="height : 80%;">
            <ul class="list-group list-group-flush text-center">
              <li class="list-group-item"><button class="btn" style= "background-color : #A0A0A0;">PLAYER 1</button> </li>
              <li class="list-group-item"><button class="btn" style= "background-color : #A0A0A0;">PLAYER 2</button></li>
              <li class="list-group-item"><button class="btn" style= "background-color : #A0A0A0;">PLAYER 3</button></li>
              <li class="list-group-item"><button class="btn" style= "background-color : #A0A0A0;">PLAYER 4</button></li>
              <li class="list-group-item"><button class="btn" style= "background-color : #A0A0A0;">PLAYER 5</button></li>
            </ul>
          </div>
        </div>
      </div>

    </div>
    <!--end-->

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>
  </body>
</html>