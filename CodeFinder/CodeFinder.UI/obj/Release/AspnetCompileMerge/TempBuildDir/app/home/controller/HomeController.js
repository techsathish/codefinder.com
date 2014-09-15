app.controller('HomeController', ["$scope", 'AppConstant', 'ProjectService', 'IsAuthenticated', function ($scope, AppConstant, ProjectService, IsAuthenticated) {
    
    $scope.childUpdate.isAuthenticated = IsAuthenticated;

    if (IsAuthenticated) {
        ProjectService.getProjects().then(function (data) {
            $scope.Projects = data;
        },
        function () {
            $scope.childUpdate.AddMessageIndicator({
                type: 'danger',
                msg: "Failed to fetch the project list."
            });
        });
    }
}]);