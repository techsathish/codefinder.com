var app = angular.module('codefinder', ['ui.bootstrap', 'ngRoute', 'directive.g+signin', 'autocomplete', 'restangular']);

app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);
}]);

app.factory("rememberRedirect", ['$location', 'AppConstant', function ($location, AppConstant) {
    return {
        requireSignin: function () {
            AppConstant.redirectUrl = $location.path();
            $location.path('/signin');
        }
    };
}]);

// Using RestangularProvider we can configure properties. To check all properties go to https://github.com/mgonto/restangular
app.config(['RestangularProvider', function (RestangularProvider) {
    RestangularProvider.setBaseUrl('/api/userstories');


    RestangularProvider.setErrorInterceptor(function (response, deferred, responseHandler) {

        if (response.status > 400) {

            alert("signin");
            return false; // error handled
        }

        return true; // error not handled
    });


}]);


app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/app/home/views/home.html',
            controller: 'HomeController',
            resolve: {
                IsAuthenticated: ['AuthService', function (AuthService) {
                    return AuthService.isAuthendicatedPromised();
                }]
            },
            data: {
                isFullAccess: true
            }
        })
        .when('/signup', {
            templateUrl: '/app/signup/views/signup.html',
            controller: 'SignUpController',
            resolve: {
                IsAuthenticated: ['AuthService', function (AuthService) {
                    return AuthService.isAuthendicatedPromised();
                }]
            },
            data: {
                isAuthenticated: false
            }
        })
         .when('/signup/thanks', {
             templateUrl: '/app/signup/views/signupthanks.html',
             controller: 'SignUpController',
             resolve: {
                 IsAuthenticated: ['AuthService', function (AuthService) {
                     return AuthService.isAuthendicatedPromised();
                 }]
             },
             data: {
                 isAuthenticated: false
             }
         })
        .when('/signup/facebook', {
            templateUrl: '/app/signup/views/signup.html',
            controller: 'SignUpController',
            resolve: {
                IsAuthenticated: ['AuthService', function (AuthService) {
                    return AuthService.isAuthendicatedPromised();
                }]
            },
            data: {
                isAuthenticated: false
            }
        })
         .when('/signin', {
             templateUrl: '/app/signin/views/signin.html',
             controller: 'SignUpController',
             resolve: {
                 IsAuthenticated: ['AuthService', function (AuthService) {
                     return AuthService.isAuthendicatedPromised();
                 }]
             },
             data: {
                 isAuthenticated: false
             }
         })
         .when('/signout', {
             templateUrl: '/app/boot/views/signout.html',
             controller: 'SignoutController',
             resolve: {
                 IsAuthenticated: ['AuthService', function (AuthService) {
                     return AuthService.isAuthendicatedPromised();
                 }]
             },
             data: {
                 isAuthenticated: true
             }
         })
         .when('/myprofile', {
             templateUrl: '/app/boot/views/signout.html',
             controller: 'SignoutController',
             resolve: {
                 IsAuthenticated: ['AuthService', function (AuthService) {
                     return AuthService.isAuthendicatedPromised();
                 }]
             },
             data: {
                 isAuthenticated: true
             }
         })
        //user stories
         .when('/userstories/projects/createnew', {
             templateUrl: '/app/userstories/projects/views/create-new-project.html',
             controller: 'US_ProjectController',
             resolve: {
                 IsAuthenticated: ['AuthService', function (AuthService) {
                     return AuthService.isAuthendicatedPromised();
                 }]
             },
             data: {
                 isAuthenticated: true,
                 isCreate: true
             }
         })
        .when('/userstories/projects/edit/:projectid', {
            templateUrl: '/app/userstories/projects/views/create-new-project.html',
            controller: 'US_ProjectController',
            resolve: {
                IsAuthenticated: ['AuthService', function (AuthService) {
                    return AuthService.isAuthendicatedPromised();
                }]
            },
            data: {
                isAuthenticated: true,
                isCreate: false
            }
        })
        .when('/userstories/projects/:projectid/storyboard', {
            templateUrl: '/app/userstories/storyboard/views/storyboard-index.html',
            controller: 'US_StoryBoardController',
            resolve: {
                IsAuthenticated: ['AuthService', function (AuthService) {
                    return AuthService.isAuthendicatedPromised();
                }]
            },
            data: {
                isAuthenticated: true
            }
        })
        .otherwise({
            redirectTo: '/',
            resolve: {
                IsAuthenticated: ['AuthService', function (AuthService) {
                    return AuthService.isAuthendicatedPromised();
                }]
            },
            data: {
                isFullAccess: true
            }
        });
}]);

