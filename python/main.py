# Bottle Python Web Framework

import bottle

def main():
	@bottle.route("/")
	def index():
		print("\nIndex page requested")
		return "<h1>Index</h1>"

	@bottle.route("/static_file/<filepath:path>")
	def static_file_request(filepath):
		print("\nstatic_file/{} requested".format(filepath))
		return bottle.static_file(filepath, root="../website/static_file")

	def kill():
		pass

	def vote():
		pass

	def perform():
		pass

	bottle.run(host="localhost", port=8000, debug=True)

if __name__ == "__main__":
	main()
