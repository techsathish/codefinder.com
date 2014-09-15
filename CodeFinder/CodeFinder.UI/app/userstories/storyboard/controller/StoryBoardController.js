app.controller('US_StoryBoardController',
    ['$scope', 'IsAuthenticated', '$location', 'UserService', '$timeout', '$filter', 'MyUtil', '$route', '$routeParams',
        function ($scope, IsAuthenticated, $location, UserService, $timeout, $filter, MyUtil, $route, $routeParams) {

            $scope.childUpdate.isAuthenticated = IsAuthenticated



        }]);