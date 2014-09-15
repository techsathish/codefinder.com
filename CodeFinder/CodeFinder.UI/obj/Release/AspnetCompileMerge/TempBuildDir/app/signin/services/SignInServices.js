app.factory('SignInService', ['$http', 'serviceUrls', function ($http, serviceUrls) {
    var serviceInstance = {};    

    //register a user
    serviceInstance.loginUser = function (loginDetails) {

        var request = $http({
            method: "post",
            url: serviceUrls.loginUser,
            data: loginDetails
        });

        return request;
    };

    serviceInstance.IsUserExist = function (emailId) {

        var request = $http({
            method: "get",
            url: serviceUrls.IsUserExist,
            params: { emailId : emailId }
        });

        return request;
    };

    return serviceInstance;
}]);