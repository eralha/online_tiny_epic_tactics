module.exports = function (server) {

	var querys = require('./querys');
	var config = require('./config');
	var GameManager = require('./controllers/GameManager');


	var io = require('socket.io')(server);
	var rtc = io.of('/rtc').on('connection', function (socket) {

		//send user list to all sockets when socket disconnect
		socket.on('disconnect', function (data, callback) {
			console.log(socket.id);
			rtc.emit('socketDisconnected', socket.id);

			//when user disconnects emit to all players
			//rtc.emit('userList', 'userList');
		});

		socket.on('joinGame', function (data) {
			console.log('joined a new game', data.GameName);
		});

		socket.on('leaveGame', function (data) {
			//get the game for this socket
			var game = GameManager.getGameBySocketID(socket.id);

			console.log('RTC leaveGame: '+game);

			//if we found a game for this socket, remove it from this game
			if(game){
				socket.game = null;
				socket.leave(game.ID);
				GameManager.removePlayer(socket.id);

				//here we emit to all sockets a new game list
				rtc.emit('gameListUpdate', GameManager.getGamesList());
			}
		});

		socket.on('createGame', function (data) {
			//check if socket is allready on a game
			if(socket.game){ return; }

			//if not create a new game 
			var game = GameManager.createGame(socket, data.name);

			//here we join this socket on a private chanel for the created game state
			socket.join(game.ID);
			rtc.to(game.ID).emit('createGameSuccess', game);

			//here set the state of this socket as in game and dont allow create any more games until true
			socket.game = game;

			//here we emit to all sockets a new game list
			rtc.emit('gameListUpdate', GameManager.getGamesList());

			console.log('RTC createGame:', socket.id, '| game id:', game.ID);
		});

		//É usado para receber as mensagens de chat 
		socket.on('emit', function (data, callback) {
			//rtc.emit('msg', data); //everyone in RTC chanel will get this, even the socket calling it
			//Envia apenas para os restantes sockets
			socket.broadcast.emit('msg', data);
			callback('done');
		});

	});

	return {
		socket: rtc
	};

}