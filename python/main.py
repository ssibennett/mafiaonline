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
import asyncio

# User class
class User:
    def __init__(self, id: uuid.UUID):
        if not isinstance(id, uuid.UUID):
            raise ValueError("Invalid id.")

        self.__id = id
        self.__mutex = asyncio.Lock()
        self.__vote = 0
        self.__life = True
        self.__room = None

    def enter(self, room):
        self.__room = room

    def vote(self):
        self.__mutex.acquire()
        self.__vote += 1
        self.__mutex.release()

    def get_vote(self):
        return self.__vote

    def reset_vote(self):
        self.__vote = 0

    def die(self):
        self.__life = False

    def life(self):
        return self.__life

# Room class
class Room:
    def __init__(self, ids: list):
        if not (isinstance(ids, list) and len(ids) == 5):
            raise ValueError("Invalid list of users.")
        for id in ids:
            if not isinstance(id, uuid.UUID):
                raise ValueError("Invalid list of users.")

        self.__users = [User(ids[i]) for i in range(5)]
        for user in self.__users:
            user.enter(self)

    def user_at(self, index: int):
        return self.__users[index]

    def vote(self, index: int):
        self.__users[index].vote()

    def execute(self):
        max_vote = 0
        index = 0

        for i in range(5):
            if max_vote < self.__users[i].get_vote():
                max_vote = self.__users[i].get_vote()
                index = i

        self.__users[index].die()

        return index

    def reset_vote(self):
        for user in self.__users:
            user.reset_vote()

waiting_ids = []
ids = set()

# main function
def main():
    bottle.TEMPLATE_PATH.append("../website/")

    # extra files linked in HTML(tpl) files
    @bottle.route("/static_file/<filepath:path>")
    def static_file_request(filepath):
        print("\nstatic_file/{} requested".format(filepath))
        return bottle.static_file(filepath, root="../website/static_file")

    # initial page
    @bottle.route("/")
    def index():
        global waiting_ids, ids

        print("\nIndex page requested")

        id = uuid.uuid4()
        bottle.response.set_cookie("id", str(id))
        print("\nThis user's id is {}.".format(str(id)))

        waiting_ids.append(id)

        if len(waiting_ids) == 5:
            room = Room(waiting_ids)
            ids.update(waiting_ids)
            waiting_ids = []
            print("\nWaiting list is full! A room is made for the waiting ids.")

        print("\nWaiting ids: {}\nids: {}".format(waiting_ids, ids))

        return bottle.template("index")

    # daytime - page where people vote
    @bottle.route("/vote")
    def vote():
        return bottle.template("vote")

    # who did you vote?
    """
    @bottle.route("/vote", method="POST")
    def vote_post():
        room = # something
        person = bottle.request.forms.get("person")

        try:
            room.vote(int(person))
        except ValueError as error:
            print(error)
        # exception when "person" is not number
    """

    # loading
    @bottle.route("/queue")
    def queue():
        return bottle.template("queue")

    # action (mafia - kill, doctor - save, police - accuse)
    @bottle.route("/action")
    def action():
        return bottle.template("action")

    # dead - not allowed to chat, but allowed to read others chat
    @bottle.route("/dead")
    def dead():
        return bottle.template("dead")

    bottle.run(host="localhost", port=8000, debug=True)

if __name__ == "__main__":
    main()
