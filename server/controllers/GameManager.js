

var querys = require('../querys');
var config = require('../config');
var GameState = require('./GameState');

function GameManager(socket){
    this.games = new Array();
}

GameManager.prototype.createGame = function(socket){
    var game = new GameState();
        game.addPlayer(socket);

    return game;
}


module.exports = new GameManager();