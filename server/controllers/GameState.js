

var querys = require('../querys');
var config = require('../config');

function HeroObject(){
    this.data = {
        img: '',
        posiX: 0,
        posiY: 0,
        life: 0,
        mana: 0,
        ammo: 0,
        type: ''
    }
}

function PlayerObject(socketID){
    this.data = {
        socketID: socketID,
        playerNumber: 0,
        heroes: [],
    }
}

function GameState(){
    this.imagesAssetsPath = config.imagesAssetsPath;
    this.heroesData = {
        wizard: [],
        rogue: [],
        knight: [],
        beast: []
    }
    this.stateObject = {
        playerList: [],
        flags: [
            {
                id: 'flag1',
                posiX: 0,
                posiY: 0
            },
            {
                id: 'flag2',
                posiX: 0,
                posiY: 0
            },
            {
                id: 'flag3',
                posiX: 0,
                posiY: 0
            },
        ]
    };
    
    this.socketList = new Array();
    this.stateObject.playerList = new Array();
    this.ID = 'Game_State_id_'+Math.random()*10000000;
}

GameState.prototype.destroy = function(){
    delete this.stateObject;
    delete this.socketList;
    delete this;
}

GameState.prototype.addPlayer = function(socketID){
    var player = new PlayerObject(socketID);

        //add 1 hero of each type to the player
        player.data.heroes.push(new HeroObject());

    //set a player number
    if(this.stateObject.playerList.length == 0){
        player.data.playerNumber = 1;
    }
    //check the player number for an existing player
    if(this.stateObject.playerList.length >= 1){
        var currPlayer = this.stateObject.playerList[0];
        player.data.playerNumber = (currPlayer.data.playerNumber == 1) ? 2 : 1;
    }

    this.stateObject.playerList.push(player);

    //add the socket id to a list for help sorting and geting games by this id
    this.socketList.push(socketID);
}

GameState.prototype.removePlayer = function(socketID){
    var players = this.stateObject.playerList;

    for(var i in players){
        //if found player remove it from array
        if(players[i].data.socketID == socketID){
            players.splice(i, 1);
        }
    }

    return this.stateObject.playerList;
}

module.exports = GameState;