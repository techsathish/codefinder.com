app.controller('ApplicationController', ['$scope', 'USER_ROLES', '$rootScope', function ($scope, USER_ROLES, $rootScope) {
    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isUserAuthorized = false;
    
    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
    };

    $scope.isAuthorized = function () {
        return $rootScope.isAuthorized;
    };
}]);