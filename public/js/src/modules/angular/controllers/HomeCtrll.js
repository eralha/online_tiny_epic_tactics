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

			

		}]);

    return app;

});
