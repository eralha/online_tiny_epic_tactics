define('module/angular/directives/common', [
	'module/angular/directives/main',
	'module/angular/directives/dir_layer_new_game',
	'module/angular/directives/dir_game_chat',
	'module/angular/directives/dir_elem_drag',
	'module/angular/directives/dir_curr_player_board',
	'module/angular/directives/dir_curr_player_hero'
], function (module) {



		module.directive('dirLayer', ['$rootScope', '$injector', function($rootScope, $injector) {
		  return {
		  	restrict: 'EA',
		    compile: function(e, a){
		        //console.log($(e).html(), arguments);
		        return function(scope, elem, attrs) {

		        	$(elem).find('.content').click(function(e){
		        		e.stopPropagation();
							});

		        	$(elem).find('.bg').click(function(){
		        		$(elem).remove();
		        	});

		        }
		    }
		  };
		}]);


    return module;

});
