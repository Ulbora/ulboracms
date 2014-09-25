'use strict';
/* Comments Controllers */

var ulboraCmsCommentsControllers = angular.module('ulboraCmsCommentsControllers', []);
ulboraCmsCommentsControllers.controller('CommentsCtrl', ['$scope', 'checkCreds', '$location', 'CommentList', '$http', 'getToken',
    function CommentsCtrl($scope, checkCreds, $location, CommentList, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        CommentList.getCommentList({},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));

                    $scope.commentList = response;
                    for (var cnt = 0; cnt < $scope.commentList.length; cnt++) {
                        //alert($scope.articleList[cnt].title);
                        //var createDateLong = $scope.articleList[cnt].createdDate;
                        //$scope.articleList[cnt].createdDate = DateUtil.stringifyDate(createDateLong);

                        if ($scope.commentList[cnt].approved === true) {
                            //var updateDateLong = $scope.articleList[cnt].modifiedDate;
                            //$scope.articleList[cnt].modifiedDate = DateUtil.stringifyDate(updateDateLong);
                            //;
                            $scope.commentList[cnt].approvedStr = "Yes";
                        } else {
                            $scope.commentList[cnt].approvedStr = "No";
                        }


                    }
                    // if (response.success === true) {
                    // set cookie
                    //setCreds($scope.username, $scope.password);
                    //$location.path('/');
                    // } else {
                    //$location.path('/loginFailedForm');
                    //}
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.commentsActiveClass = "active";
    }]);




ulboraCmsCommentsControllers.controller('CommentCtrl', ['$scope', "$routeParams", 'checkCreds', 'Comment', '$location', '$http', 'getToken',
    function CommentCtrl($scope, $routeParams, checkCreds, Comment, $location, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        var commentId = $routeParams.a;
        Comment.get({id: commentId},
        function success(response) {
            //alert($scope.challenge.question);
            console.log("Success:" + JSON.stringify(response));

            $scope.commentId = response._id;
            $scope.text = response.text;
            $scope.articleTitle = response.articleTitle;
            $scope.commenter = response.commenter;
            $scope.approved = response.approved.toString();
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

        $scope.commentsActiveClass = "active";       


    }]);



ulboraCmsCommentsControllers.controller('CommentEditCtrl', ['$scope', "$routeParams", 'checkCreds', 'Comment', '$location', '$http', 'getToken',
    function CommentEditCtrl($scope, $routeParams, checkCreds, Comment, $location, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();      

        $scope.submit = function() {            
            var putData = {
                "id": $scope.commentId,
                "text": $scope.text,                
                "approved": ($scope.approved === "true")
            };
            console.log("json request:" + JSON.stringify(putData));
            $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
            Comment.update({}, putData,
                    function success(response) {
                        //alert($scope.challenge.question);
                        console.log("Success:" + JSON.stringify(response));
                        if (response.success === true) {
                            // set cookie
                            //setCreds($scope.username, $scope.password);
                            //$location.path('/');
                            console.log("Success:" + JSON.stringify(response));
                            $location.path('/comments');
                        } else {
                            //$location.path('/loginFailedForm');
                            console.log("Failed:" + JSON.stringify(response));
                        }
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                        //$location.path('/loginFailedForm');
                        $location.path('/comments');
                    }
            );

        };


    }]);


ulboraCmsCommentsControllers.controller('DeleteCommentCtrl', ['$scope', '$rootScope', 'Comment', '$location', '$route', '$http', 'getToken',
    function DeleteCommentCtrl($scope, $rootScope, Comment, $location, $route, $http, getToken) {
        $scope.delete = function(id, name) {
            var doDelete = confirm("Delete " + name);
            if (doDelete === true) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                Comment.delete({id: id},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    // put wate code here                    
                    $location.path('/comments');
                    $route.reload();
                },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                        }
                );

            }


        };
    }]);
