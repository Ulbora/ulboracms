'use strict';

/* Category Controllers */

var ulboraCmsConfigurationControllers = angular.module('ulboraCmsConfigurationControllers', []);



ulboraCmsConfigurationControllers.controller('ConfigurationsCtrl', ['$scope', 'checkCreds', '$location', 'ConfigurationList', '$http', 'getToken',
    function ConfigurationsCtrl($scope, checkCreds, $location, ConfigurationList, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        ConfigurationList.getList({},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));

                    $scope.configurationList = response;

                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.configurationActiveClass = "active";
    }]);


ulboraCmsConfigurationControllers.controller('DeleteConfigurationCtrl', ['$scope', 'Configuration', '$location', '$route', '$http', 'getToken',
    function DeleteConfigurationCtrl($scope, Configuration, $location, $route, $http, getToken) {
        $scope.deleteConfiguration = function(id, name) {
            var doDelete = confirm("Delete " + name);
            if (doDelete === true) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                Configuration.delete({id: id},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    if (response.success === true) {
                        $location.path('/configurations');
                    } else {
                        alert("Failed");
                    }

                    $route.reload();
                },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                            alert("Failed");
                        }
                );

            }


        };
    }]);


ulboraCmsConfigurationControllers.controller('ConfigurationAddCtrl', ['$scope', 'Configuration', '$location', '$http', 'getToken',
    function ConfigurationAddCtrl($scope, Configuration, $location, $http, getToken) {
        $scope.submit = function() {

            var defaultLanguage = false;
            var defaultLan = $scope.defaultLanguage;
            if (defaultLan === "true") {
                defaultLanguage = true;
            }

            var postData = {
                "id": null,
                "domainName" : $scope.domainName,
                "metaData": {
                    "id": null,
                    "metaDescription": $scope.metaDesc,
                    "metaKeyWords": $scope.metaKeywords,
                    "metaRobotKeyWords": $scope.robotKeywords,
                    "metaAuthorName": $scope.metaAuthor
                },
                "configurationTextList": [
                    {
                        "id": null,
                        "siteName": $scope.siteName,
                        "siteDescription": $scope.desc,
                        "language": {
                            "id": Number($scope.languageId)
                        },
                        "signOnMessage": $scope.signOnMessage,
                        "rememberMeMessage": $scope.rememberMeMessage,
                        "forgotPasswordMessage": $scope.forgotPasswordMessage,
                        "usernameLabel": $scope.usernameLabel,
                        "passwordLabel": $scope.passwordLabel,
                        "loginButtonLabel": $scope.loginButtonLabel,
                        "passwordRecoveryMessage": $scope.passwordRecoveryMessage,
                        "passwordRecoveryButtonLabel": $scope.passwordRecoveryButtonLabel,
                        "changePasswordMessage": $scope.changePasswordMessage,
                        "oldPasswordLabel": $scope.oldPasswordLabel,
                        "newPasswordLabel": $scope.newPasswordLabel,
                        "confirmPasswordLabel": $scope.confirmPasswordLabel,
                        "changePasswordButtonLabel": $scope.changePasswordButtonLabel,
                        "logoutMessage": $scope.logoutMessage
                    }
                ]
            };

            console.log("json request:" + JSON.stringify(postData));
            $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
            Configuration.save({}, postData,
                    function success(response) {
                        console.log("Success:" + JSON.stringify(response));
                        if (response.success === true) {
                            // set cookie
                            //setCreds($scope.username, $scope.password);
                            //$location.path('/');
                            console.log("Success:" + JSON.stringify(response));
                            $location.path('/configurations');
                        } else {
                            //$location.path('/loginFailedForm');
                            console.log("Failed:" + JSON.stringify(response));
                            alert("Possible duplicate");
                        }
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                        //$location.path('/loginFailedForm');
                        $location.path('/configurations');
                        alert("Failed");
                    }
            );


            //$location.path('/articles');
        };

    }]);



ulboraCmsConfigurationControllers.controller('NewConfigurationCtrl', ['$scope', 'checkCreds', '$location', '$http', 'getToken', 'ArticleValues',
    function NewConfigurationCtrl($scope, checkCreds, $location, $http, getToken, ArticleValues) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        ArticleValues.getValues({},
                function success(response) {
                    //alert($scope.challenge.question);
                    $scope.languageList = response.languageList;
                    console.log("Success:" + JSON.stringify(response));
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
        );


        $scope.newConfigurationActiveClass = "active";

    }]);





