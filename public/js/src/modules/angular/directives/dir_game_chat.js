define('module/angular/directives/dir_game_chat', [
	'module/angular/directives/main'
	], function (module) {


        module.directive('dirGameChat', ['$rootScope', '$injector', 'dataService', function($rootScope, $injector, dataService) {
            return {
            restrict: 'EA',
            scope: {
                info : '=info'
            },
            templateUrl: '/templates/dir_game_chat.html',
                compile: function(e, a){
                    //console.log($(e).html(), arguments);
                    return function(scope, elem, attrs) {
                        
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
                        
                    }
                }
            };
        }]);


		return module;

});
