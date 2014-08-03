'use strict';

/* Category Controllers */

var ulboraCmsLinkControllers = angular.module('ulboraCmsLinkControllers', []);



ulboraCmsLinkControllers.controller('LinksCtrl', ['$scope', 'checkCreds', '$location', 'LinkList', '$http', 'getToken',
    function LinksCtrl($scope, checkCreds, $location, LinkList, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        LinkList.getList({},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));

                    $scope.linkList = response;

                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.linkActiveClass = "active";
    }]);


ulboraCmsLinkControllers.controller('DeleteLinkCtrl', ['$scope', 'Link', '$location', '$route', '$http', 'getToken',
    function DeleteLinkCtrl($scope, Link, $location, $route, $http, getToken) {
        $scope.deleteLink = function(id, name) {
            var doDelete = confirm("Delete " + name);
            if (doDelete === true) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                Link.delete({id: id},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    if (response.success === true) {
                        $location.path('/links');
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


ulboraCmsLinkControllers.controller('LinkAddCtrl', ['$scope', 'Link', '$location', '$http', 'getToken',
    function LinkAddCtrl($scope, Link, $location, $http, getToken) {
        $scope.submit = function() {

            var postData = {                
                "name": $scope.name,
                "link": $scope.link,
                "language": $scope.languageId   
            };

            console.log("json request:" + JSON.stringify(postData));
            $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
            Link.save({}, postData,
                    function success(response) {
                        console.log("Success:" + JSON.stringify(response));
                        if (response.success === true) {
                            // set cookie
                            //setCreds($scope.username, $scope.password);
                            //$location.path('/');
                            console.log("Success:" + JSON.stringify(response));
                            $location.path('/links');
                        } else {
                            //$location.path('/loginFailedForm');
                            console.log("Failed:" + JSON.stringify(response));
                            alert("Failed");
                        }
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                        //$location.path('/loginFailedForm');
                        $location.path('/links');
                        alert("Failed");
                    }
            );


            //$location.path('/articles');
        };

    }]);



ulboraCmsLinkControllers.controller('NewLinkCtrl', ['$scope', 'checkCreds', '$location', '$http', 'getToken', "LanguageList",
    function NewLinkCtrl($scope, checkCreds, $location, $http, getToken, LanguageList) {
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


        $scope.newLinkActiveClass = "active";

    }]);





ulboraCmsLinkControllers.controller('LinkEditCtrl', ['$scope', 'Link', '$location', '$http', 'getToken',
    function LinkEditCtrl($scope, Link, $location, $http, getToken) {
        $scope.submit = function() {

            var putData = {
                "id": $scope.linkId,
                "name": $scope.name,
                "link": $scope.link,
                "language": {
                    "id": $scope.languageId
                }
            };
            console.log("json request:" + JSON.stringify(putData));
            $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
            Link.update({}, putData,
                    function success(response) {
                        //alert($scope.challenge.question);
                        console.log("Success:" + JSON.stringify(response));
                        if (response.success === true) {
                            // set cookie
                            //setCreds($scope.username, $scope.password);
                            //$location.path('/');
                            console.log("Success:" + JSON.stringify(response));
                            $location.path('/links');
                        } else {
                            //$location.path('/loginFailedForm');
                            console.log("Failed:" + JSON.stringify(response));
                        }
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                        //$location.path('/loginFailedForm');
                        $location.path('/links');
                    }
            );

        };

    }]);


ulboraCmsLinkControllers.controller('LinkCtrl', ['$scope', 'checkCreds', '$location', "Link", '$routeParams', '$http', 'getToken',
    function LinkCtrl($scope, checkCreds, $location, Link, $routeParams, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();

        var configId = $routeParams.a;
        Link.get({id: configId},
        function success(response) {
            //alert($scope.challenge.question);
            console.log("Success:" + JSON.stringify(response));

            $scope.linkId = response.id;
            $scope.name = response.name;
            $scope.link = response.link;
            $scope.languageId = response.language.id;
            $scope.languageList = response.languageList;


        },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.linkActiveClass = "active";
    }]);



