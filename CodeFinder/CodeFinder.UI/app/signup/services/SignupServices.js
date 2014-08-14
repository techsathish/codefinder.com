app.factory('SignupService', ['$http', 'serviceUrls', function ($http, serviceUrls) {
    var serviceInstance = {};

    //register a user
    serviceInstance.registerUser = function (userDetails) {
        var request = $http({
            method: "post",
            url: serviceUrls.registerUser,
            data: userDetails
        });

        return request;
    };

    return serviceInstance;
}]);