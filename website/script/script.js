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

  randTime: Math.floor(Math.random() * 750 + 1000),

  day: function() {
    var rcvMsg;

    MAFIA_ONLINE.$title.text("Mafia Game - Day");
    MAFIA_ONLINE.$voteAction.text("Ready");
    MAFIA_ONLINE.$action.text("vote").css("text-decoration-line", "none");
    MAFIA_ONLINE.$body.css("background-color", MAFIA_ONLINE.bgColor.day);

    if (!MAFIA_ONLINE.imAlive()) {
      MAFIA_ONLINE.$playerList.find("button").attr("disabled", "disabled");
    } else if (MAFIA_ONLINE.JOB === "Citizen") {
      for (var i = 0; i < 5; i++) {
        if (MAFIA_ONLINE.alive[i]) {
          MAFIA_ONLINE.$playerList.find("button").eq(i).removeAttr("disabled");
        }
      }
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

    // Receiving message periodically
    rcvMsg = setInterval(function() {
      $.ajax({
        method: "POST",
        url: "rcvMsg",
        dataType: "json",
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
    }, MAFIA_ONLINE.randTime);

    // Ready for Voting
    function readyToVote() {
      MAFIA_ONLINE.$readyToVote.off();
      alert("You are ready to vote.");

      // Ping
      var readyToVote = setInterval(function() {
        $.ajax({
          method: "POST",
          url: "readyToVote",
          success: (data, status, xhr) => {
            switch (data) {
              case "0": // Ready to enter
                // stop pinging
                clearInterval(readyToVote);
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
      }, MAFIA_ONLINE.randTime);
    }

    if (MAFIA_ONLINE.imAlive()) {
      MAFIA_ONLINE.$readyToVote.appendTo(MAFIA_ONLINE.$actionH2);
      MAFIA_ONLINE.$readyToVote.click(readyToVote);
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
        var $this = $(this);
        var player = MAFIA_ONLINE.$playerList.find("button").index(this);
        alert(`Voted for Player ${player + 1}.`);

        $.ajax({
          method: "POST",
          url: "voteTo",
          data: {
            player: player
          },
          success: (data, status, xhr) => {
            switch (data) {
              case "0":
                console.log("Successfully voted.");
                $this.off();

                var execute = setInterval(function() {
                  $.ajax({
                    method: "POST",
                    url: "execute",
                    dataType: "json",
                    success: (data, status, xhr) => {
                      if (data != 1) {
                        clearInterval(execute);

                        for (var i = 0; i < data.deads.length; i++) {
                          MAFIA_ONLINE.alive[data.deads[i]] = false;
                          MAFIA_ONLINE.$playerList.find("button").eq(data.deads[i])
                              .attr("disabled", "disabled")
                              .css("text-decoration", "line-through");

                          if (data.deads[i] === MAFIA_ONLINE.INDEX) {
                            MAFIA_ONLINE.$playerList.find("button")
                                .attr("disabled", "disabled");
                            MAFIA_ONLINE.$action.css("text-decoration-line", "line-through");
                            alert("You are executed.");
                          }
                        }

                        if (data.winner === null) {
                          MAFIA_ONLINE.night();
                        } else {
                          $("*").off();
                          alert(`${data.winner} won!!!`);
                        }
                      }
                    }
                  });
                }, MAFIA_ONLINE.randTime);
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
          MAFIA_ONLINE.$action.css("text-decoration-line", "line-through");
          MAFIA_ONLINE.$playerList.find("button").attr("disabled", "disabled");
          alert("You are a citizen, so you can't do anything now.");
          break;
        default:
          console.log("You've got a wrong job!");
      }

      MAFIA_ONLINE.$playerList.find("button").click(function() {
        var target = MAFIA_ONLINE.$playerList.find("button").index(this);

        var msg = `You chose Player ${target + 1} to `;

        switch (MAFIA_ONLINE.JOB) {
          case "Mafia":
            msg += "kill.";
            break;
          case "Police":
            msg += "investigate.";
            break;
          case "Doctor":
            msg += "save.";
            break;
          default:
            msg = "You're not supposed to click that button!";
        }

        alert(msg);

        $.ajax({
          method: "POST",
          url: "act",
          data: {
            target: target
          },
          success: (data, status, xhr) => {
            if (data != "0") {
              console.log("Error in action!");
              return;
            }

            MAFIA_ONLINE.$playerList.find("button").off();

            var actResult = setInterval(function() {
              $.ajax({
                method: "POST",
                url: "actResult",
                dataType: "json",
                success: (data, status, xhr) => {
                  if (data === 1) {
                    console.log("Waiting for the result...");
                  } else {
                    console.log("Got the result!!!");
                    clearInterval(actResult);

                    if (data.victim === null) {
                      if (MAFIA_ONLINE.JOB == "Doctor") {
                        alert("You saved a person.");
                      }
                    } else if (0 <= data.victim && data.victim < 5) {
                      if (MAFIA_ONLINE.JOB == "Mafia") {
                        alert("You murdered Player " + (data.victim + 1));
                      } else if (MAFIA_ONLINE.JOB == "Doctor") {
                        alert("You failed to save a person.");
                      }

                      MAFIA_ONLINE.alive[data.victim] = false;
                      MAFIA_ONLINE.$playerList.find("button").eq(data.victim)
                          .attr("disabled", "disabled")
                          .css("text-decoration", "line-through");
                    }

                    if (MAFIA_ONLINE.JOB == "Police") {
                      if (data.police) {
                        alert("You found a mafia.");
                      } else {
                        alert("You didn't find a mafia.");
                      }
                    }

                    if (data.winner === null) {
                      MAFIA_ONLINE.day();
                    } else {
                      $("*").off();
                      alert(`${data.winner} won!!!`);
                    }
                  }
                }
              });
            }, MAFIA_ONLINE.randTime);
          }
        });
      });

      if (MAFIA_ONLINE.JOB == "Citizen") {
        var actResult = setInterval(function() {
          $.ajax({
            method: "POST",
            url: "actResult",
            dataType: "json",
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

                  if (data.victim === MAFIA_ONLINE.INDEX) {
                    MAFIA_ONLINE.$playerList.find("button")
                        .attr("disabled", "disabled");
                    MAFIA_ONLINE.$action.css("text-decoration-line", "line-through");
                    alert("You are murdered.");
                  }
                }

                if (data.winner === null) {
                  MAFIA_ONLINE.day();
                } else {
                  alert(`${data.winner} won!!!`);
                }
              }
            }
          });
        }, MAFIA_ONLINE.randTime);
      }
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
