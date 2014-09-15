app.controller('ApplicationController', ['$scope', 'AppConstant', 'USER_ROLES', '$rootScope', 'UserService', '$timeout', function ($scope, AppConstant, USER_ROLES, $rootScope, UserService, $timeout) {
    $scope.userRoles = USER_ROLES;

    $scope.childUpdate = {
        MyProfileOptions : null,
        setCurrentUser: null,
        MessageIndicator: [],
        isAuthenticated: $rootScope.isAuthorized
    };  
   
    $scope.childUpdate.AddMessageIndicator = function (value) {
        $scope.childUpdate.MessageIndicator.push(value);
        $timeout(function () {
            $scope.childUpdate.MessageIndicator.shift();
        }, AppConstant.mainPageMessageIndicatorTimeout);
    };

    $scope.childUpdate.closeMessageIndicator = function (index) {
        $scope.childUpdate.MessageIndicator.splice(index, 1);
    };

    $scope.isAuthorized = function () {
        return $rootScope.isAuthorized;
    };

    $scope.status = {
        isopen: false
    };

    $scope.toggled = function (open) {
    };

    $scope.toggleDropdown = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

    //my profile link end
}]);