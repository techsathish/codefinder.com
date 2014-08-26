app.controller('SignoutController', ['$scope', 'AuthService', '$location', function ($scope, AuthService, $location) {
    debugger;
    AuthService.logoutUserPromise().then(function (data) {
        if (data.Result == true) {
            $location.path('/');
        }
        else {

        }
    });
}]);