'use strict';

/* Section Controllers */

var ulboraCmsTemplateEngineControllers = angular.module('ulboraCmsTemplateEngineControllers', []);

ulboraCmsTemplateEngineControllers.controller('TemplateEnginesCtrl', ['$scope', 'checkCreds', '$location', 'TemplateEngineList', '$http', 'getToken',
    function TemplateEnginesCtrl($scope, checkCreds, $location, TemplateEngineList, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        TemplateEngineList.getList({},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    $scope.templateEngineList = response;
                    for (var cnt = 0; cnt < $scope.templateEngineList.length; cnt++) {
                        //alert($scope.articleList[cnt].title);
                        //var createDateLong = $scope.articleList[cnt].createdDate;
                        //$scope.articleList[cnt].createdDate = DateUtil.stringifyDate(createDateLong);

                        if ($scope.templateEngineList[cnt].defaultEngine === true) {
                            //var updateDateLong = $scope.articleList[cnt].modifiedDate;
                            //$scope.articleList[cnt].modifiedDate = DateUtil.stringifyDate(updateDateLong);
                            //;
                            $scope.templateEngineList[cnt].defaultEngineStr = "Yes";
                        } else {
                            $scope.templateEngineList[cnt].defaultEngineStr = "No";
                        }


                    }
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.templateEngineActiveClass = "active";
    }]);

ulboraCmsTemplateEngineControllers.controller('TemplateEngineCtrl', ['$scope', 'checkCreds', '$location', "TemplateEngine", '$routeParams', '$http', 'getToken',
    function TemplateEngineCtrl($scope, checkCreds, $location, TemplateEngine, $routeParams, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        var engineId = $routeParams.a;
        TemplateEngine.get({id: engineId},
        function success(response) {
            //alert($scope.challenge.question);
            console.log("Success:" + JSON.stringify(response));
            $scope.engineId = response._id;
            $scope.name = response.name;
            if (response.defaultEngine) {
                $scope.defaultEngine = "true";
            } else {
                $scope.defaultEngine = "false";
            }
            
        },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.templateEngineActiveClass = "active";
    }]);




ulboraCmsTemplateEngineControllers.controller('TemplateEngineEditCtrl', ['$scope', 'TemplateEngine', '$location', '$http', 'getToken',
    function TemplateEngineEditCtrl($scope, TemplateEngine, $location, $http, getToken) {
        $scope.submit = function () {

            var defaultEngine = false;
            if ($scope.defaultEngine === "true") {
                defaultEngine = true;
            }            

            var putData = {
                "id": $scope.engineId,
                "name": $scope.name,
                "defaultEngine": defaultEngine
            };
            console.log("json request:" + JSON.stringify(putData));
            $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
            TemplateEngine.update({}, putData,
                    function success(response) {
                        //alert($scope.challenge.question);
                        console.log("Success:" + JSON.stringify(response));
                        if (response.success === true) {
                            // set cookie
                            //setCreds($scope.username, $scope.password);
                            //$location.path('/');
                            console.log("Success:" + JSON.stringify(response));
                            $location.path('/templateEngines');
                        } else {
                            //$location.path('/loginFailedForm');
                            console.log("Failed:" + JSON.stringify(response));
                        }
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                        //$location.path('/loginFailedForm');
                        $location.path('/templateEngines');
                    }
            );

        };

    }]);




