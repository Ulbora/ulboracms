'use strict';
/* Comments Controllers */

var ulboraCmsMailServerControllers = angular.module('ulboraCmsMailServerControllers', []);

ulboraCmsMailServerControllers.controller('MailServerCtrl', ['$scope', "$routeParams", 'checkCreds', 'MailServer', '$location', '$http', 'getToken',
    function MailServerCtrl($scope, $routeParams, checkCreds, MailServer, $location, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        //var commentId = $routeParams.a;
        MailServer.get({},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    //authMethodList = PLAIN, CRAM-MD5, LOGIN
                    $scope.authMethodList = ["PLAIN", "CRAM-MD5", "LOGIN"];
                    $scope.mailServerId = response._id;
                    $scope.smtpHost = response.smtpHost;
                    $scope.smtpPort = response.smtpPort;
                    $scope.secure = response.secure.toString();
                    $scope.username = response.username;
                    $scope.password = "****";
                    $scope.ignoreTLS = response.ignoreTLS.toString();
                    $scope.debug = response.debug.toString();
                    if (response.authMethod === undefined || response.authMethod === null || response.authMethod.length === 0) {
                        $scope.authMethod = "PLAIN";
                    } else {
                        $scope.authMethod = response.authMethod;
                    }

                    $scope.tls = response.tls;

                    //if (response.approved === true) {
                    //$scope.approvedStr = "Yes";
                    //} else {
                    // $scope.approvedStr = "No";
                    //}



                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.mailServerActiveClass = "active";


    }]);



ulboraCmsMailServerControllers.controller('MailServerEditCtrl', ['$scope', "$routeParams", 'checkCreds', 'MailServer', '$location', '$http', 'getToken',
    function MailServerEditCtrl($scope, $routeParams, checkCreds, MailServer, $location, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();

        $scope.submit = function() {
            var submitForm = true;
            var password = null;
            var username = $scope.username;
            if(username === undefined || username === null){
                username = "";
            }            
            if($scope.password === "****"){
                password = "";
            }else if($scope.password.length === 0){
                submitForm = false;
                alert("Password Required");
            }else{
                password = $scope.password;
            }
            if(isNaN($scope.smtpPort !== "" && $scope.smtpPort)){
                submitForm = false;
                alert("Port must be a number");
            }
            if(($scope.secure === "true") && username.length === 0){
                submitForm = false;
                alert("Username required");
            }
            
            if (submitForm) {
                var putData = {
                    "id": $scope.mailServerId,
                    "smtpHost": $scope.smtpHost,
                    "smtpPort": $scope.smtpPort,
                    "secure": ($scope.secure === "true"),
                    "username": $scope.username,
                    "password": password,
                    "ignoreTLS": ($scope.ignoreTLS === "true"),
                    "debug": ($scope.debug === "true"),
                    "authMethod": $scope.authMethod
                };
                console.log("json request:" + JSON.stringify(putData));
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                MailServer.update({}, putData,
                        function success(response) {
                            //alert($scope.challenge.question);
                            console.log("Success:" + JSON.stringify(response));
                            if (response.success === true) {
                                // set cookie
                                //setCreds($scope.username, $scope.password);
                                //$location.path('/');
                                console.log("Success:" + JSON.stringify(response));
                                $location.path('/');
                            } else {
                                //$location.path('/loginFailedForm');
                                console.log("Failed:" + JSON.stringify(response));
                            }
                        },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                            //$location.path('/loginFailedForm');
                            //$location.path('/');
                        }
                );
            }


        };


    }]);

