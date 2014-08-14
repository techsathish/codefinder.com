'use strict';

/*
 * angular-google-plus-directive v0.0.1
 * ♡ CopyHeart 2013 by Jerad Bitner http://jeradbitner.com
 * Copying is an act of love. Please copy.
 */

angular.module('directive.g+signin', []).
  directive('googlePlusSignin', function () {
      var ending = /\.apps\.googleusercontent\.com$/;

      return {
          restrict: 'E',
          template: '<button id="googleSignup" type="button" class="btn btn-warning"><span></span> &nbsp;<i class="fa fa-google-plus fa-2x"></i></button>',
          replace: true,
          link: function (scope, element, attrs) {
              if (attrs.innertext) {
                  element.find("span").html(attrs.innertext);
              }
              // Asynchronously load the G+ SDK.
              (function () {
                  var po = document.createElement('script');
                  po.type = 'text/javascript'; po.async = true;
                  po.src = 'https://apis.google.com/js/client:plusone.js?onload=googlePlusRender';
                  var s = document.getElementsByTagName('script')[0];
                  s.parentNode.insertBefore(po, s);
              })();
          }
      };
  }).run(['$window', '$rootScope', function ($window, $rootScope) {
      $window.googlePlusSignupFlag = 0;

      $window.signinCallback = function (authResult) {
          if (authResult["g-oauth-window"]) {
              if ($window.googlePlusSignupFlag == 0) {

                  if (authResult && authResult.access_token) {
                      $rootScope.$broadcast('event:google-plus-signin-success', authResult);
                  } else {
                      $rootScope.$broadcast('event:google-plus-signin-failure', authResult);
                  }

                  $window.googlePlusSignupFlag++;
              }
              else {
                  $window.googlePlusSignupFlag = 0;
              }
          }
      };

      $window.googlePlusRender = function () {
          gapi.signin.render('googleSignup', {
              'callback': 'signinCallback',
              'clientid': '785562233866-mcn381u70fh6qma0tiv203mh29t1i309.apps.googleusercontent.com',
              'cookiepolicy': 'single_host_origin',
              'requestvisibleactions': 'http://schema.org/AddAction',
              'scope': 'https://www.googleapis.com/auth/plus.login  https://www.googleapis.com/auth/plus.profile.emails.read'
          });
      };
  }]);


