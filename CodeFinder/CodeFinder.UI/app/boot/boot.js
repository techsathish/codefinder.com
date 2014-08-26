var app = angular.module('codefinder', ['ngRoute', 'directive.g+signin']);

app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);
}]);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/app/home/views/home.html',
            controller: 'HomeController'
        })
        .when('/signup', {
            templateUrl: '/app/signup/views/signup.html',
            controller: 'SignUpController'
        })
         .when('/signup/thanks', {
             templateUrl: '/app/signup/views/signupthanks.html',
             controller: 'SignUpController'
         })
        .when('/signup/facebook', {
            templateUrl: '/app/signup/views/signup.html',
            controller: 'SignUpController'
        })
         .when('/signin', {
             templateUrl: '/app/signin/views/signin.html',
             controller: 'SignUpController'
         })
         .when('/signout', {
             templateUrl: '/app/boot/views/signout.html',
             controller: 'SignoutController'
         })
        .otherwise({
            redirectTo: '/'
        });
}]);

//service urls
app.factory('serviceUrls', function () {
    var root = '/api/';

    return {
        registerUser: root + 'auth/register/',
        loginUser: root + 'auth/login/',
        signupRedirectUrl: "http://localhost.local:40/signup",
        IsUserExist: root + 'auth/GetUserExist',
        isAuthenticated: root + 'auth/IsAuthenticated',
        logoutUser: root + 'auth/logout'
    };
});


app.run(['$rootScope', 'AuthService', function ($rootScope, AuthService) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        AuthService.isAuthendicatedPromised().then(function (data) {
            if (data.Result === true) {
                $rootScope.isAuthorized = true;
            }
            else {
                $rootScope.isAuthorized = false;
            }
        });
    });
}]);

//service urls
app.factory('AppConstant', function () {    
    return {
        signupFacebookRedirectUrl: "http://localhost.local:40/signup/facebook",
    };
});

app.factory('USER_ROLES', function () {
    return {
        User: 'User',
        Admin: 'Admin'
    }
});