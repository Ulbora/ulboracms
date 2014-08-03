'use strict';

/* Controllers */

var ulboraCmsAdminControllers = angular.module('ulboraCmsAdminControllers', []);


ulboraCmsAdminControllers.controller('MainCtrl', ['$scope', 'checkCreds', '$location', '$document', 'AdminSummary', '$http', 'getToken', 'DateUtil',
    function MainCtrl($scope, checkCreds, $location, $document, AdminSummary, $http, getToken, DateUtil) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        $scope.brandColor = "color: white;";
        $scope.menu = "m1";
        
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        AdminSummary.get({},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    $scope.articleList = response.articleList;
                    for (var cnt = 0; cnt < $scope.articleList.length; cnt++) {
                        var artDateLong = $scope.articleList[cnt].modifiedDate;
                        if(artDateLong === null){
                            artDateLong = $scope.articleList[cnt].createdDate;
                        }
                        $scope.articleList[cnt].modifiedDate = DateUtil.stringifyDate(artDateLong);
                    }
                     console.log("Article:" + JSON.stringify($scope.articleList));
                    $scope.frontPageList = response.frontPageList;
                    for (var cnt = 0; cnt < $scope.frontPageList.length; cnt++) {
                        var fpDateLong = $scope.frontPageList[cnt].modifiedDate;
                        if(fpDateLong === null){
                            fpDateLong = $scope.frontPageList[cnt].createdDate;
                        }
                        $scope.frontPageList[cnt].modifiedDate = DateUtil.stringifyDate(fpDateLong);
                    }
                    $scope.categoryList = response.categoryList;
                    $scope.sectionList = response.sectionList;


                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

    }]);

ulboraCmsAdminControllers.controller('MainCtrl2', ['$scope', '$routeParams', 'checkCreds', '$location', 'AdminSummary', '$http', 'getToken', 'DateUtil',
    function MainCtrl2($scope, $routeParams, checkCreds, $location, AdminSummary, $http, getToken, DateUtil) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        $scope.brandColor = "color: white;";
        var page = $routeParams.p;
        if (page === "2") {
            $scope.menu = "m2";
        } else if (page === "3") {
            $scope.menu = "m3";
        } else if (page === "4") {
            $scope.menu = "m4";
        } else if (page === "5") {
            $scope.menu = "m5";
        }
        
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        AdminSummary.get({},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    $scope.articleList = response.articleList;
                    for (var cnt = 0; cnt < $scope.articleList.length; cnt++) {
                         var artDateLong = $scope.articleList[cnt].modifiedDate;
                        if(artDateLong === null){
                            artDateLong = $scope.articleList[cnt].createdDate;
                        }
                        $scope.articleList[cnt].modifiedDate = DateUtil.stringifyDate(artDateLong);
                    }
                    console.log("Article:" + JSON.stringify($scope.articleList));
                    
                    $scope.frontPageList = response.frontPageList;
                    for (var cnt = 0; cnt < $scope.frontPageList.length; cnt++) {
                         var fpDateLong = $scope.frontPageList[cnt].modifiedDate;
                        if(fpDateLong === null){
                            fpDateLong = $scope.frontPageList[cnt].createdDate;
                        }
                        $scope.frontPageList[cnt].modifiedDate = DateUtil.stringifyDate(fpDateLong);
                    }
                    $scope.categoryList = response.categoryList;
                    $scope.sectionList = response.sectionList;


                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );


    }]);







