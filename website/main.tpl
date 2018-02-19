<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Mafia Game - Day</title>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lobster">

    <!-- Google Icons CSS -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>
    <script src="static_file/script.js"></script>
  </head>
  <body>

    <!--custom section-->
    <div class="container">
      <h1 class="text-center">Mafia game</h1>
      <hr>
      <div class="container">
        <div class="row font-weight-bold" style="font-size : 1.25em;">
          <div class="col-sm text-center" style="color:#2a6aff;">Day</div>
          <div class="col-sm text-center" style="color:#98503C;">Vote</div>
          <div class="col-sm text-center" style="color:#000000;">Night</div>
        </div>
      </div>

      <div class="row" style="height: 40em;">
        <div class="col-8 col-md-8">
          <div class="card mt-3" id="msgList" style="height: 80%; overflow-y: scroll;">
          </div>
          <div class="form-group mt-1">
            <input type="text" name="msg" class="form-control" id="exampleFormControlTextarea1" rows="1"></input>
          </div>
          <div class=text-right>
            <button type="button" name="msgSend" class="btn btn-primary" style="cursor: pointer;">submit</button>
          </div>
        </div>

        <div class="col-md-4 mt-3">
          <h2 class="text-center" style="font-family: Lobster;">
            You are <span class="job" style="color: red; font-size: 1.25em;"></span>
          </h2>
          <h2 class="text-center actionH2" style="font-family: Lobster; font-size: 1.5em">
            <span class="voteAction">Ready</span> To <span class="action" style="color: #8B6742; font-size: 1.25em;">Vote</span>
          </h2>
          <div class="card mt-3" style="height: 80%;">
            <ul class="list-group list-group-flush text-center" id="playerList">
              <li class="list-group-item"><button class="btn" type="button" style="background-color: #d5c4a1;">PLAYER 1</button></li>
              <li class="list-group-item"><button class="btn" type="button" style="background-color: #d5c4a1;">PLAYER 2</button></li>
              <li class="list-group-item"><button class="btn" type="button" style="background-color: #d5c4a1;">PLAYER 3</button></li>
              <li class="list-group-item"><button class="btn" type="button" style="background-color: #d5c4a1;">PLAYER 4</button></li>
              <li class="list-group-item"><button class="btn" type="button" style="background-color: #d5c4a1;">PLAYER 5</button></li>
            </ul>
          </div>
        </div>
      </div>

    </div>
    <!--end-->

    <!-- style -->
    <style>
      body {
        background-color: #f0f8ff;
      }

      #msgList {
        overflow: scroll;
      }

      #msgList .row {
        margin: 5px 0px;
      }

      #msgList .col-md-8 {
        border-top: 5px solid black;
        border-bottom: 5px solid black;
      }

      #msgList .speaker {
        font-weight: bold;
        color: blue;
      }

      .readyToVote:hover {
        color: blue;
      }
    </style>
  </body>
</html>
