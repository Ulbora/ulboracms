'use strict';

//---business logic services only------------------------------------------------------------------

var ulboraCmsBusinessServices = angular.module('ulboraCmsBusinessServices', ['ngResource', 'ngCookies']);

ulboraCmsBusinessServices.factory('checkCreds', ['$cookies', function($cookies) {
        return function() {
            var returnVal = false;
            var ulboraCreds = $cookies.ulboraCreds;
            if (ulboraCreds !== undefined && ulboraCreds !== "") {
                returnVal = true;
            }
            return returnVal;
        };

    }]);

ulboraCmsBusinessServices.factory('getToken', ['$cookies', function($cookies) {
        return function() {
            var returnVal = "";
            var ulboraCreds = $cookies.ulboraCreds;
            if (ulboraCreds !== undefined && ulboraCreds !== "") {
                returnVal = btoa(ulboraCreds);
            }
            return returnVal;
        };

    }]);

ulboraCmsBusinessServices.factory('getUsername', ['$cookies', function($cookies) {
        return function() {
            var returnVal = "";
            var ulboraUsername = $cookies.ulboraUsername;
            if (ulboraUsername !== undefined && ulboraUsername !== "") {
                returnVal = ulboraUsername;
            }
            return returnVal;
        };

    }]);



ulboraCmsBusinessServices.factory('setCreds', ['$cookies', function($cookies) {
        return function(un, pw) {
            var token = un.concat(":", pw);
            $cookies.ulboraCreds = token;
            $cookies.ulboraUsername = un;
        };

    }]);

ulboraCmsBusinessServices.factory('deleteCreds', ['$cookies', function($cookies) {
        return function() {
            $cookies.ulboraCreds = "";
            $cookies.ulboraUsername = "";
        };
    }]);

ulboraCmsBusinessServices.factory('Page', function() {
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

ulboraCmsBusinessServices.factory('DateUtil', function() {
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

