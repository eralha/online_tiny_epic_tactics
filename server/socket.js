module.exports = function (server) {

	var querys = require('./querys');
	var config = require('./config');
	var GameManager = require('./controllers/GameManager');


	var io = require('socket.io')(server);
	var rtc = io.of('/rtc').on('connection', function (socket) {

		//here we emit to the connecting socket a the game list
		socket.emit('gameListUpdate', GameManager.getGamesList());

		//send user list to all sockets when socket disconnect
		socket.on('disconnect', function (data, callback) {
			console.log('RTC disconnect: ', socket.id);

			//remove this socket from his game
			var game = GameManager.leaveGame(socket);

			if(game && socket.game){
				//here we emit to all sockets a new game list
				rtc.emit('gameListUpdate', GameManager.getGamesList());
				//send a notification to chat log
				rtc.to(game.ID).emit('chatMsgServerClient', {gameID: game.ID, actor: 'system', msg: 'Player quit'});
			}
		});

		socket.on('chatMsgClientServer', function (data) {
			if(!socket.game){ return; }

			console.log('RTC chatMsgClientServer: ', data.gameID, ' msg: '+data.msg);

			if(socket.game.ID == data.gameID){
				rtc.to(socket.game.ID).emit('chatMsgServerClient', {gameID: data.gameID, actor: 'player', msg: data.msg, socketID: socket.id});
			}
		});

		socket.on('joinGame', function (gameID) {
			if(socket.game){ return; }
			
			var added = GameManager.addPlayer(socket, gameID);

			console.log('RTC joinGame: ', gameID, ' added: ', added);

			if(added){
				var game = GameManager.getGameByGameID(gameID);
				GameManager.setSocketData(socket, rtc, 'joinGameSuccess', game);
			}
		});

		socket.on('leaveGame', function (data) {
			//remove this socket from his game
			var game = GameManager.leaveGame(socket);

			//if we found a game for this socket, remove it from this game
			if(game){
				socket.game = null;
				socket.leave(game.ID);
				//here we emit to all sockets a new game list
				rtc.emit('gameListUpdate', GameManager.getGamesList());
				//send a notification to chat log
				rtc.to(game.ID).emit('chatMsgServerClient', {gameID: game.ID, actor: 'system', msg: 'Player quit'});
			}
		});

		socket.on('createGame', function (data) {
			//check if socket is allready on a game
			if(socket.game){ return; }

			//if not create a new game 
			var game = GameManager.createGame(socket, data.name);
				GameManager.setSocketData(socket, rtc, 'createGameSuccess', game);

			//here we emit to all sockets a new game list
			rtc.emit('gameListUpdate', GameManager.getGamesList());

			console.log('RTC createGame:', socket.id, '| game id:', game.ID);
		});

		socket.on('upateGameState', function (data) {
			//check if socket is allready on a game
			if(!socket.game){ return; }
			//some checks to be shure that this socket can change this game state and have a valid state
			if(socket.game.ID != data.gameID || !data.stateObject){ return; }

			//get the game state
			var game = GameManager.getGameByGameID(data.gameID);
				game.stateObject = data.stateObject;

			rtc.to(game.ID).emit('gameStateUpdated', {ID: game.ID, state: game.stateObject});
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