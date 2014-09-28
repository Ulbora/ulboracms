'use strict';

/* Section Controllers */

var ulboraCmsAddonsControllers = angular.module('ulboraCmsAddonsControllers', []);

ulboraCmsAddonsControllers.controller('AddonsCtrl', ['$scope', 'checkCreds', '$location', 'AddonsList', '$http', 'getToken',
    function AddonsCtrl($scope, checkCreds, $location, AddonsList, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        AddonsList.getList({},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));

                    $scope.addonsList = response;

                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.addonsActiveClass = "active";
    }]);


ulboraCmsAddonsControllers.controller('DeleteAddonCtrl', ['$scope', 'Addons', '$location', '$route', '$http', 'getToken',
    function DeleteAddonCtrl($scope, Addons, $location, $route, $http, getToken) {
        $scope.delete = function(id, name) {
            var doDelete = confirm("Delete " + name);
            if (doDelete === true) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                Addons.delete({id: id},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    // put wate code here
                    //$rootScope.articleSaved = true;
                    $location.path('/addons');
                    $route.reload();
                },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                        }
                );

            }


        };
    }]);



ulboraCmsAddonsControllers.controller('AddonsAddCtrl', ['$scope', 'Addons', '$location', '$http', 'getToken',
    function AddonsAddCtrl($scope, Addons, $location, $http, getToken) {
        $scope.submit = function() {

            var basicAuth = false;
            if ($scope.basicAuth === "true") {
                basicAuth = true;
            }

            var postData = {
                "name": $scope.name,
                "url": $scope.url,
                "basicAuth": basicAuth,
                "username": $scope.username,
                "password": $scope.password,
                "requireUserLogin": $scope.requireUserLogin

            };
            $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
            console.log("json request:" + JSON.stringify(postData));
            Addons.save({}, postData,
                    function success(response) {
                        console.log("Success:" + JSON.stringify(response));
                        if (response.success === true) {
                            // set cookie
                            //setCreds($scope.username, $scope.password);
                            //$location.path('/');
                            console.log("Success:" + JSON.stringify(response));
                            $location.path('/addons');
                        } else {
                            //$location.path('/loginFailedForm');
                            console.log("Failed:" + JSON.stringify(response));
                        }
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                        //$location.path('/loginFailedForm');
                        $location.path('/addons');
                    }
            );


            //$location.path('/articles');
        },
                $scope.authOn = function() {
                    $scope.authBlock = "auth-on";
                },
                $scope.authOff = function() {
                    $scope.authBlock = "auth-off";
                };

    }]);

ulboraCmsAddonsControllers.controller('NewAddonsCtrl', ['$scope', 'checkCreds', '$location', '$http', 'getToken',
    function NewAddonsCtrl($scope, checkCreds, $location, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        $scope.basicAuth = "true";
        $scope.requireUserLogin = "true";


        $scope.newAddonActiveClass = "active";

    }]);


ulboraCmsLanguageControllers.controller('AddonEditCtrl', ['$scope', 'Addons', '$location', '$http', 'getToken',
    function AddonEditCtrl($scope, Addons, $location, $http, getToken) {
        $scope.submit = function() {
            var basicAuth = false;
            if($scope.basicAuth === "true"){
                basicAuth = true;
            }
            

            var putData = {
                "id": $scope.addonId,
                "name": $scope.name,
                "url": $scope.url,
                "basicAuth": basicAuth,
                "username": $scope.username,
                "password": $scope.password,
                "requireUserLogin": $scope.requireUserLogin
            };
            console.log("json request:" + JSON.stringify(putData));
            $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
            Addons.update({}, putData,
                    function success(response) {
                        //alert($scope.challenge.question);
                        console.log("Success:" + JSON.stringify(response));
                        if (response.success === true) {
                            // set cookie
                            //setCreds($scope.username, $scope.password);
                            //$location.path('/');
                            console.log("Success:" + JSON.stringify(response));
                            $location.path('/addons');
                        } else {
                            //$location.path('/loginFailedForm');
                            console.log("Failed:" + JSON.stringify(response));
                        }
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                        //$location.path('/loginFailedForm');
                        $location.path('/addons');
                    }
            );

        },
                $scope.authOn = function() {
                    $scope.authBlock = "auth-on";
                },
                $scope.authOff = function() {
                    $scope.authBlock = "auth-off";
                };


    }]);


ulboraCmsLanguageControllers.controller('AddonCtrl', ['$scope', 'checkCreds', '$location', "Addons", '$routeParams', '$http', 'getToken',
    function AddonCtrl($scope, checkCreds, $location, Addons, $routeParams, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        var languageId = $routeParams.a;
        Addons.get({id: languageId},
        function success(response) {
            //alert($scope.challenge.question);
            console.log("Success:" + JSON.stringify(response));

            $scope.addonId = response._id;
            $scope.addonShowId = response._id;
            $scope.name = response.name;
            $scope.url = response.url;
            var basicAuth = "false";
            if (response.basicAuth === true) {
                basicAuth = "true";
                $scope.authBlock = "auth-on";
            }else{
                $scope.authBlock = "auth-off";
            }
            $scope.basicAuth = basicAuth;
            $scope.username = response.username;
            $scope.password = response.password;
            if(response.requireUserLogin){
                $scope.requireUserLogin = "true";
            }else{
                $scope.requireUserLogin = "false";
            }
            

        },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.addonActiveClass = "active";
    }]);
