'use strict';

/* Category Controllers */

var ulboraCmsMediaControllers = angular.module('ulboraCmsMediaControllers', []);

ulboraCmsMediaControllers.controller('MediaListCtrl', ['$scope', 'checkCreds', '$location', 'MediaList', '$http', 'getToken',
    function MediaListCtrl($scope, checkCreds, $location, MediaList, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        MediaList.getMediaList({}, 
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));

                    $scope.mediaList = response;                    
                   
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.mediaActiveClass = "active";
    }]);


ulboraCmsMediaControllers.controller('DeleteMediaCtrl', ['$scope', 'Media', '$location', '$route', '$http', 'getToken',
    function DeleteMediaCtrl($scope, Media, $location, $route, $http, getToken) {
        $scope.deleteMedia = function(id, name) {
            var doDelete = confirm("Delete " + name);
            if (doDelete === true) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                Media.delete({id: id},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    // put wate code here
                    //$rootScope.articleSaved = true;
                    if (response.success === true) {
                        $location.path('/mediaList');
                    } else {
                        alert("Failed");
                    }
                    
                    $route.reload();
                },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                        }
                );

            }


        };
    }]);

/*
ulboraCmsMediaControllers.controller('MediaAddCtrl', ['$scope', 'MediaUpload', '$location', '$http', 'getToken',
    function MediaAddCtrl($scope, MediaUpload, $location, $http, getToken) {
        $scope.submit = function() {            
            
                var postData = {                    
                    "name": $scope.name,
                    "uploadKey": $scope.uploadKey,
                    "username" : $scope.username,
                    "errorLink" : $scope.errorLink,
                    "returnLink": $scope.returnLink,
                    "file" : $scope.file
                };
                console.log("json request:" + JSON.stringify(postData));
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                MediaUpload.addMedia({}, postData,
                        function success(response) {                            
                            console.log("Success:" + JSON.stringify(response));
                            if (response.success === true) {
                                // set cookie
                                //setCreds($scope.username, $scope.password);
                                //$location.path('/');
                                console.log("Success:" + JSON.stringify(response));
                                $location.path('/mediaList');
                            } else {
                                //$location.path('/loginFailedForm');
                                console.log("Failed:" + JSON.stringify(response));
                            }
                        },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                            //$location.path('/loginFailedForm');
                            $location.path('/mediaList');
                        }
                );
           

            //$location.path('/articles');
        };

    }]);
*/
ulboraCmsMediaControllers.controller('NewMediaCtrl', ['$scope', 'checkCreds', '$location', "ArticleValues", '$http', 'getToken',
    function NewMediaCtrl($scope, checkCreds, $location, ArticleValues, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        ArticleValues.getValues({}, 
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));

                    $scope.uploadKey = response.uploadKey; 
                    $scope.errorUrl = clientUrl;
                    $scope.mediaUrl = clientUrl + "/#!/mediaList/";
                    $scope.username = response.username;
                    $scope.api = siteUrl + "media/upload";
                   
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );
        
        
        $scope.newMediaActiveClass = "active";

    }]);


ulboraCmsMediaControllers.controller('MediaCtrl', ['$scope', 'checkCreds', '$location', 'Media', '$routeParams', '$http', 'getToken',
    function MediaCtrl($scope, checkCreds, $location, Media, $routeParams, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        var mediaId = $routeParams.a;
        //$scope.link = $routeParams.link;
        //$scope.name = $routeParams.name;
        
        Media.get({id: mediaId},
        function success(response) {
            //alert($scope.challenge.question);
            console.log("Success:" + JSON.stringify(response));

            $scope.mediaId = response.id;
            $scope.name = response.name;
            $scope.imageLink = response.imageLink;
            $scope.imageType = response.extension;
            

        },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        
    }]);

ulboraCmsMediaControllers.controller('MediaEditCtrl', ['$scope', 'Media', '$location', '$http', 'getToken',
    function MediaEditCtrl($scope, Media, $location, $http, getToken) {
        $scope.submit = function() {
            
            var putData = {
                "id": Number($scope.mediaId),
                "name": $scope.name                
            };
            console.log("json request:" + JSON.stringify(putData));
            $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
            Media.update({}, putData,
                    function success(response) {
                        //alert($scope.challenge.question);
                        console.log("Success:" + JSON.stringify(response));
                        if (response.success === true) {
                            // set cookie
                            //setCreds($scope.username, $scope.password);
                            //$location.path('/');
                            console.log("Success:" + JSON.stringify(response));
                            $location.path('/mediaList');
                        } else {
                            //$location.path('/loginFailedForm');
                            console.log("Failed:" + JSON.stringify(response));
                        }
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                        //$location.path('/loginFailedForm');
                        $location.path('/mediaList');
                    }
            );

        };

    }]);