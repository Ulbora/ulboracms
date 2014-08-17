'use strict';

/* Business Services */
/*
var ulboraCmsAdminServices = angular.module('ulboraCmsAdminServices', ['ngResource', 'ngCookies']);

ulboraCmsAdminServices.factory('Challenge', ['$resource',
    function($resource) {
        return $resource(siteUrl + "/user/getChallenge", {}, {
            getChallenge: {method: 'GET', params: {languageCode: "en_US"}, isArray: false}
        });
    }]);

ulboraCmsAdminServices.factory('Login', ['$resource',
    function($resource) {
        return $resource(siteUrl + "public/login", {}, {
        });
    }]);

ulboraCmsAdminServices.factory('ArticleValues', ['$resource', 'getToken',
    function($resource, getToken) {
        return $resource(siteUrl + "article/values", {}, {
            getValues: {method: 'GET', params: {languageCode: "en_US"}, isArray: false, headers: {Authorization: 'Basic ' + getToken()}}
        });
    }]);


ulboraCmsAdminServices.factory('ArticleList', ['$resource', 'getToken',
    function($resource, getToken) {
        return $resource(siteUrl + "article/list", {}, {
            getArticleList: {method: 'POST', isArray: true, headers: {Authorization: 'Basic ' + getToken()}}
        });
    }]);

*/
//---business logic services only------------------------------------------------------------------
var ulboraCmsAdminBusinessServices = angular.module('ulboraCmsAdminBusinessServices', ['ngResource', 'ngCookies']);

ulboraCmsAdminBusinessServices.factory('checkCreds', ['$cookies', function($cookies) {
        return function() {
            var returnVal = false;
            var ulboraCreds = $cookies.ulboraCreds;
            if (ulboraCreds !== undefined && ulboraCreds !== "") {
                returnVal = true;
            }
            return returnVal;
        };

    }]);

ulboraCmsAdminBusinessServices.factory('getToken', ['$cookies', function($cookies) {
        return function() {
            var returnVal = "";
            var ulboraCreds = $cookies.ulboraCreds;
            if (ulboraCreds !== undefined && ulboraCreds !== "") {
                returnVal = btoa(ulboraCreds);
            }
            return returnVal;
        };

    }]);

ulboraCmsAdminBusinessServices.factory('getUsername', ['$cookies', function($cookies) {
        return function() {
            var returnVal = "";
            var ulboraUsername = $cookies.ulboraUsername;
            if (ulboraUsername !== undefined && ulboraUsername !== "") {
                returnVal = ulboraUsername;
            }
            return returnVal;
        };

    }]);



ulboraCmsAdminBusinessServices.factory('setCreds', ['$cookies', function($cookies) {
        return function(un, pw) {
            var token = un.concat(":", pw);
            $cookies.ulboraCreds = token;
            $cookies.ulboraUsername = un;
        };

    }]);

ulboraCmsAdminBusinessServices.factory('deleteCreds', ['$cookies', function($cookies) {
        return function() {
            $cookies.ulboraCreds = "";
            $cookies.ulboraUsername = "";
        };
    }]);

ulboraCmsAdminBusinessServices.factory('Page', function() {
    var title = 'default';
    return {
        title: function() {
            return title;
        },
        setTitle: function(newTitle) {
            title = newTitle;
        }
    };
});

ulboraCmsAdminBusinessServices.factory('DateUtil', function() {
    return {
        stringifyDate: function(dateLong) {
            var theDate = new Date(dateLong);
            var month = theDate.getMonth();
            month++;            
            var day = theDate.getDate();
            var year = theDate.getFullYear();
            var dateStr = month + "/" + day + "/" + year;
            return dateStr;
        }
    };
});

