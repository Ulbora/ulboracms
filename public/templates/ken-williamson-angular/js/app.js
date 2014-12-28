'use strict';

/* App Module */

var ulboraCmsApp = angular.module('ulboraCmsApp', [
    'ngRoute',    
    "ngAnimate",
    'ngCookies',
    'ulboraCmsControllers',
    'ulboraCmsBusinessServices',
    'ulboraCmsServices'
]);

ulboraCmsApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
                when('/', {
                    templateUrl: 'partials/main.html',
                    controller: 'MainCtrl'
                }).when('/archive/:month/:year', {
                    templateUrl: 'partials/archives.html',
                    controller: 'ArchiveCtrl'
                }).when('/article/:a', {
                    templateUrl: 'partials/article.html',
                    controller: 'ArticleCtrl'
                }).when('/menuArticle/:a/:name', {
                    templateUrl: 'partials/article.html',
                    controller: 'ArticleCtrl'
                }).when('/register', {
                    templateUrl: 'partials/register.html',
                    controller: 'RegistrationNewCtrl'
                }).when('/changePassword', {
                    templateUrl: 'partials/changePassword.html',
                    controller: 'PasswordChangeCtrl'
                }).when('/processSuccess', {
                    templateUrl: 'partials/processSuccess.html',
                    controller: 'ProcessSuccessCtrl'
                }).when('/processFailure', {
                    templateUrl: 'partials/processFailure.html',
                    controller: 'ProcessFailureCtrl'
                }).when('/login', {
                    templateUrl: 'partials/login.html',
                    controller: 'LoginScreenCtrl'
                }).when('/resetPassword', {
                    templateUrl: 'partials/resetPassword.html',
                    controller: 'PasswordResetCtrl'
                }).when('/loginFailedForm', {
                    templateUrl: 'partials/login.html',
                    controller: 'LoginFailedFormCtrl'
                }).when('/logOut', {
                    templateUrl: 'partials/logOut.html',
                    controller: 'LogOutCtrl'
                });

        $locationProvider.html5Mode(false).hashPrefix('!');
    }]);


