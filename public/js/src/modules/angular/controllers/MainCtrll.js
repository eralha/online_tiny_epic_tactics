define('module/angular/controllers/MainCtrll', [], function () {


	var app = angular.module('app.Controllers', []);

	//generic controlers go here
	app.controller('MainCtrll', ['$scope', '$rootScope', 'dataService', 'langService', 'ngProgressFactory', '$state', '$sce', '$filter', '$compile',
	function($scope, $rootScope, dataService, langService, ngProgressFactory, $state, $sce, $filter, $compile) {

		$rootScope.JS_VERSION = JS_VERSION;

		$scope.progressbar = ngProgressFactory.createInstance();

		$rootScope.$on('$viewContentLoading', 
		function(event, toState, toParams, fromState, fromParams, options){ 

			$scope.progressbar.start();
		});

		$rootScope.$on('$viewContentLoaded', 
		function(event, toState, toParams, fromState, fromParams, options){ 
			$scope.progressbar.complete();
		});
		
		$rootScope.parseHtml = function(html){
			return $sce.trustAsHtml(html);
		}

		$scope.translate = function(key){
			return langService.translate(key);
		}

		$scope.scrollToTop = function(selector){
			$("html, body").stop().animate({scrollTop: 0}, 1000, 'swing');
		}

		$scope.toggleMenu = function(){
			$scope.menuVisible = !$scope.menuVisible;
		}

		$rootScope.addLayer = function(layerName){
			var layerScope = $scope.$new(true);

			var compiled = $compile('<div dir-Layer '+layerName+'></div>')(layerScope);
			
			$('body').append(compiled);
		}

	}]);


    return app;

});
