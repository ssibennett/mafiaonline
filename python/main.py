# Bottle Python Web Framework

import bottle

def main():
    rooms = []

	bottle.TEMPLATE_PATH.append("../website/")

	@bottle.route("/")
	def index():
		print("\nIndex page requested")
		return bottle.template("index")

	@bottle.route("/static_file/<filepath:path>")
	def static_file_request(filepath):
		print("\nstatic_file/{} requested".format(filepath))
		return bottle.static_file(filepath, root="../website/static_file")

	@bottle.route("/default")
	def default():
        if bottle.request.get_cookie("visited") != "true":
            if len(rooms) == 0 or len(rooms[-1]) == 5:
                # rooms.append([ <IP address> ])
            else:
                # rooms[-1].append( <IP address> )

		return bottle.template("game")

	def vote():
		if bottle.request.get_cookie("visited") == "true":
            # return bottle.template("game")

        return "<h1>Who the heck are you?</h1>"

	def perform():
		if bottle.request.get_cookie("visited") == "true":
            # return bottle.template("game")

        return "<h1>Who the heck are you?</h1>"

    @bottle.route("/dead")
    def dead():
        return bottle.template("dead")

	# Tester
	@bottle.route("/greet/<name>")
	def greet(name):
		return bottle.template("greet(test)", name=name)

	bottle.run(host="localhost", port=8000, debug=True)

if __name__ == "__main__":
	main()
