app.factory('UserService', ['$http', 'serviceUrls', '$q', function ($http, serviceUrls, $q) {
    var serviceInstance = {};

    //get a username suggestion
    serviceInstance.usernameSuggesion = function (typedString) {
      
        var UserSearch = {};
        UserSearch.SearchStringEmail = typedString;

        var request = $http({
            method: "post",
            url: serviceUrls.usernameSuggesion,
            data: UserSearch
        });

        return request;
    };

    serviceInstance.usernameSuggesionPromised = function (data) {
        var defered = $q.defer();

        this.usernameSuggesion(data)
        .success(function (data, status, headers) {
            defered.resolve(data, status, headers);
        })
        .error(function (data, status, headers, config) {
            defered.resolve(data, status, headers, config);
        });

        return defered.promise;
    };

    //get userdetails
    serviceInstance.userCommonDetails = function (UserDetailsSearch) {

        var request = $http({
            method: "post",
            url: serviceUrls.userCommonDetails,
            data: UserDetailsSearch
        });

        return request;
    };

    serviceInstance.userCommonDetailsPromised = function (data) {
        var defered = $q.defer();

        this.userCommonDetails(data)
        .success(function (data, status, headers) {
            defered.resolve(data, status, headers);
        })
        .error(function (data, status, headers, config) {
            defered.resolve(data, status, headers, config);
        });

        return defered.promise;
    };

    var userProfile = {
        email: null,
        name: null
    };

    serviceInstance.userProfile = {
        get: function () {
            return userProfile;
        },
        set: function (value) {
            userProfile = value;
        }
    };

    return serviceInstance;
}]);


