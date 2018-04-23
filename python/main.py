"""
We use bottle python web framework.

~~~.tpl files are template files that python will change to HTML file.

@bottle.route("/something")     ->     This code sends the return value
def ~~~(~~~):                   ->     of this function when "/something"
    ~~~                         ->     is requested (usually via web
    return ~~~                  ->     browser).

TODO:
    log - ppl's jobs, actions
"""

import bottle
import uuid
import random
import json

# User class
class User:
    def __init__(self, id):
        if not isinstance(id, str):
            raise ValueError("Invalid id.")

        self.__id = id
        self.__room = None
        self.__job = None
        self.__vote = 0
        self.__alive = True

    def enter(self, room):
        self.__room = room

    def getJob(self):
        return self.__job

    def setJob(self, job):
        self.__job = job

    def vote(self):
        self.__vote += 1

    def getVote(self):
        return self.__vote

    def resetVote(self):
        self.__vote = 0

    def die(self):
        self.__alive = False

    def alive(self):
        return self.__alive

# Room class
class Room:
    def __init__(self, ids):
        if not (isinstance(ids, list) and len(ids) == 5):
            raise ValueError("Invalid list of users.")
        for id in ids:
            if not isinstance(id, str):
                raise ValueError("Invalid list of users.")

        self.__users = [User(ids[i]) for i in range(5)]
        jobs = ["Mafia", "Police", "Doctor", "Citizen", "Citizen"]
        random.shuffle(jobs)
        for i in range(5):
            self.__users[i].enter(self)
            self.__users[i].setJob(jobs[i])

        # messages storage
        self.__msgRcvCount = 0
        self.__msgRcvList = [False for _ in range(5)]
        self.__msgBuffer = []
        self.__msgFlush = []

        # ready to vote
        self.__voteReadyCount = 0
        self.__voteReadyList = [False for _ in range(5)]
        self.__voteReadyRcvedCount = 0
        self.__voteReadyRcved = [False for _ in range(5)]

        # maximum vote
        self.__voteCount = 0
        self.__maxVote = []

        # dead
        self.__dead = 0

        # actions
        self.__acts = {}

    def userAt(self, index):
        return self.__users[index]

    def getMsgRcvCount(self):
        return self.__msgRcvCount

    def getMsgRcvList(self):
        return self.__msgRcvList

    def getMsgBuffer(self):
        return self.__msgBuffer

    def getMsgFlush(self):
        return self.__msgFlush

    def sendMsg(self, index, msg):
        self.__msgBuffer.append([index, msg])

    def rcvMsgJSON(self, index):
        if self.__msgRcvCount == 0:
            self.__msgFlush = self.__msgBuffer
            self.__msgBuffer = []

        if self.__msgRcvList[index]:
            return "[]"
        else:
            self.__msgRcvCount += 1
            self.__msgRcvList[index] = True

            if self.__msgRcvCount == 5:
                self.__msgRcvCount = 0
                for i in range(5):
                    self.__msgRcvList[i] = False

            return json.dumps(self.__msgFlush, separators=(",", ":"))

    def readyToVote(self, index):
        print("ready to vote: " + str(index))
        if self.__voteReadyCount + self.__dead != 5:
            if not self.__voteReadyList[index]:
                self.__voteReadyList[index] = True
                self.__voteReadyCount += 1

        if self.__voteReadyCount + self.__dead == 5:
            if not self.__voteReadyRcved[index]:
                self.__voteReadyRcved[index] = True
                self.__voteReadyRcvedCount += 1

                if self.__voteReadyRcvedCount + self.__dead == 5:
                    self.__voteReadyCount = 0
                    self.__voteReadyRcvedCount = 0
                    for i in range(5):
                        self.__voteReadyList[i] = False
                        self.__voteReadyRcved[i] = False

                return "0"
        else: return "1"

    def voteTo(self, index):
        self.__users[index].vote()
        self.__voteCount += 1

        if self.__voteCount + self.__dead == 5:
            for i in range(5):
                if len(self.__maxVote) == 0:
                    self.__maxVote.append(i)
                elif self.__users[self.__maxVote[0]].getVote() == self.__users[i].getVote():
                    self.__maxVote.append(i)
                elif self.__users[self.__maxVote[0]].getVote() < self.__users[i].getVote():
                    self.__maxVote = [i]

            for index in self.__maxVote:
                self.__users[i].die()
                self.__dead += 1

            self.__voteCount = 0
            self.__maxVote = []

    def deadListJSON(self):
        return json.dumps(self.__maxVote, separators=(",", ":"))

    def resetVote(self):
        for user in self.__users:
            user.resetVote()

    def act(self, index, target):
        self.__acts[self.__users[index].getJob()] = target

    def actResult(self, index):
        if "Mafia" in self.__acts and "Police" in self.__acts and "Doctor" in self.__acts:
            result = {}
            mafia = self.__acts["Mafia"]
            police = self.__acts["Police"]
            doctor = self.__acts["Doctor"]

            if mafia != doctor:
                result["victim"] = mafia
                self.__dead += 1
            if self.__users[index].getJob() == "Police":
                result["police"] = (self.__users[police].getJob() == "Mafia")

            return json.dumps(result, separator=(",", ":"))
        else:
            return "1"

