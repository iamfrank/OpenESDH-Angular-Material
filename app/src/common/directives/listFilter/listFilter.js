(function(){
    'use strict';

    angular.module('openeApp.common.directives.filter')
        .directive('openeListFilter', ListFilterDirective);

    ListFilterDirective.$inject = ['$timeout']

    function ListFilterDirective($timeout) {

        function postlink(scope, elem, attrs) {

            scope.updateFilter = function(index) {
                scope.choice = scope.list[index];

                // Timeout angularfix to get scope to update properly
                $timeout(function () {
                    return scope.finished();
                }, 10);
            }

        }

        return {
            link: postlink,
            restrict: 'E',
            scope: {
                list: '=',
                choice: '=',
                finished: '='
            },
            templateUrl: '/app/src/common/directives/listFilter/view/listFilter.html'
        }
    }
})();