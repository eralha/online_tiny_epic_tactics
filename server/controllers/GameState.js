

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

function PlayerObject(socket){
    this.data = {
        socket: socket,
        heroes: [],
    }
}

function GameState(){
    this.stateObject = {
        players: [],
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
    
    this.sockets = new Array();
    this.ID = 'Game_State_id_'+Math.random()*10000000;
}

GameState.prototype.addPlayer = function(socket){
    this.sockets.push(socket);

    var player = new PlayerObject(socket);
        player.data.heroes.push(new HeroObject());
}

module.exports = GameState;