app.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});

//service urls
app.factory('serviceUrls', function () {
    var root = '/api/';

    return {
        registerUser: root + 'auth/register/',
        loginUser: root + 'auth/login/',
        signupRedirectUrl: "http://localhost.local:40/signup",
        IsUserExist: root + 'auth/GetUserExist',
        isAuthenticated: root + 'auth/IsAuthenticated',
        logoutUser: root + 'auth/logout',
        usernameSuggesion: root + "user/usernamesuggestion",
        userCommonDetails: root + "user/usercommondetails"
    };
});

//where we will store the attempted url
//app.value('redirectToUrlAfterLogin', { url: '/' });

app.factory('AuthService', ['$http', 'serviceUrls', '$q', '$rootScope', function ($http, serviceUrls, $q, $rootScope) {
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
            if (data.Result === true) {
                $rootScope.isAuthorized = true;
            }
            else {
                $rootScope.isAuthorized = false;
            }

            defered.resolve(data.Result);
        })
        .error(function (data, status, headers, config) {
            $rootScope.isAuthorized = false;
            defered.resolve(false);
        });

        return defered.promise;
    };

    return serviceInstance;
}]);

app.run(['$rootScope', 'AuthService', 'AUTH_EVENTS', '$location', function ($rootScope, AuthService, AUTH_EVENTS, $location) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        var isAuthenticated = next.data.isAuthenticated, isFullAccess = next.data.isFullAccess;

        //AuthService.isAuthendicatedPromised().then(function (data) {
        //    if (data.Result === true) {
        //        $rootScope.isAuthorized = true;
        //    }
        //    else {
        //        $rootScope.isAuthorized = false;
        //    }
        //});

        if (isFullAccess) return;
        if (isAuthenticated) {//redirected to authenticated page
            //but user is not authenticated
            if ($rootScope.isAuthorized != true) {
                event.preventDefault();
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                //redirectToUrlAfterLogin.url = next.$$route.originalPath;
                $location.path('/signin');
            }
        }
        else {
            //requested not authenticated page
            //but user is authenticated
            if ($rootScope.isAuthorized == true) {
                event.preventDefault();
                $location.path('/');
            }
        }
    });
}]);

//service urls
app.factory('AppConstant', function () {
    return {
        signupFacebookRedirectUrl: "http://localhost.local:40/signup/facebook",
        mainPageMessageIndicatorTimeout: 10000,
        redirectUrl: null
    };
});

app.factory('USER_ROLES', function () {
    return {
        User: 'User',
        Admin: 'Admin'
    }
});

app.factory('myHttpInterceptor', ['$q', '$location', 'AppConstant', function ($q, $location, AppConstant) {
    return {
        'request': function (config) {
            return config;
        },
        'response': function (response) {
            if (response.status > 400) {
                AppConstant.redirectUrl = $location.path();
                $location.path('/signin');
            }
            return response;
        },
        'requestError': function (rejection) {
            // an error happened on the request
            // if we can recover from the error
            // we can return a new request
            // or promise
            // return response; // or new promise
            // Otherwise, we can reject the next
            // by returning a rejection
            return $q.reject(rejection);
        },
        'responseError': function (rejection) {
            // an error happened on the request
            // if we can recover from the error
            // we can return a new response
            // or promise
            // return rejection; // or new promise
            // Otherwise, we can reject the next
            // by returning a rejection
            return $q.reject(rejection);
        }
    };

}]);


app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('myHttpInterceptor');
}]);
