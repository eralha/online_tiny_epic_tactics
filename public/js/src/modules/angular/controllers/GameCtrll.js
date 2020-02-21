define('module/angular/controllers/GameCtrll', [
	'module/angular/controllers/MainCtrll',
	], function (app) {

		function shuffle(a) {
			var j, x, i;
			for (i = a.length - 1; i > 0; i--) {
				j = Math.floor(Math.random() * (i + 1));
				x = a[i];
				a[i] = a[j];
				a[j] = x;
			}
			return a;
		}

		function debounce(func, wait, immediate) {
			var timeout;
			return function() {
				var context = this, args = arguments;
				var later = function() {
					timeout = null;
					if (!immediate) func.apply(context, args);
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		};

		
		app.controller('GameCtrll', ['$scope', '$rootScope', 'dataService', 'gameDataService', 'ngProgressFactory', '$state', '$sce', '$filter',
		function(scope, $rootScope, dataService, gameDataService, ngProgressFactory, $state, $sce, $filter) {

			//init some vars

			//If a game object does not exist for this state change to home view
			if(!$rootScope.game){ 
				$state.go('home'); 
				return;
			}

			//log game 
			console.log('GameCtrll', $rootScope.game);

			//listen for changes on the game object and update the server
			var callStateUpdate = debounce(function() {
				dataService.updateGameState($rootScope.game.ID, scope.gameState);
			}, 10);
			scope.$watch('gameState', function(){
				//console.log('GameCtrll gameState watch:', scope.gameState);
				callStateUpdate();
			}, true);

			//logger for diferent object types
				var callLogger1 = debounce(function() {
					//call logger here
					var playerNumber = scope.currentPlayer.data.playerNumber;
					dataService.logPlayerChange($rootScope.game.ID, 'Player '+playerNumber+' Moved/Changed a hero');
				}, 1000);
				scope.$watch('currentPlayer', function(){
					callLogger1();
				}, true);

			//get game state if it exists
			scope.gameState = dataService.getGameSate($rootScope.game.ID);

			//this will map the game state object to the correspondig state vars
			function mapStateObjectsToScopeVars(){
				var players = scope.gameState.playerList;

				for(var i in players){
					scope['player'+players[i].data.playerNumber] = players[i];

					//set the objects to oponent and current player
					if(players[i].data.socketID == dataService.getSocketId()){
						scope.currentPlayer = players[i];
					}else{
						scope.currentOponent = players[i];
					}
				}

				scope.$apply();
			}//end mapStateObjectsToScopeVars

			function setLogger(){
				
			}

			var OFFgameStateUpdated = $rootScope.$on('gameStateUpdated', function(e, gameState){
				scope.gameState = gameState;
				mapStateObjectsToScopeVars();
			});

			$rootScope.$on('$viewContentLoading', 
			function(event, toState, toParams, fromState, fromParams, options){ 
				OFFgameStateUpdated();
			});

		}]);

    return app;

});
