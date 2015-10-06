(function() {
    'use strict';

    angular.module('openeApp.common.directives')
        .directive('openeGroupUserDialog', openeGroupUserDialog);

    openeGroupUserDialog.$inject = ['$mdDialog', 'userService']

    function openeGroupUserDialog($mdDialog, userService) {

        function postlink(scope, elem, attrs) {

            scope.selectedItems = [];
            scope.sortOrder = "asc"; //or desc
            scope.sortBy = "userName";
            scope.maxResults = "100";

            scope.openDialog = function (event) {
                $mdDialog.show({
                    scope: scope,
                    preserveScope: true,
                    templateUrl: '/app/src/common/directives/groupUserDialog/view/groupUserDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: true
                });
            }

            // Cancel form in dialog
            scope.cancel = function () {
                scope.selectedItems = [];
                scope.searchTerm = "";
                scope.sortOrder = "asc"; //or desc
                scope.sortBy = "userName";
                scope.maxResults = "100";
                $mdDialog.cancel();
            };

            // Returns the selected items to the directive callback function
            scope.executeCallback = function () {
                if(!scope.selectedItems.length) return;
                scope.getSelectedItems({
                    type: scope.searchType,
                    items: scope.selectedItems
                });
                scope.cancel();
            };

            // Function executed when typing in searchfield
            scope.searchItemsByQuery = function(queryterm) {
                if(scope.searchType === 'users') return searchUsers(queryterm);
                if(scope.searchType === 'groups') return searchGroups(queryterm);
            };

            /**
             * User search
             */
            function searchUsers(queryterm) {
                var query = createUserSearchQuery(queryterm);
                return userService.getPeople(query).then(function (response) {
                    return response.people.map(function (contact, index) {
                        return {
                            name: contact.firstName + ' ' + contact.lastName,
                            email: contact.email,
                            username: contact.userName
                        }
                    });
                });
            };

            function createUserSearchQuery(queryterm) {
                var query = "sortBy=" + scope.sortBy;
                query += '&dir=' + scope.sortOrder + '&filter=' + encodeURIComponent(queryterm) + '&maxResults=' + scope.maxResults;
                return query;
            };

            /**
             * Group search
             */
            function searchGroups(queryterm) {
                return userService.getGroups(queryterm).then(function (response) {
                    return response;
                });
            };

        };

        return {
            link: postlink,
            restrict: 'E',
            scope: {
                getSelectedItems: '=',
                searchType: '@'
            },
            template: '<md-button aria-label="{{ (searchType == \'users\' ? \'GROUP.ADD_USERS\' : \'GROUP.ADD_GROUPS\') | translate }}" class="md-primary" ng-click="openDialog($event)">' +
                        '<i class="material-icons">person_add</i> {{ (searchType == \'users\' ? \'GROUP.ADD_USERS\' : \'GROUP.ADD_GROUPS\') | translate }}' +
                      '</md-button>'
        }
    }
})();