# Set routing
app = bottle.Bottle()

waiting_ids = []
ids = {} # { str(uuid.UUID) : (Room, index) }

bottle.TEMPLATE_PATH.append("../website/")

# extra files linked in HTML(tpl) files
@app.get("/static_file/<filepath:path>")
def static_file_request(filepath):
    print("static_file/{} requested".format(filepath))
    return bottle.static_file(filepath, root="../website/static_file")

# JavaScript request
@app.get("/script/<filepath:path>")
def script_request(filepath):
    print("script/{} requested".format(filepath))
    id = bottle.request.cookies.get("id")
    return bottle.template(
        "script/{}".format(filepath),
        index=("" if ids.get(id) == None else ids[id][1]),
        job=("" if ids.get(id) == None else ids[id][0].userAt(ids[id][1]).getJob())
    )

# initial page
@app.route("/")
def index():
    global waiting_ids, ids

    print("Index page requested")

    id = str(uuid.uuid4())
    bottle.response.set_cookie("id", id)
    print("\tID:", format(id))

    waiting_ids.append(id)

    if len(waiting_ids) == 5:
        room = Room(waiting_ids)
        for i in range(5):
            ids[waiting_ids[i]] = (room, i)
        waiting_ids = []
        print("\tWaiting list is full! A room is made for the waiting ids.")

    print("\tWaiting ids: {}\n\tids: {}".format(waiting_ids, ids))

    return bottle.template("queue")

# Ready to join the game?
@app.post("/enterReady")
def enterReady():
    print("Enter Ready requested")

    id = bottle.request.cookies.get("id")
    print("\tID:", format(id))

    if ids.get(id) == None and id in waiting_ids:
        print("\tNot ready")
        return "1"
    elif ids.get(id) != None and id not in waiting_ids:
        print("\tIndex:", format(ids[id][1]))
        return "0"
    else:
        print("\tSomething went wrong in enterReady()")
        return "2"

# daytime - chatting
@app.get("/day")
def day():
    print("Daytime page requested")

    id = bottle.request.cookies.get("id")
    print("\tID:", format(id))
    print("\tIndex:", format(ids[id][1]))

    return bottle.template("main")

# chatting
@app.post("/sendMsg")
def sendMsg():
    print("Message send requested")
    msg = bottle.request.forms.get("msg")
    id = bottle.request.cookies.get("id")

    print("sendMsg called from room {} index {}.".format(ids[id][0], ids[id][1]))
    print("Message receive count:", ids[id][0].getMsgRcvCount())
    print("Message receive list:", ids[id][0].getMsgRcvList())
    print("Message buffer:", ids[id][0].getMsgBuffer())
    print("Message flush:", ids[id][0].getMsgFlush())
    ids[id][0].sendMsg(ids[id][1], msg)
    print("Sent the following message:", msg)
    print("Message receive count:", ids[id][0].getMsgRcvCount())
    print("Message receive list:", ids[id][0].getMsgRcvList())
    print("Message buffer:", ids[id][0].getMsgBuffer())
    print("Message flush:", ids[id][0].getMsgFlush())
    print()
    return "0"

@app.post("/rcvMsg")
def rcvMsg():
    print("Message receive requested")
    id = bottle.request.cookies.get("id")

    print("rcvMsg called from room {} index {}.".format(ids[id][0], ids[id][1]))
    print("Message receive count:", ids[id][0].getMsgRcvCount())
    print("Message receive list:", ids[id][0].getMsgRcvList())
    print("Message buffer:", ids[id][0].getMsgBuffer())
    print("Message flush:", ids[id][0].getMsgFlush())
    result = ids[id][0].rcvMsgJSON(ids[id][1]) # <Room>.rcvMsgJSON(<Index>)
    print("Received the following message:", result)
    print("Message receive count:", ids[id][0].getMsgRcvCount())
    print("Message receive list:", ids[id][0].getMsgRcvList())
    print("Message buffer:", ids[id][0].getMsgBuffer())
    print("Message flush:", ids[id][0].getMsgFlush())
    print()
    return result

# vote - page where people vote
@app.post("/readyToVote")
def readyToVote():
    print("Vote ready requested")
    id = bottle.request.cookies.get("id")
    return ids[id][0].readyToVote(ids[id][1])

# who did you vote?
@app.post("/voteTo")
def voteTo():
    player = int(bottle.request.forms.get("player"))
    id = bottle.request.cookies.get("id")

    if 1 <= player <= 5:
        print("Voting for {}".format(player))
        ids[id][0].voteTo(player)
        return "0"
    else:
        return "1"

# who's left?
@app.post("/execute")
def execute():
    id = bottle.request.cookies.get("id")
    return ids[id][0].deadListJSON()

# night (mafia - kill, doctor - save, police - investigate, civilian - nothing)
@app.post("/act")
def act():
    print("\Action page requested")
    id = bottle.request.cookies.get("id")
    target = bottle.request.forms.get("target")

    return "0"

@app.post("/actResult")
def actResult():
    id = bottle.request.cookies.get("id")
    return ids[id][0].actResult(ids[id][1])

if __name__ == "__main__":
    app.run(host="localhost", port=8000, debug=True)
