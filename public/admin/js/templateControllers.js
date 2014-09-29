'use strict';

/* Section Controllers */

var ulboraCmsTemplateControllers = angular.module('ulboraCmsTemplateControllers', []);

ulboraCmsTemplateControllers.controller('TemplatesCtrl', ['$scope', 'checkCreds', '$location', 'TemplateList', '$http', 'getToken',
    function TemplatesCtrl($scope, checkCreds, $location, TemplateList, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        TemplateList.getList({},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    $scope.templateList = response;
                    for (var cnt = 0; cnt < $scope.templateList.length; cnt++) {
                        //alert($scope.articleList[cnt].title);
                        //var createDateLong = $scope.articleList[cnt].createdDate;
                        //$scope.articleList[cnt].createdDate = DateUtil.stringifyDate(createDateLong);

                        if ($scope.templateList[cnt].defaultTemplate === true) {
                            //var updateDateLong = $scope.articleList[cnt].modifiedDate;
                            //$scope.articleList[cnt].modifiedDate = DateUtil.stringifyDate(updateDateLong);
                            //;
                            $scope.templateList[cnt].defaultTemplateStr = "Yes";
                        } else {
                            $scope.templateList[cnt].defaultTemplateStr = "No";
                        }


                    }
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.templatesActiveClass = "active";
    }]);

ulboraCmsTemplateControllers.controller('TemplateCtrl', ['$scope', 'checkCreds', '$location', "Template", '$routeParams', '$http', 'getToken',
    function TemplateCtrl($scope, checkCreds, $location, Template, $routeParams, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        var templateId = $routeParams.a;
        Template.get({id: templateId},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    $scope.templateId = response._id;
                    $scope.name = response.name;
                    if(response.defaultTemplate){
                        $scope.defaultTemplate = "true";
                    }else{
                        $scope.defaultTemplate = "false";
                    }
                    if(response.angularTemplate){
                        $scope.angularTemplate = "true";
                    }else{
                        $scope.angularTemplate = "false";
                    }


                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.templateActiveClass = "active";
    }]);




ulboraCmsTemplateControllers.controller('TemplateEditCtrl', ['$scope', 'Template', '$location', '$http', 'getToken',
    function TemplateEditCtrl($scope, Template, $location, $http, getToken) {
        $scope.submit = function () {
            
            var defaultTemplate = false;
            if($scope.defaultTemplate === "true"){
                defaultTemplate = true;
            }
            
            var angularTemplate = false;
            if($scope.angularTemplate === "true"){
                angularTemplate = true;
            }

            var putData = {
                "id": $scope.templateId,
                "name": $scope.name,                
                "defaultTemplate": defaultTemplate,
                "angularTemplate": angularTemplate
            };
            console.log("json request:" + JSON.stringify(putData));
            $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
            Template.update({}, putData,
                    function success(response) {
                        //alert($scope.challenge.question);
                        console.log("Success:" + JSON.stringify(response));
                        if (response.success === true) {
                            // set cookie
                            //setCreds($scope.username, $scope.password);
                            //$location.path('/');
                            console.log("Success:" + JSON.stringify(response));
                            $location.path('/templates');
                        } else {
                            //$location.path('/loginFailedForm');
                            console.log("Failed:" + JSON.stringify(response));
                        }
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                        //$location.path('/loginFailedForm');
                        $location.path('/templates');
                    }
            );

        };

    }]);


ulboraCmsTemplateControllers.controller('TemplateAddCtrl', ['$scope', 'Template', '$location', '$http', 'getToken',
    function TemplateAddCtrl($scope, Template, $location, $http, getToken) {
        $scope.submit = function() {
            
            var defaultTemplate = false;
            var defaultTemp = $scope.defaultTemplate;
            if(defaultTemp === "true"){
                defaultTemplate = true;
            }
            
            var angularTemplate = false;
            if($scope.angularTemplate === "true"){
                angularTemplate = true;
            }

            var postData = {
                "name": $scope.name,                
                "defaultTemplate" : defaultTemplate,
                "angularTemplate": angularTemplate
            };
            console.log("json request:" + JSON.stringify(postData));
            $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
            Template.save({}, postData,
                    function success(response) {
                        console.log("Success:" + JSON.stringify(response));
                        if (response.success === true) {
                            // set cookie
                            //setCreds($scope.username, $scope.password);
                            //$location.path('/');
                            console.log("Success:" + JSON.stringify(response));
                            $location.path('/templates');
                        } else {
                            //$location.path('/loginFailedForm');
                            console.log("Failed:" + JSON.stringify(response));
                        }
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                        //$location.path('/loginFailedForm');
                        $location.path('/templates');
                    }
            );


            //$location.path('/articles');
        };

    }]);

ulboraCmsTemplateControllers.controller('NewTemplateCtrl', ['$scope', 'checkCreds', '$location', '$http', 'getToken',
    function NewTemplateCtrl($scope, checkCreds, $location, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        $scope.defaultTemplate = "false";


        $scope.newTemplateActiveClass = "active";

    }]);



ulboraCmsTemplateControllers.controller('DeleteTemplateCtrl', ['$scope', '$rootScope', 'Template', '$location', '$route', '$http', 'getToken',
    function DeleteTemplateCtrl($scope, $rootScope, Template, $location, $route, $http, getToken) {
        $scope.delete = function(id, name) {
            var doDelete = confirm("Delete " + name);
            if (doDelete === true) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                Template.delete({id: id},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    // put wate code here                    
                    $location.path('/templates');
                    $route.reload();
                },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                        }
                );

            }


        };
    }]);
