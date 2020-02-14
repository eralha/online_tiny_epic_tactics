define('module/angular/directives/dir_layer_new_game', [
	'module/angular/directives/main'
	], function (module) {


        module.directive('dirLayerNewGame', ['$rootScope', '$injector', 'dataService', function($rootScope, $injector, dataService) {
            return {
            restrict: 'EA',
            scope: {},
            templateUrl: '/templates/dir_layer_new_game.html',
                compile: function(e, a){
                    //console.log($(e).html(), arguments);
                    return function(scope, elem, attrs) {

                        scope.createNewGame = function(){
                            dataService.createNewGame(scope.form.GameName, scope.form.GamePass);
                        }

                    }
                }
            };
        }]);


		return module;

});
