# Bottle Python Web Framework

"""
~~~.tpl files are template files that python will change to HTML file.

@bottle.route("/something")     ->     This code sends the return value
def ~~~(~~~):                   ->     of this function when "/something"
    return ~~~                  ->     is requested.


"""

import bottle
import uuid

# User class
class User:
    __init__(self, job):


# main function
def main():
    games = []

    bottle.TEMPLATE_PATH.append("../website/")

    # extra files linked in HTML(tpl) files
    @bottle.route("/static_file/<filepath:path>")
    def static_file_request(filepath):
        print("\nstatic_file/{} requested".format(filepath))
        return bottle.static_file(filepath, root="../website/static_file")

    # blank useless page for testing
    @bottle.route("/")
    def index():
        print("\nIndex page requested")
        return bottle.template("index")

    # daytime - people vote
    @bottle.route("/vote")
    def vote():
        return bottle.template("vote")

    # loading
    @bottle.route("/queue")
    def queue():
        return bottle.template("queue")

    # action (mafia - kill, doctor - save, police - accuse)
    @bottle.route("/action")
    def perform():
        return bottle.template("action")

    # dead - not allowed to chat, but allowed to read others chat
    @bottle.route("/dead")
    def dead():
        return bottle.template("dead")

    bottle.run(host="localhost", port=8000, debug=True)

if __name__ == "__main__":
    main()
