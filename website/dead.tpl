<!DOCTYPE html>
<html>
	<head>
		<title> Interface_Dead </title>
		<style>
			header {
				background-color: #DCDCDC;
				border: 0.5px solid black;
			}

			.division {
				font-size: 20px;
				padding: 0 20px;
				text-align: center;
			}

			.chat_history {
				height: 80%;
				width: 100%;
				border: 0.5px solid gray;
				margin: auto;
			}

			.chat_history h1 {
				text-align: center;
				border: 0.5px solid;
				padding: 10px 10px;
			}

			.chat_box {
				height: 10%;
				width: 100%;
				border: 2px solid #3399ff;
				margin: auto;
			}

			.chat_box h1 {
				color: red;
				text-align: center;
			}

			button {
				display: inline-block;
				height: 5%;
				width: 20%;
			}

			.join_Answer {
				font-size: 10px;
				padding: 0px 50px;
				text-align: center;
			}

			p {
				border: 100px;
			}
		</style>
	</head>
	<body>
		<header>
			<div class = "division">
				<button type = "chatroom"> Chatroom </button>
				<button type = "action"> Action </button>
			</div>
		</header>
		<div class = "chat_history">
			<h1> Join Another Game? </h1>
			<div class = "Join_Answer">
				<button type = "Join_Yes"> Yes </button>
				<button type = "Join_No"> No </button>
			</div>
		</div>
		<div class = "chat_box">
			<h1> --------------You are dead-------------- </h1>
		</div>
	</body>
</html>
