app.controller('SignUpController', ['$scope', 'IsAuthenticated', 'SignInService', 'SignupService', 'SignUpModels', 'AppConstant', '$q', '$location', '$sce', '$http', 'UserService', function ($scope, IsAuthenticated, SignInService, SignupService, SignUpModels, AppConstant, $q, $location, $sce, $http, UserService) {
    $scope.childUpdate.isAuthenticated = IsAuthenticated;
    $scope.ShowWarning = false;
    var locationHref = $location.search(); 

    //sitetemp start

    $scope.email = "ittechsathish@hotmail.com";
    $scope.password = "Password@123";

    //sitetemp ends

    $scope.signInClick = function () {
        var SignInModels = {
            UserName: $scope.email,
            Password: $scope.password,
            LoginType: 'codefinder'
        };

        SignInUser(SignInModels).then(function (signInClickResult) {
            if (signInClickResult.Result) {
                //set the current user object
                UserService.userProfile.set({ email: signInClickResult.Result.Email, name: signInClickResult.Result.FullName });
                $scope.childUpdate.MyProfileOptions = [
                    signInClickResult.Result.Email
                ];
                
                if (AppConstant.redirectUrl) {
                    $location.path(AppConstant.redirectUrl);
                    AppConstant.redirectUrl = null;
                }
                else {
                    $location.path("/");
                }
                //if (redirectToUrlAfterLogin.url) {
                //    $location.path(redirectToUrlAfterLogin.url);
                //}
                //else {
                    
                //}

                //$scope.$parent.update();
            }
            else {
                $scope.ShowWarning = true;
                $scope.ErrorMsgPanel = $sce.trustAsHtml(signInClickResult.Message);
            }
        });
    };

    $scope.signupClick = function () {
        SignUpModels.UserId = 0;
        SignUpModels.FullName = $scope.name;
        SignUpModels.EmailId = $scope.email;
        SignUpModels.password = $scope.password;
        SignUpModels.RetypePassword = $scope.retypePassword;
        SignUpModels.SignUpFrom = "CodeFinder";

        SignUpUser(SignUpModels).then(signupCallback);
    };

    function SignInUser(SignInModels) {
        var defered = $q.defer();

        SignInService.loginUser(SignInModels)
          .success(function (data, status, headers) {
              defered.resolve(data);
          })
          .error(function (data, status, headers, config) {
              defered.resolve(data);
          });

        return defered.promise;
    }

    function signupCallback(result) {
        if (result && result.Status) {
            if (result.data.Status == 0) {
                $location.path("/");
            }
            else {
                ValidateHelpSignup(result.data);
            }
        }
        else {
            ValidateHelpSignup(result.data);
        }
    }

    function ValidateHelpSignup(data) {
        $scope.ShowWarning = true;

        $scope.ErrorMessage = data.Message;

        if (data.Message == "DuplicateUserName") {
            $scope.ErrorMessage = "Email Id Already Exists. Please <a ng-href='/signin'>login Here</a>";
        }

        $scope.ErrorMsgPanel = $sce.trustAsHtml($scope.ErrorMessage);
    }

    function SignUpUser(SignUpModels) {
        var defered = $q.defer();

        SignupService.registerUser(SignUpModels)
          .success(function (data, status, headers) {
              var result = {
                  'status': 'success',
                  data: data
              };

              defered.resolve(result);
          })
          .error(function (data, status, headers, config) {
              var result = {
                  'status': 'failure',
                  data: data
              };

              defered.resolve(result);
          });

        return defered.promise;
    }

    function GetFacebookData() {
        var defered = $q.defer();

        /* make the API call */
        FB.api(
            "/me",
            function (response) {
                if (response && !response.error) {
                    defered.resolve(response);
                }
            }
        );

        return defered.promise;
    }

    function IsUserExist(email) {

        var defered = $q.defer();

        SignInService.IsUserExist(email)
        .success(function (data, status, headers) {
            var result = {
                'status': 'success',
                data: data
            };

            defered.resolve(result);
        })
      .error(function (data, status, headers, config) {
          var result = {
              'status': 'failure',
              data: data
          };

          defered.resolve(result);
      });

        return defered.promise;


    }

    var facebookAccessToken, googleAccessToken;

    $scope.faceBookSignUpClick = function () {
        //var defered = $q.defer();

        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                facebookAccessToken = response.authResponse.accessToken;

                GetFacebookData().then(function (result) {
                    if (result.email) {
                        IsUserExist(result.email).then(function (userExistResult) {
                            if(userExistResult.status == "success" && userExistResult.data.Result == true){
                                SignInUser({
                                    UserName: result.email,
                                    AccessToken: FB.getAuthResponse()['accessToken'],
                                    LoginType: 'Facebook'
                                }).then(function (SignInUserResult) {                                
                                    if (SignInUserResult.Result == true) {
                                        if (locationHref.returnUrl) {
                                            $location.path(locationHref.returnUrl);
                                        }
                                        else {
                                            $location.path("/");
                                        }
                                    }
                                    else {
                                        $scope.ShowWarning = true;
                                        $scope.ErrorMsgPanel = $sce.trustAsHtml(signInClickResult.Message);
                                    }
                                });
                            }                           
                            else {
                                SignUpModels.UserId = 0;
                                SignUpModels.FirstName = result.name;
                                SignUpModels.EmailId = result.email;
                                SignUpModels.password = "";
                                SignUpModels.RetypePassword = "";
                                SignUpModels.SignUpFrom = "Facebook";

                                SignUpUser(SignUpModels).then(signupCallback);
                            }
                        });                        
                    }
                    else {
                        $scope.ErrorMsgPanel = "Your email address is required for Registration.";
                        $scope.ShowWarning = true;
                    }

                    //defered.resolve("success");
                });
            }
            else {
                window.location = encodeURI("https://www.facebook.com/dialog/oauth?client_id=1439849022953181&redirect_uri=" + AppConstant.signupFacebookRedirectUrl + "&response_type=token&scope=email,public_profile");
            }
        }, {
            scope: 'email,first_name,gender'
        });

        //return defered.promise;
    };

    $scope.googleSignUp = function (data) {
        if (!data.error) {
            SignUpModels.UserId = 0;
            SignUpModels.FirstName = data.displayName
            SignUpModels.EmailId = data.emails[0].value;
            SignUpModels.password = "";
            SignUpModels.RetypePassword = "";
            SignUpModels.SignUpFrom = "Google";

            SignUpUser(SignUpModels).then(signupCallback);
        }
        else {
            $scope.ErrorMsgPanel = "Your email address is required for Registration.";
            $scope.ShowWarning = true;
        }
    }

    $scope.signupCancelClick = function () {
        $location.path("/");
    };

    //facebook signup
    var location = $location.path();

    if (location == "/signup/facebook") {
        fbEnsureInit(function () {
            $scope.faceBookSignUpClick();
        });
    }


    //google signup
    $scope.$on('event:google-plus-signin-success', function (event, authResult) {
        // User successfully authorized the G+ App!
        var access_token = authResult['access_token'];

        var api_url = "https://www.googleapis.com/plus/v1/people/me?access_token=" + access_token;

        $http({ method: 'GET', url: api_url })
        .success(function (data, status, headers, config) {
            $scope.googleSignUp(data);
        }).error(function (data, status, headers, config) {

        });

    });

    $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
        // User has not authorized the G+ App!
        console.log(authResult);
    });

    //sitetemp start

    //$scope.signInClick();

    //sitetemp ends
}]);