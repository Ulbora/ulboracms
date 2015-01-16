'use strict';

/* Services */

var ulboraCmsServices = angular.module('ulboraCmsServices', ['ngResource', 'ngCookies']);

ulboraCmsServices.factory('Content', ['$resource',
    function ($resource) {
        return $resource("../rs/content", {}, {
            getContent: {method: 'POST', cache: false, isArray: false}
        });
    }]);

ulboraCmsServices.factory('Article', ['$resource',
    function ($resource) {
        return $resource("../rs/content/article/:id", {}, {
            get: {method: 'GET', cache: false, isArray: false}
        });
    }]);

ulboraCmsServices.factory('Login', ['$resource',
    function ($resource) {
        return $resource("../rs/public/login", {}, {
        });
    }]);

ulboraCmsServices.factory('Challenge', ['$resource',
    function ($resource) {
        return $resource("../rs/public/challenge", {}, {
            getChallenge: {method: 'GET', cache: false, isArray: false}
        });
    }]);

ulboraCmsServices.factory('Registration', ['$resource',
    function ($resource) {
        return $resource("../rs/public/register", {}, {
            //save: {method: 'POST', params: {}, isArray: false}
        });
    }]);


ulboraCmsServices.factory('Password', ['$resource',
    function ($resource) {
        return $resource("../rs/public/resetPassword", {}, {
            reset: {method: 'POST', params: {}, isArray: false}
        });
    }]);


ulboraCmsServices.factory('User', ['$resource',
    function ($resource) {
        return $resource("../rs/user/pw", {}, {
            changePassword: {method: 'POST', params: {}, isArray: false}
        });
    }]);


//default ulbora cms site services
ulboraCmsServices.factory('ContentUlboraSite', ['$resource', 
    function($resource) {
        return $resource("http://www.ulboracms.org/rs/content", {}, {
            getContent: {method: 'POST', cache : false, isArray: false}
        });
    }]);

ulboraCmsServices.factory('ArticleUlboraSite', ['$resource', 
    function($resource) {
        return $resource("http://www.ulboracms.org/rs/content/article/:id", {}, {
            get: {method: 'GET', cache : false, isArray: false}            
        });
    }]);