var app = angular.module('codefinder', ['ngRoute']);

app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);
}]);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'app/home/views/home.html',
            controller: 'HomeController'
        }).otherwise({
            redirectTo: '/'
        });
}]);