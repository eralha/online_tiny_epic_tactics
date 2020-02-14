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

			//quando um user se disconnecta emit a todos a nova lista de users
			rtc.emit('userList', 'userList');
		});

		socket.on('leaveGame', function (data) {
			socket.emit('msg', 'room leaved');
			socket.leave(data.room);
		});

		socket.on('joinGame', function (data) {
			console.log('joined a new game', data.GameName);
		});

		socket.on('createGame', function (data) {
			var game = GameManager.createGame(socket);

			socket.join(game.ID);
			rtc.to(game.ID).emit('msg', 'msg enviada do server');

			console.log('new game created for socket', socket.id, 'game id', game.ID);
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