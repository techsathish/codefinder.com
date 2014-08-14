app.factory('SignInService', ['$http', 'serviceUrls', function ($http, serviceUrls) {
    var serviceInstance = {};    

    //register a user
    serviceInstance.loginUser = function (loginDetails) {
        debugger;

        var request = $http({
            method: "post",
            url: serviceUrls.loginUser,
            data: loginDetails
        });

        return request;
    };

    serviceInstance.IsUserExist = function (emailId) {
        debugger;

        var request = $http({
            method: "post",
            url: serviceUrls.IsUserExist,
            data: emailId
        });

        return request;
    };

    return serviceInstance;
}]);