

var querys = require('../querys');
var config = require('../config');

function HeroObject(){
    this.posi = {
        x: 0,
        y: 0
    };
    this.data = {
        img: '',
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
        heroes: {},
    }
}

function GameState(){
    this.imagesAssetsPath = config.imagesAssetsPath;
    this.heroesStartPosiData = {
        wizard: {
            player1: { x:0, y: 0},
            player2: { x:0, y: 0}
        },
        rogue: {
            player1: { x:0, y: 0},
            player2: { x:0, y: 0}
        },
        knight: {
            player1: { x:0, y: 0},
            player2: { x:0, y: 0}
        },
        beast: {
            player1: { x:0, y: 0},
            player2: { x:0, y: 0}
        }
    };
    this.heroesImgData = {
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
                x: 0,
                y: 0
            },
            {
                id: 'flag2',
                x: 0,
                y: 0
            },
            {
                id: 'flag3',
                x: 0,
                y: 0
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

GameState.prototype.setRandomHero = function(type, player){
    player.data.heroes[type] = new HeroObject();
}

GameState.prototype.addPlayer = function(socketID){
    var player = new PlayerObject(socketID);

    //set a player number
    if(this.stateObject.playerList.length == 0){
        player.data.playerNumber = 1;
    }
    //check the player number for an existing player
    if(this.stateObject.playerList.length >= 1){
        var currPlayer = this.stateObject.playerList[0];
        player.data.playerNumber = (currPlayer.data.playerNumber == 1) ? 2 : 1;
    }

    //add 1 hero of each type to the player
    this.setRandomHero('wizard', player);
    this.setRandomHero('rogue', player);
    this.setRandomHero('knight', player);
    this.setRandomHero('beast', player);

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