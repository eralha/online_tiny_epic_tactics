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

		
		app.controller('GameCtrll', ['$scope', '$rootScope', 'dataService', 'gameDataService', 'ngProgressFactory', '$state', '$sce', '$filter',
		function(scope, $rootScope, dataService, gameDataService, ngProgressFactory, $state, $sce, $filter) {

			//If a game object does not exist for this state change to home view
			if(!$rootScope.game){ $state.go('home'); }

			//get current chat messages if any
			scope.getChatMsgs = function(){
				if(!$rootScope.game){ return; }
				scope.chatMsgs = dataService.getChatMessages($rootScope.game.ID);
			}
			scope.getChatMsgs();
			
			var OFFchatMsgReceived = $rootScope.$on('chatMsgReceived', function(e, chatMsg){
				scope.getChatMsgs();
			});

			$rootScope.$on('$viewContentLoading', 
			function(event, toState, toParams, fromState, fromParams, options){ 
				OFFchatMsgReceived();
			});

		}]);

    return app;

});
