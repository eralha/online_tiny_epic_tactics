define('module/angular/controllers/HomeCtrll', [
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

		
		app.controller('HomeCtrll', ['$scope', '$rootScope', 'dataService', 'gameDataService', 'ngProgressFactory', '$state', '$sce', '$filter',
		function(scope, $rootScope, dataService, gameDataService, ngProgressFactory, $state, $sce, $filter) {

			function enterGame(game){
				$rootScope.game = game;
				$state.go('game', {gameID: game.ID});
			}
			
			var OFFcreateGameSuccess = $rootScope.$on('createGameSuccess', function(e, game){
				enterGame(game);
			});

			var OFFjoinGameSuccess = $rootScope.$on('joinGameSuccess', function(e, game){
				enterGame(game);
			});

			$rootScope.$on('$viewContentLoading', 
			function(event, toState, toParams, fromState, fromParams, options){ 
				OFFcreateGameSuccess();
				OFFjoinGameSuccess();
			});

			scope.joinGame = function(gameID){
				dataService.joinGame(gameID);
			}

			//force remove this socket from any game
			console.log('HomeCtrll - removing from game');
			$rootScope.game = null;
			dataService.leaveGame();

		}]);

    return app;

});