ulboraCmsConfigurationControllers.controller('ConfigurationEditCtrl', ['$scope', 'Configuration', '$location', '$http', 'getToken',
    function ConfigurationEditCtrl($scope, Configuration, $location, $http, getToken) {
        $scope.submit = function() {
            
            var putData = {
                "id": $scope.id,
                "domainName" : $scope.domainName,
                "metaData": {
                    "id": $scope.metaId,
                    "metaDescription": $scope.metaDesc,
                    "metaKeyWords": $scope.metaKeywords,
                    "metaRobotKeyWords": $scope.robotKeywords,
                    "metaAuthorName": $scope.metaAuthor
                },
                "configurationTextList": [
                    {
                        "id": $scope.confTextId,
                        "siteName": $scope.siteName,
                        "siteDescription": $scope.desc,
                        "language": {
                            "id": Number($scope.languageId)
                        },
                        "signOnMessage": $scope.signOnMessage,
                        "rememberMeMessage": $scope.rememberMeMessage,
                        "forgotPasswordMessage": $scope.forgotPasswordMessage,
                        "usernameLabel": $scope.usernameLabel,
                        "passwordLabel": $scope.passwordLabel,
                        "loginButtonLabel": $scope.loginButtonLabel,
                        "passwordRecoveryMessage": $scope.passwordRecoveryMessage,
                        "passwordRecoveryButtonLabel": $scope.passwordRecoveryButtonLabel,
                        "changePasswordMessage": $scope.changePasswordMessage,
                        "oldPasswordLabel": $scope.oldPasswordLabel,
                        "newPasswordLabel": $scope.newPasswordLabel,
                        "confirmPasswordLabel": $scope.confirmPasswordLabel,
                        "changePasswordButtonLabel": $scope.changePasswordButtonLabel,
                        "logoutMessage": $scope.logoutMessage
                    }
                ]
            };
            console.log("json request:" + JSON.stringify(putData));
            $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
            Configuration.update({}, putData,
                    function success(response) {
                        //alert($scope.challenge.question);
                        console.log("Success:" + JSON.stringify(response));
                        if (response.success === true) {
                            // set cookie
                            //setCreds($scope.username, $scope.password);
                            //$location.path('/');
                            console.log("Success:" + JSON.stringify(response));
                            $location.path('/configurations');
                        } else {
                            //$location.path('/loginFailedForm');
                            console.log("Failed:" + JSON.stringify(response));
                        }
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                        //$location.path('/loginFailedForm');
                        $location.path('/configurations');
                    }
            );

        };

    }]);


ulboraCmsConfigurationControllers.controller('ConfigurationCtrl', ['$scope', 'checkCreds', '$location', "Configuration", '$routeParams', '$http', 'getToken',
    function ConfigurationCtrl($scope, checkCreds, $location, Configuration, $routeParams, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();

        var configId = $routeParams.a;
        Configuration.get({id: configId},
        function success(response) {
            //alert($scope.challenge.question);
            console.log("Success:" + JSON.stringify(response));

            $scope.id = response.id;
            $scope.domainName = response.domainName;
            $scope.metaId = response.metaData.id;
            $scope.metaDesc = response.metaData.metaDescription;
            $scope.metaKeywords= response.metaData.metaKeyWords;
            $scope.robotKeywords = response.metaData.metaRobotKeyWords;
            $scope.metaAuthor = response.metaData.metaAuthorName;
            for(var cnt = 0; cnt < response.configurationTextList.length; cnt++) {
                $scope.confTextId = response.configurationTextList[cnt].id;
                $scope.siteName = response.configurationTextList[cnt].siteName;
                $scope.desc = response.configurationTextList[cnt].siteDescription;
                $scope.languageId = response.configurationTextList[cnt].language.id;
                $scope.signOnMessage = response.configurationTextList[cnt].signOnMessage;
                $scope.rememberMeMessage = response.configurationTextList[cnt].rememberMeMessage;
                $scope.forgotPasswordMessage = response.configurationTextList[cnt].forgotPasswordMessage;
                $scope.usernameLabel = response.configurationTextList[cnt].usernameLabel;
                $scope.passwordLabel = response.configurationTextList[cnt].passwordLabel;
                $scope.loginButtonLabel = response.configurationTextList[cnt].loginButtonLabel;
                $scope.passwordRecoveryMessage = response.configurationTextList[cnt].passwordRecoveryMessage;
                $scope.passwordRecoveryButtonLabel = response.configurationTextList[cnt].passwordRecoveryButtonLabel;
                $scope.changePasswordMessage = response.configurationTextList[cnt].changePasswordMessage;
                $scope.oldPasswordLabel = response.configurationTextList[cnt].oldPasswordLabel;
                $scope.newPasswordLabel = response.configurationTextList[cnt].newPasswordLabel;
                $scope.confirmPasswordLabel = response.configurationTextList[cnt].confirmPasswordLabel;
                $scope.changePasswordButtonLabel = response.configurationTextList[cnt].changePasswordButtonLabel;
                $scope.logoutMessage = response.configurationTextList[cnt].logoutMessage;
            }
            $scope.languageList = response.languageList;
            

        },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.configurationActiveClass = "active";
    }]);



