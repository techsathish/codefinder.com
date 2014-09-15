app.controller('US_ProjectController',
    ['$scope', 'IsAuthenticated', '$location', 'UserService', '$timeout', '$filter', 'MyUtil', 'CreateProjectService', '$route',
        function ($scope, IsAuthenticated, $location, UserService, $timeout, $filter, MyUtil, CreateProjectService, $route) {

            $scope.isEdit = !$route.current.$$route.data.isCreate;
            $scope.isCreate = $route.current.$$route.data.isCreate;

            $scope.childUpdate.isAuthenticated = IsAuthenticated
            $scope.AddedUsers = [];

            $scope.EmailFieldError = "";

            $scope.isProjectEdit = false;

            $scope.AddMembers = function () {
                if (!$scope.MemberName) {
                    $scope.EmailFieldError = "Please enter email..."
                    return;
                }

                if (!MyUtil.validateEmail($scope.MemberName)) {
                    $scope.EmailFieldError = "Please enter valid email..."
                    return;
                }

                if ($filter('filter')($scope.AddedUsers, { emailId: $scope.MemberName }, true).length == 0) {
                    //get the user firstname
                    var UserDetailsSearch = {
                        Email: $scope.MemberName
                    };

                    UserService.userCommonDetailsPromised(UserDetailsSearch).then(function (data) {
                        if (data.Result && data.Result.FullName) {
                            $scope.AddedUsers.push({
                                emailId: $scope.MemberName,
                                name: data.Result.FullName,
                                canEditContent: false,
                                canAcceptRequirement: false,
                                IsActive: true,
                                userId: data.Result.UserId
                            });

                            $scope.EmailFieldError = "";
                        }
                        else {
                            $scope.EmailFieldError = "User is not registered using this email id.";
                        }
                    });
                }
                else {
                    //email id already added
                    $scope.EmailFieldError = "Email Id Already Added...";
                }
            };

            $scope.DeleteMember = function (hashKey) {
                angular.forEach($scope.AddedUsers, function (obj, index) {
                    if (obj.$$hashKey == hashKey) {
                        $scope.AddedUsers.splice(index, 1);
                        return;
                    }
                });
            };

            $scope.createProject_form_submitted = false;

            //create project
            $scope.CreateProject = function () {
                $scope.CreateProjectForm.submitted = true;

                if ($scope.CreateProjectForm.$valid) {
                    var project = { ProjectName: $scope.ProjectName, ProjectMembers: $scope.AddedUsers };

                    CreateProjectService.createProject(project).then(function (data) {
                        $scope.childUpdate.AddMessageIndicator({
                            type: 'success',
                            msg: "Project Created Successfully."
                        });

                        $location.path('/');
                    }, function (data) {
                        $scope.childUpdate.AddMessageIndicator({
                            type: 'danger',
                            msg: "Project Creation Failed."
                        });
                    });
                }
                else {
                    $scope.createProject_form_submitted = true;
                }
            }

            var memberNameTimeout;

            $scope.changeMemberName = function (newMember) {
                if (newMember) {
                    if (memberNameTimeout) $timeout.cancel(memberNameTimeout);

                    memberNameTimeout = $timeout(function () {
                        UserService.usernameSuggesionPromised(newMember).then(function (data) {
                            $scope.memberNameSuggested = data.Result;
                        });
                    }, 350);
                }
            };

        }]);