define('module/angular/directives/dir_curr_player_hero', [
	'module/angular/directives/main'
	], function (module) {


        module.directive('dirCurrPlayerHero', ['$rootScope', '$injector', 'dataService', function($rootScope, $injector, dataService) {
            return {
            restrict: 'EA',
            scope: {
                hero : '=hero'
            },
            templateUrl: '/templates/dir_curr_player_hero.html',
                compile: function(e, a){
                    //console.log($(e).html(), arguments);
                    return function(scope, elem, attrs) {

                        scope.addValue = function(propName){
                            scope.hero.data[propName] ++;
                        }
                        scope.remValue = function(propName){
                            scope.hero.data[propName] --;
                            if(scope.hero.data[propName] < 0){ scope.hero.data[propName] = 0; }
                        }
                        
                    }
                }
            };
        }]);


		return module;

});
