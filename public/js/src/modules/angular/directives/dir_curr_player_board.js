define('module/angular/directives/dir_curr_player_board', [
	'module/angular/directives/main'
	], function (module) {


        module.directive('dirCurrPlayerBoard', ['$rootScope', '$injector', 'dataService', function($rootScope, $injector, dataService) {
            return {
            restrict: 'EA',
            scope: {
                currentPlayer : '=currentPlayer'
            },
            templateUrl: '/templates/dir_curr_player_board.html',
                compile: function(e, a){
                    //console.log($(e).html(), arguments);
                    return function(scope, elem, attrs) {

                        scope.boardOpen = false;

                        scope.toggleBoard = function(){
                            scope.boardOpen = !scope.boardOpen;
                        }
                        
                    }
                }
            };
        }]);


		return module;

});
