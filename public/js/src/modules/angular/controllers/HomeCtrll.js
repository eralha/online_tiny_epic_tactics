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

			$rootScope.$on('createGameSuccess', function(e, game){
				$rootScope.game = game;
				$state.go('game', {gameID: game.ID});
			});

			//force remove this socket from any game
			console.log('HomeCtrll - removing from game');
			$rootScope.game = null;
			dataService.leaveGame();

		}]);

    return app;

});
