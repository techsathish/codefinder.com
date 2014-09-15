app.controller('HomeController', ["$scope", 'AppConstant', 'CreateProjectService', 'IsAuthenticated', function ($scope, AppConstant, CreateProjectService, IsAuthenticated) {
    
    $scope.childUpdate.isAuthenticated = IsAuthenticated;

    if (IsAuthenticated) {
        CreateProjectService.getProjects().then(function (data) {
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