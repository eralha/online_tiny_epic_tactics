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

                        scope.form = {};
                        scope.socketID = '/rtc#'+dataService.socket.id;
                        
                        //get current chat messages if any
                        scope.getChatMsgs = function(){
                            if(!$rootScope.game){ return; }
                            scope.chatMsgs = dataService.getChatMessages($rootScope.game.ID);

                            var d = $('.c-chat_panel');
                                d.scrollTop(d.prop("scrollHeight"));
                        }
                        scope.getChatMsgs();
                        
                        var OFFchatMsgReceived = $rootScope.$on('chatMsgReceived', function(e, chatMsg){
                            scope.getChatMsgs();
                        });

                        $rootScope.$on('$viewContentLoading', 
                        function(event, toState, toParams, fromState, fromParams, options){ 
                            OFFchatMsgReceived();
                        });

                        scope.sendChatMessage = function(){
                            if(!$rootScope.game || scope.form.message == ''){ return; }

                            var msg = scope.form.message;
                            scope.form.message = '';

                            dataService.sendChatMessage($rootScope.game.ID, msg);
                        }
                        
                    }
                }
            };
        }]);


		return module;

});
