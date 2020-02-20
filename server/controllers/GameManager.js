

var querys = require('../querys');
var config = require('../config');
var GameState = require('./GameState');

function GameManager(socket){
    this.gamesList = new Array();
}

GameManager.prototype.createGame = function(socket, gameName){
    var game = new GameState();
        game.name = gameName;
        game.addPlayer(socket.id);

    this.gamesList.push(game);

    return game;
}

GameManager.prototype.leaveGame = function(socket){
    //get the game for this socket
    var game = this.getGameBySocketID(socket.id);

    //if we found a game for this socket, remove it from this game
    if(game){
        console.log('GameManager.leaveGame: '+game.ID);
        this.removePlayer(socket.id);
    }

    return game;
}

GameManager.prototype.setSocketData = function(socket, rtc, event, game){
    //here we join this socket on a private chanel for the created game state
    socket.join(game.ID);
    rtc.to(game.ID).emit(event, game);

    //emit a system message to the game chat
    rtc.to(game.ID).emit('chatMsgServerClient', {gameID: game.ID, actor: 'system', msg: 'Player entered the game'});

    //here set the state of this socket as in game and dont allow create any more games until true
    socket.game = game;
}

GameManager.prototype.removeGame = function(gameID){
    var removed = false;
    var games = this.gamesList;

    for(var i in games){
        if(games[i].ID == gameID){
            this.gamesList.splice(i, 1);
            removed = true;
        }
    }

    return removed;
}

GameManager.prototype.getGamesList = function(){
    var removed = false;
    var games = this.gamesList;
    var gamesList = [];

    for(var i in games){
        gamesList.push({ID: games[i].ID, name: games[i].name, playerCount: games[i].stateObject.playerList.length});
    }

    return gamesList;
}

GameManager.prototype.getGameBySocketID = function(socketID){
    var game;
    var games = this.gamesList;

    console.log('GameManager.getGameBySocketID - socketID: '+socketID);

    for(var i in games){
        if(games[i].socketList.indexOf(socketID) != -1){
            game = games[i];
        }
    }

    return game;
}

GameManager.prototype.getGameByGameID = function(gameID){
    var game;
    var games = this.gamesList;

    console.log('GameManager.getGameByGameID - gameID: '+gameID);

    for(var i in games){
        if(games[i].ID == gameID){
            game = games[i];
        }
    }

    return game;
}

GameManager.prototype.addPlayer = function(socket, gameID){
    var game = this.getGameByGameID(gameID);
    var added = false;

    console.log('GameManager.addPlayer game:'+game);

    if(game){
        console.log('GameManager.addPlayer game:'+game.stateObject.playerList.length);
        if(game.stateObject.playerList.length < 2){
            game.addPlayer(socket.id);
            added = true;
        }
    }
    

    return added;
}

GameManager.prototype.removePlayer = function(socketID){
    var game = this.getGameBySocketID(socketID);

    if(game){
        game.removePlayer(socketID);

        //if there is no players left in this game remove it from memory
        if(game.stateObject.playerList.length == 0){
            game.destroy();
            this.removeGame(game.ID);
            console.log('GameManager.removePlayer - removing game: ', game.ID);
        }
    }
}


module.exports = new GameManager();