define('module/angular/services/main', [], function () {


	var module = angular.module('app.Services', []);


        module.service('gameDataService', ['$q', '$http', '$filter', '$rootScope', function($q, $http, $filter, $rootScope) {

			var dataBaseName = 'fourADDataBase';
			var data = localStorage.getItem(dataBaseName);
				data = angular.fromJson(data);

			//se não existir data guardada associamos a um array
			/*
				estrutura:
				[
					game = {
						name: 
						id:
						party : [
							"sheet1" : {}
							"sheet2" : {}
							"sheet3" : {}
							"sheet4" : {}
						]
					}
				]
			*/
			if(!data){
				data = [];
			}

			this.getGamesData = function(){
				return data;
			}

			this.overWriteData = function(newData){
				data = angular.copy(newData);
				this.saveData();

				return data;
			}

			this.concatenateData = function(newData){
				newData = angular.copy(newData);
				data = data.concat(newData);

				for(var i in data){
					data[i].id = Math.round(Math.random()*999999999999);
				}

				this.saveData();
				
				return data;
			}

			this.createNewGame = function(gameName){
				var obj = {};
					obj.name = gameName;
					obj.id = Math.round(Math.random()*999999999999);
					obj.party = {};

				data.push(obj);

				this.saveData();

				return obj;
			}

			this.saveSheetData = function(partyId, sheetName, sheetData){
				partyId = parseInt(partyId);
				var game = $filter('filter')(data, {id: partyId}, true)[0];

				//console.log(game, sheetName, sheetData, partyId);

				//se nao encontrar nenhuma party
				if(!game){ return; }

					game.party[sheetName] = sheetData;

				this.saveData();
			}

			this.saveData = function(){
				localStorage.setItem(dataBaseName, angular.toJson(data));
			}

			this.getSheetData = function(partyId, sheetName){
				partyId = parseInt(partyId);
				var game = $filter('filter')(data, {id: partyId}, true)[0];

				//console.log('get sheet data', game);

				return (game) ? game.party[sheetName] : null;
			}

			this.getPartyData = function(partyId){
				partyId = parseInt(partyId);
				return $filter('filter')(data, {id: partyId}, true)[0];
			}

            return this;
		}]);
		

		module.service('langService', ['$q', '$http', '$filter', '$rootScope', function($q, $http, $filter, $rootScope) {
			
			this.lang;
			this.langData = {};
			this.langDefer = $q.defer();
			this.loading;
			var sup = this;

			return this;
		}]);
	    

		module.service('dataService', ['$q', '$http', '$filter', 'langService', '$rootScope', function($q, $http, $filter, langService, $rootScope) {

			sup = this;
			var chatMessages = {};

			var socket = io.connect('/rtc');
            
                socket.on('connect', function (data) {
                    console.log('Connected', socket);
                });

                socket.on('chatMsg', function (data) {
					//if there is not an object for this game chat create one
					if(!chatMessages[data.gameID]){
						chatMessages[data.gameID] = new Array();
					}

					//append the message for this game chat object
					chatMessages[data.gameID].push(data);

					$rootScope.$emit('chatMsgReceived', data);
					$rootScope.$apply();

                    console.log('received', data, 'currmsgs ', chatMessages[data.gameID]);
				});

				socket.on('createGameSuccess', function (data) {
					$rootScope.$emit('createGameSuccess', data);
                    console.log('RTC createGameSuccess', data);
				});

				socket.on('joinGameSuccess', function (data) {
					$rootScope.$emit('joinGameSuccess', data);
                    console.log('RTC joinGameSuccess', data);
				});

				socket.on('gameListUpdate', function (data) {
					$rootScope.gameList = data;
					$rootScope.$apply();
                    console.log('RTC gameListUpdate', data);
				});

			//assign the socket to a service variable
			this.socket = socket;

			this.joinGame = function(gameID){
				socket.emit('joinGame', gameID);
			}
				
			this.createNewGame = function(GameName){
				socket.emit('createGame', {name: GameName});
			}

			this.leaveGame = function(){
				socket.emit('leaveGame');
			}

			this.getChatMessages = function(gameID){
				return chatMessages[gameID];
			}


            return this;
        }]);


    return module;

});
