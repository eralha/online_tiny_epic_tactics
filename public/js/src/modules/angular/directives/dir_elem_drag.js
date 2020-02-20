define('module/angular/directives/dir_elem_drag', [
	'module/angular/directives/main'
	], function (module) {


        module.directive('dirElemDrag', ['$rootScope', '$injector', 'dataService', function($rootScope, $injector, dataService) {
            return {
            restrict: 'EA',
            scope: {
                posiObj : '=linked'
            },
                compile: function(e, a){
                    //console.log($(e).html(), arguments);
                    return function(scope, elem, attrs) {
                        
                        var dragItem = $(elem).get(0);
                        var container = document.querySelector(".c-game_panel");
                    
                        var active = false;
                        var currentX;
                        var currentY;
                        var initialX;
                        var initialY;
                        var xOffset = 0;
                        var yOffset = 0;
                    
                        container.addEventListener("touchstart", dragStart, false);
                        container.addEventListener("touchend", dragEnd, false);
                        container.addEventListener("touchmove", drag, false);
                    
                        container.addEventListener("mousedown", dragStart, false);
                        container.addEventListener("mouseup", dragEnd, false);
                        container.addEventListener("mousemove", drag, false);
                    
                        function dragStart(e) {
                          if (e.type === "touchstart") {
                            initialX = e.touches[0].clientX - xOffset;
                            initialY = e.touches[0].clientY - yOffset;
                          } else {
                            initialX = e.clientX - xOffset;
                            initialY = e.clientY - yOffset;
                          }
                    
                          if (e.target === dragItem) {
                            active = true;
                          }
                        }
                    
                        function dragEnd(e) {
                          initialX = currentX;
                          initialY = currentY;
                    
                          active = false;
                        }
                    
                        function drag(e) {
                          if (active) {
                          
                            e.preventDefault();
                          
                            if (e.type === "touchmove") {
                              currentX = e.touches[0].clientX - initialX;
                              currentY = e.touches[0].clientY - initialY;
                            } else {
                              currentX = e.clientX - initialX;
                              currentY = e.clientY - initialY;
                            }
                    
                            xOffset = currentX;
                            yOffset = currentY;

                            scope.posiObj.data.x = currentX;
                            scope.posiObj.data.y = currentY;

                            scope.$apply();
                    
                            //setTranslate(currentX, currentY, dragItem);
                          }
                        }
                    
                        function setTranslate(xPos, yPos, el) {
                          el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
                        }

                        scope.$watch('posiObj', function(){
                            if(scope.posiObj.data){
                                xOffset = scope.posiObj.data.x;
                                yOffset = scope.posiObj.data.y;
                                setTranslate(scope.posiObj.data.x, scope.posiObj.data.y, dragItem);
                            }
                            console.log(scope.posiObj)
                        }, true);

                    }
                }
            };
        }]);


		return module;

});
