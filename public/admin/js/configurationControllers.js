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

            //var defaultLanguage = false;
            // var defaultLan = $scope.defaultLanguage;
            //if (defaultLan === "true") {
            // defaultLanguage = true;
            /// }

            var postData = {
                "id": null,
                "domainName": $scope.domainName,
                "siteName": $scope.siteName,
                "language": $scope.languageId,
                "siteDesc": $scope.desc,
                "registrationEmailActivationSubject": $scope.actEmailSub,
                "registrationEmailActivationTitle": $scope.actEmailTitle,
                "registrationEmailActivationGreeting": $scope.actEmailGreeting,
                "registrationEmailActivationMessage": $scope.actEmailMessage,
                "registrationEmailActivationUrl": $scope.actEmailUrl,
                "registrationEmailWelcomeSubject": $scope.welcomeEmailSub,
                "registrationEmailWelcomeTitle": $scope.welcomeEmailTitle,
                "registrationEmailWelcomeGreeting": $scope.welcomeEmailGreeting,
                "registrationEmailWelcomeMessage": $scope.welcomeEmailMessage,
                "registrationEmailWelcomeUrl": $scope.welcomeEmailUrl,
                "resetPasswordEmailSubject": $scope.passwordResetEmailSub,
                "resetPasswordEmailTitle": $scope.passwordResetEmailTitle,
                "resetPasswordEmailGreeting": $scope.passwordResetEmailGreeting,
                "resetPasswordEmailMessage": $scope.passwordResetEmailMessage,
                "resetPasswordEmailUrl": $scope.passwordResetEmailUrl


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



ulboraCmsConfigurationControllers.controller('NewConfigurationCtrl', ['$scope', 'checkCreds', '$location', '$http', 'getToken', 'LanguageList',
    function NewConfigurationCtrl($scope, checkCreds, $location, $http, getToken, LanguageList) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        LanguageList.getLanguageList({},
                function success(response) {
                    //alert($scope.challenge.question);
                    $scope.languageList = response;
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
                "domainName": $scope.domainName,
                "siteName": $scope.siteName,
                "language": $scope.languageId,
                "siteDesc": $scope.desc,
                "registrationEmailActivationSubject": $scope.actEmailSub,
                "registrationEmailActivationTitle": $scope.actEmailTitle,
                "registrationEmailActivationGreeting": $scope.actEmailGreeting,
                "registrationEmailActivationMessage": $scope.actEmailMessage,
                "registrationEmailActivationUrl": $scope.actEmailUrl,
                "registrationEmailWelcomeSubject": $scope.welcomeEmailSub,
                "registrationEmailWelcomeTitle": $scope.welcomeEmailTitle,
                "registrationEmailWelcomeGreeting": $scope.welcomeEmailGreeting,
                "registrationEmailWelcomeMessage": $scope.welcomeEmailMessage,
                "registrationEmailWelcomeUrl": $scope.welcomeEmailUrl,
                "resetPasswordEmailSubject": $scope.passwordResetEmailSub,
                "resetPasswordEmailTitle": $scope.passwordResetEmailTitle,
                "resetPasswordEmailGreeting": $scope.passwordResetEmailGreeting,
                "resetPasswordEmailMessage": $scope.passwordResetEmailMessage,
                "resetPasswordEmailUrl": $scope.passwordResetEmailUrl


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
                            alert("Possible duplicate");
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


ulboraCmsConfigurationControllers.controller('ConfigurationCtrl', ['$scope', 'checkCreds', '$location', "Configuration", '$routeParams', '$http', 'getToken', 'LanguageList',
    function ConfigurationCtrl($scope, checkCreds, $location, Configuration, $routeParams, $http, getToken, LanguageList) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();

        LanguageList.getLanguageList({},
                function success(lanList) {
                    //alert($scope.challenge.question);
                    $scope.languageList = lanList;
                    console.log("Success:" + JSON.stringify(lanList));

                    var configId = $routeParams.a;
                    Configuration.get({id: configId},
                    function success(response) {
                        //alert($scope.challenge.question);
                        console.log("Success:" + JSON.stringify(response));

                        $scope.id = response._id;
                        $scope.domainName = response.domainName;
                        $scope.siteName = response.siteName;
                        $scope.desc = response.siteDesc;
                        $scope.languageId = response.language;

                        $scope.actEmailSub = response.registrationEmailActivationSubject;
                        $scope.actEmailTitle = response.registrationEmailActivationTitle;
                        $scope.actEmailGreeting = response.registrationEmailActivationGreeting;
                        $scope.actEmailMessage = response.registrationEmailActivationMessage;
                        $scope.actEmailUrl = response.registrationEmailActivationUrl;

                        $scope.welcomeEmailSub = response.registrationEmailWelcomeSubject;
                        $scope.welcomeEmailTitle = response.registrationEmailWelcomeTitle;
                        $scope.welcomeEmailGreeting = response.registrationEmailWelcomeGreeting
                        $scope.welcomeEmailMessage = response.registrationEmailWelcomeMessage;
                        $scope.welcomeEmailUrl = response.registrationEmailWelcomeUrl;


                        $scope.passwordResetEmailSub = response.resetPasswordEmailSubject;
                        $scope.passwordResetEmailTitle = response.resetPasswordEmailTitle;
                        $scope.passwordResetEmailGreeting = response.resetPasswordEmailGreeting;
                        $scope.passwordResetEmailMessage = response.resetPasswordEmailMessage;
                        $scope.passwordResetEmailUrl = response.resetPasswordEmailUrl;


                    },
                            function error(errorResponse) {
                                console.log("Error:" + JSON.stringify(errorResponse));
                                //$location.path('/loginFailedForm');
                            }
                    );


                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
        );



        $scope.configurationActiveClass = "active";
    }]);



