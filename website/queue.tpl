<!DOCTYPE html>
<html>
  <head>
    <title>Loading...</title>
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
    <script>
      $(() => {
        // Ping request
        var ping = setInterval(function() {
          // Waiting until ready
          $.ajax({
            method: "POST",
            url: "enterReady",
            async: false,
            success: (data, status, xhr) => {
              switch (data) {
                case "0": // Ready to enter
                  clearInterval(ping);
                  // Load day page
                  $.ajax({
                    method: "GET",
                    url: "day",
                    async: false,
                    success: (data, status, xhr) => {
                      // Load day page
                      $("body").html(data.substring(data.indexOf("<body>") + 6, data.indexOf("</body>")));
                      // Change the title
                      $("title").text("Mafia Game - Day");
                      // Load the script
                      $.ajax({
                        method: "GET",
                        url: "script/script.js",
                        dataType: "script",
                        async: false
                      });
                    }
                  });
                  break;
                case "1": // Not ready
                  console.log("waiting...");
                  break;
                case "2": // Error in enterReady()
                  console.log("Something went wrong in enterReady()!");
                  break;
                default: // Unknown error
                  console.log("Something went seriously wrong!");
              }
            }
          });
        }, 500);
      });
    </script>
  </head>
  <body>
    <h1 class="title">Mafia Online</h1>
    <h1 class="loading title">Wait</h1>
    <p>Tips:</p>
    <p>Mafia needs to act like citizen to not get cought.</p>
    <p>If you are a citizen, and have no job, that's the saddest thing that
       can happen in your life</p>
    <p>Police needs to find out who Mafia is, so the citizens can win</p>
    <p>I recommend doctors to heal yourself in the first night</p>
    <p>Mafias can trick citizens by telling fake things such as acting like a police.</p>
    <p>Mafia can kill themselves too!</p>
    <p>Police cannot find the jobs, but can find who the mafia is ;)</p>
    <p>I recommend the Doctors to heal the police officer, because they are the only one who can find the mafias</p>
    <p>Mafias need to kill all the citizens to win</p>
    <p>Citizens can vote, and execute all the mafias to win</p>
    <p>The person who gets the most votes, they get executed</p>
  </body>
</html>
