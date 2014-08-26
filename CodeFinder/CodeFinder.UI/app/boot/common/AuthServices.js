app.factory('AuthService', ['$http', 'serviceUrls', '$q', function ($http, serviceUrls, $q) {
    var serviceInstance = {};

    //register a user
    serviceInstance.logoutUser = function (loginDetails) {
      
        var request = $http({
            method: "get",
            url: serviceUrls.logoutUser
        });

        return request;
    };
   

    serviceInstance.logoutUserPromise = function () {
        var defered = $q.defer();

        this.logoutUser()
        .success(function (data, status, headers) {

            defered.resolve(data);

        }).error(function (data, status, headers, config) {

            defered.resolve(data);

        });

        return defered.promise;
    };

    //register a user
    serviceInstance.isAuthendicated = function () {

        var request = $http({
            method: "get",
            url: serviceUrls.isAuthenticated
        });

        return request;
    };

    serviceInstance.isAuthendicatedPromised = function () {
        var defered = $q.defer();

        this.isAuthendicated()
        .success(function (data, status, headers) {
            defered.resolve(data);
        })
        .error(function (data, status, headers, config) {
            defered.resolve(data);
        });

        return defered.promise;
    };

    return serviceInstance;
}]);