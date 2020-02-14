module.exports = function (server) {

	var querys = require('./querys');
	var config = require('./config');


	var io = require('socket.io')(server);
	var rtc = io.of('/rtc').on('connection', function (socket) {

		  //send user list to all sockets when socket disconnect
		  socket.on('disconnect', function (data, callback) {
				console.log(socket.id);
				rtc.emit('socketDisconnected', 'socketDisconnected');

				//quando um user se disconnecta emit a todos a nova lista de users
				rtc.emit('userList', 'userList');
		  });

		  //send user list when user asks for it
		  socket.on('getUsers', function (data, callback) {
				callback('callback');
		  });

		  //send user list when user asks for it
		  socket.on('setUserName', function (data, callback) {
				socket.userName = data.data;

				callback('done');
				//Quando um user faz join emitimos a todos o sockets o novo user
				rtc.emit('userList', 'userList');
		  });

		  socket.on('emitRoom', function (data) {
			//Aqui vemos se o utilizador pode enviar para este grupo, temos uma lista de grupos associada a um token
		  	//console.log(data, rtc.adapter.rooms);
			//console.log('room emit', data);
			var msgs = data;
			for(var i in msgs){
				rtc.to(msgs[i].to).emit('msg', msgs[i]);
			}
		  });

		  socket.on('joinRoom', function (data) {
			//aqui vemos se o utilizador pode entrar neste grupo, temos uma lista de grupos associada a um token
		  	socket.emit('msg', 'room joined');
				socket.join(data.room);
		  });

		  socket.on('leaveRoom', function (data) {
		  	socket.emit('msg', 'room leaved');
		  	socket.leave(data.room);
		  });

		  socket.on('createGame', function (data) {
			var gameName = 'NewGameRoom';
			
			socket.join(gameName);
			rtc.to(gameName).emit('msg', 'msg enviada do server');

			console.log('new game created for socket', socket.id);
		  });

		  /*
		  socket.on('emit', function (data, callback) {
				console.log(data);

				if(!socket.userName || data.data == ''){ return; }
					
				storeMsg(data.data);

				//adicona o username à mensagem
				data.data = '<b>'+socket.userName+'</b>:'+data.data;

				//rtc.emit('msg', data); //everyone in RTC chanel will get this, even the socket calling it
				//Envia apenas para os restantes sockets
				socket.broadcast.emit('msg', data);
				callback('done');
			});
			*/

	});

	return {
		socket: rtc
	};

}