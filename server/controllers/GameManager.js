

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

GameManager.prototype.removePlayer = function(socketID){
    var game = this.getGameBySocketID(socketID);

    if(game){
        game.removePlayer(socketID);

        //if there is no players left in this game remove it from memory
        if(game.stateObject.playerList.length == 0){
            game.destroy();
            this.removeGame(game.ID);
            console.log('GameManager.removePlayer - ', this.gamesList);
        }
    }
}


module.exports = new GameManager();