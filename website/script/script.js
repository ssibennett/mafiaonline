var MAFIA_ONLINE = {
  INDEX: {{index}},
  JOB: "{{job}}",
  alive: [true, true, true, true, true],
  bgColor: {
    day: "#f0f8ff",
    vote: "#fffff0",
    night: "#e0e0e0"
  },
  $title: $("title"),
  $body: $("body"),
  $msg: $("input[name=msg]"),
  $msgSend: $("button[name=msgSend]"),
  $msgList: $("#msgList"),
  $job: $(".job"),
  $actionH2: $(".actionH2"),
  $readyToVote: $("<i class=\"material-icons readyToVote\">check_circle</i>"),
  $voteAction: $(".voteAction"),
  $action: $(".action"),
  $playerList: $("#playerList"),

  imAlive: function() {
    return MAFIA_ONLINE.alive[MAFIA_ONLINE.INDEX];
  },

  day: function() {
    var rcvMsg;

    MAFIA_ONLINE.$title.text("Mafia Game - Day");
    MAFIA_ONLINE.$voteAction.text("Ready");
    MAFIA_ONLINE.$body.css("background-color", MAFIA_ONLINE.bgColor.day);

    // If dead, disable all the player buttons
    if (!MAFIA_ONLINE.imAlive()) {
      MAFIA_ONLINE.$playerList.find("button").attr("disabled", "disabled");
    }

    // Event-handler for sending message
    function sendMsg() {
      // Shorten the message
      var msg = $.trim(MAFIA_ONLINE.$msg.val());
      // Discard empty messages
      if (msg.length == 0) {
        return;
      }
      // Send the message
      $.ajax({
        method: "POST",
        url: "sendMsg",
        data: {
          msg: msg
        },
        async: false,
        success: (data, status, xhr) => {
          if (data == "0") {
            console.log("Success!!!");
          } else {
            console.log("Something went wrong from the server.");
          }
        }
      });
      // Empty the message input box
      MAFIA_ONLINE.$msg.val("");
    }

    if (MAFIA_ONLINE.imAlive()) {
      MAFIA_ONLINE.$msgSend.removeAttr("disabled").click(sendMsg);
      MAFIA_ONLINE.$msg.removeAttr("disabled").keypress(event => {
        if (event.which == 13) {
          sendMsg();
        }
      });
    } else {
      MAFIA_ONLINE.$msgSend.attr("disabled", "disabled");
      MAFIA_ONLINE.$msg.attr("disabled", "disabled");
    }

    // Receiving message every 50 ms
    rcvMsg = setInterval(function() {
      $.ajax({
        method: "POST",
        url: "rcvMsg",
        dataType: "json",
        async: false,
        success: (data, status, xhr) => {
          console.log("Successfully received messages.");
          for (var i = 0; i < data.length; i++) {
            if (data[i][0] == MAFIA_ONLINE.INDEX) {
              MAFIA_ONLINE.$msgList.append(
                `<div class="row">
                  <div class="col-md-4"></div>
                  <div class="col-md-8">${data[i][1]}</div>
                </div>`
              );
            } else {
              MAFIA_ONLINE.$msgList.append(
                `<div class="row">
                  <div class="col-md-8"><span class="speaker">${data[i][0] + 1}</span> ${data[i][1]}</div>
                  <div class="col-md-4"></div>
                </div>`
              );
            }
          }
        }
      });
    }, 100);

    // Ready for Voting
    function readyToVote() {
      MAFIA_ONLINE.$readyToVote.off();

      var readyToVote = setInterval(function() {
        $.ajax({
          method: "POST",
          url: "readyToVote",
          async: false,
          success: (data, status, xhr) => {
            switch (data) {
              case "0": // Ready to enter
                // Load vote page
                MAFIA_ONLINE.vote();

                break;
              case "1": // Not ready
                console.log("waiting...");
                break;
              default: // Unknown error
                console.log("Something went seriously wrong!");
            }
          }
        });
      }, 500);
    }

    if (MAFIA_ONLINE.imAlive()) {
      MAFIA_ONLINE.$readyToVote.appendTo(MAFIA_ONLINE.$actionH2);
      MAFIA_ONLINE.$readyToVote.click(readyToVote);
    } else {
      readyToVote();
    }
  },

  vote: function() {
    MAFIA_ONLINE.$title.text("Mafia Game - Vote");
    MAFIA_ONLINE.$readyToVote.remove();
    MAFIA_ONLINE.$voteAction.text("Choose");
    MAFIA_ONLINE.$body.css("background-color", MAFIA_ONLINE.bgColor.vote);

    MAFIA_ONLINE.$msg.attr("disabled", "disabled").off();
    MAFIA_ONLINE.$msgSend.attr("disabled", "disabled").off();

    // Choose someone to vote
    if (MAFIA_ONLINE.imAlive()) {
      MAFIA_ONLINE.$playerList.find("button").click(function() {
        var player = $(this).index();

        $.ajax({
          method: "POST",
          url: "voteTo",
          data: {
            player: player
          },
          async: false,
          success: (data, status, xhr) => {
            switch (data) {
              case "0":
                console.log("Successfully voted.");

                $.ajax({
                  method: "POST",
                  url: "execute",
                  dataType: "json",
                  async: false,
                  success: (data, status, xhr) => {
                    for (var i = 0; i < data.length; i++) {
                      MAFIA_ONLINE.alive[data[i]] = false;
                      MAFIA_ONLINE.$playerList.find("button").eq(data[i])
                          .attr("disabled", "disabled")
                          .css("text-decoration", "line-through");

                      if (data[i] === MAFIA_ONLINE.INDEX) {
                        MAFIA_ONLINE.$playerList.find("button")
                            .attr("disabled", "disabled");
                        break;
                      }
                    }

                    MAFIA_ONLINE.night();
                  }
                });

                break;
              case "1":
                console.log("Voting error.");
                break;
              default:
                console.log("Something went seriously wrong!");
            }
          }
        });
      });
    }
  },

  night: function() {
    MAFIA_ONLINE.$title.text("Mafia Game - Night");
    MAFIA_ONLINE.$body.css("background-color", MAFIA_ONLINE.bgColor.night);

    // Do something, depending on your job
    if (MAFIA_ONLINE.imAlive()) {
      MAFIA_ONLINE.$playerList.find("button").off();

      switch (MAFIA_ONLINE.JOB) {
        case "Mafia":
          MAFIA_ONLINE.$action.text("Kill");
          break;
        case "Police":
          MAFIA_ONLINE.$action.text("Investigate");
          break;
        case "Doctor":
          MAFIA_ONLINE.$action.text("Save");
          break;
        case "Citizen":
          MAFIA_ONLINE.$playerList.find("button").attr("disabled", "disabled");
          alert("You are a citizen, so you can't do anything now.");
          break;
        default:
          console.log("You've got a wrong job!");
      }

      MAFIA_ONLINE.$playerList.find("button").click(function() {
        var target = $(this).index();

        $.ajax({
          method: "POST",
          url: "act",
          data: {
            target: target
          },
          async: false,
          success: (data, status, xhr) => {
            if (data != "0") {
              console.log("Error in action!");
              return;
            }

            var actResult = setInterval(function() {
              $.ajax({
                method: "POST",
                url: "actResult",
                dataType: "json",
                async: false,
                success: (data, status, xhr) => {
                  if (data === 1) {
                    console.log("Waiting for the result...");
                  } else {
                    clearInterval(actResult);

                    if (0 <= data.victim && data.victim < 5) {
                      MAFIA_ONLINE.alive[data.victim] = false;
                      MAFIA_ONLINE.$playerList.find("button").eq(data.victim)
                          .attr("disabled", "disabled")
                          .css("text-decoration", "line-through");
                    }

                    if (MAFIA_ONLINE.JOB == "Police" && data.police === true) {
                      alert("That person is a Mafia.");
                    }

                    MAFIA_ONLINE.day();
                  }
                }
              });
            }, 100);
          }
        });
      });
    }
  }
};

(function() {
  MAFIA_ONLINE.$job.text(MAFIA_ONLINE.JOB);
  MAFIA_ONLINE.$playerList.children().eq(MAFIA_ONLINE.INDEX).css(
    "background-color", "skyblue"
  );
  MAFIA_ONLINE.day();
})();
