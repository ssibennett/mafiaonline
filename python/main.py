import bottle

def main():
	@bottle.route("/")
	def index():
		return "<h1>Index</h1>"
	
	bottle.run(host="localhost", port=8000, debug=True)

if __name__ == "__main__":
	main()
