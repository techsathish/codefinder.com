app.controller('US_ProjectController',
    ['$scope', 'IsAuthenticated', '$location', 'UserService', '$timeout', '$filter', 'MyUtil', 'CreateProjectService', 'UpdateProjectService', '$route', '$routeParams',
        function ($scope, IsAuthenticated, $location, UserService, $timeout, $filter, MyUtil, CreateProjectService, UpdateProjectService, $route, $routeParams) {

            $scope.isProjectEdit = !$route.current.$$route.data.isCreate;
            $scope.isProjectCreate = $route.current.$$route.data.isCreate;

            var currentProjectId = $routeParams.projectid || 0;

            $scope.childUpdate.isAuthenticated = IsAuthenticated
            $scope.AddedUsers = [];

            $scope.EmailFieldError = "";

            $scope.deleteClick = function () {
                UpdateProjectService.deleteProject().then(function (data) {
                    $scope.childUpdate.AddMessageIndicator({
                        type: 'success',
                        msg: "Project deleted successfully."
                    });

                    $location.path('/');
                }, function (data) {
                    $scope.childUpdate.AddMessageIndicator({
                        type: 'danger',
                        msg: "Project delete failed"
                    });
                });
            };

            $scope.AddMembers = function () {
                if (!$scope.MemberName) {
                    $scope.EmailFieldError = "Please enter email..."
                    return;
                }

                if (!MyUtil.validateEmail($scope.MemberName)) {
                    $scope.EmailFieldError = "Please enter valid email..."
                    return;
                }


                if ($filter('filter')($scope.AddedUsers, { EmailId: $scope.MemberName }, true).length == 0) {
                    //get the user firstname
                    var UserDetailsSearch = {
                        Email: $scope.MemberName
                    };

                    UserService.userCommonDetailsPromised(UserDetailsSearch).then(function (data) {
                        if (data.Result && data.Result.FullName) {
                            $scope.AddedUsers.push({
                                EmailId: $scope.MemberName,
                                Name: data.Result.FullName,
                                CanEditContent: false,
                                CanAcceptRequirement: false,
                                IsActive: true,
                                userId: data.Result.UserId,
                                ProjectId: currentProjectId,
                                IsNew: true
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
                    $scope.EmailFieldError = "Email id already added...";
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

            $scope.submitClick = function () {
                if ($scope.isProjectEdit) {
                    $scope.UpdateProject();
                }
                else {
                    $scope.CreateProject();
                }
            };

            //create project
            $scope.CreateProject = function () {
                if ($scope.CreateProjectForm.$valid) {
                    //CREATE
                    var project = { ProjectName: $scope.ProjectName, ProjectMembers: $scope.AddedUsers };

                    CreateProjectService.createProject(project).then(function (data) {
                        $scope.childUpdate.AddMessageIndicator({
                            type: 'success',
                            msg: "Project created successfully."
                        });

                        $location.path('/');
                    }, function (data) {
                        $scope.childUpdate.AddMessageIndicator({
                            type: 'danger',
                            msg: "Project creation failed."
                        });
                    });
                }
                else {
                    $scope.CreateProjectForm.submitted = true;
                }
            };

            $scope.UpdateProject = function () {
                $scope.CreateProjectForm.submitted = true;

                if ($scope.CreateProjectForm.$valid) {
                    //UPDATE
                    var project = { ProjectId: currentProjectId, ProjectName: $scope.ProjectName, ProjectMembers: $scope.AddedUsers };

                    UpdateProjectService.updateProjectAndMembers(project).then(function (data) {
                        $scope.childUpdate.AddMessageIndicator({
                            type: 'success',
                            msg: "Project updated successfully."
                        });

                        $location.path('/');
                    }, function (data) {
                        $scope.childUpdate.AddMessageIndicator({
                            type: 'danger',
                            msg: "Project update failed."
                        });
                    });
                }
                else {
                    $scope.createProject_form_submitted = true;
                }
            };

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
            

            //If the project is edit mode populate the data
            if ($scope.isProjectEdit) {
                UpdateProjectService.getProjectAndMembers(currentProjectId).then(function (data) {
                    var project = data;
                    $scope.ProjectName = project.ProjectName;
                    $scope.AddedUsers = project.ProjectMembers;                    
                });
            }

        }]);