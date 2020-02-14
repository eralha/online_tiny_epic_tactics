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

			var socket = io.connect('/rtc');
            
                socket.on('connect', function (data) {
                    console.log('Connected', socket);
                });

                socket.on('msg', function (data) {
                    console.log('received', data, $rootScope);
				});

				socket.on('emit', function (data) {
                    console.log('received', data, $rootScope);
				});
				
			this.createNewGame = function(GameName){
				socket.emit('createGame', {name: GameName});
			}


            return this;
        }]);


    return module;

});
