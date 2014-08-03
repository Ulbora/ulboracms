'use strict';

/* Article Controllers */

var ulboraCmsNewArticleControllers = angular.module('ulboraCmsNewArticleControllers', []);

ulboraCmsNewArticleControllers.controller('NewArticlesCtrl', ['$scope', '$rootScope', 'checkCreds', '$location', 'ArticleValues', '$http', 'getToken',
    function NewArticlesCtrl($scope, $rootScope, checkCreds, $location, ArticleValues, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        //$scope.message = "hello";        
        $scope.newArticleActiveClass = "active";
        //$scope.brandColor = "color: white;";
        $scope.tinymceWrapper = "mb-tinymce-hidden-wrapper";


        $scope.$on("$locationChangeStart", function(event) {
            if ($rootScope.articleSaved !== true) {
                var c = confirm("Exit without saving?");
                if (c !== true) {
                    event.preventDefault();
                }
            } else {
                $rootScope.articleSaved = false;
            }



        });
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        $scope.articleValues = ArticleValues.getValues({},
                function success(response) {
                    //alert($scope.challenge.question);
                    $scope.published = "false";
                    $scope.showTitle = "true";
                    $scope.showSectionName = "false";
                    $scope.showCategoryName = "false";
                    $scope.showAuthor = "false";
                    $scope.showCreationDate = "false";
                    $scope.showModifiedDate = "false";
                    $scope.frontPage = "false";

                    setTimeout(function() {

                        $scope.$apply(function() {
                            $scope.tinymceWrapper = "mb-tinymce-wrapper";
                        });


                        tinymce.init({
                            selector: "textarea#elm1",
                            theme: "modern",
                            //width: 100,
                            height: 300,
                            plugins: [
                                "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
                                "searchreplace wordcount visualblocks visualchars code insertdatetime media nonbreaking",
                                "save table contextmenu directionality emoticons template paste textcolor"
                            ],
                            content_css: "css/content.css",
                            toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | l      ink image | print preview media fullpage | forecolor backcolor emoticons",
                            //onchange_callback: function(editor) {
                            // tinyMCE.triggerSave();
                            // $("#" + editor.id).valid();
                            //alert("test");
                            //}

                        });

                    }, 500);

                    console.log("Success:" + JSON.stringify(response));
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
        );










    }]);



ulboraCmsNewArticleControllers.controller('ArticleAddCtrl', ['$scope', '$rootScope', 'Article', '$location', 'setCreds', '$http', 'getToken',
    function ArticleAddCtrl($scope, $rootScope, Article, $location, setCreds, $http, getToken) {
        $scope.submit = function() {
            $rootScope.articleSaved = true;

            //alert();
            //$rootScope.tmce.get('elm1').save();
            //tinymce.triggerSave();
            //tinymce.get('elm1').save();
            //alert(tinymce.activeEditor.getContent())
            //alert($scope.published);
            //alert(Boolean($scope.published));


            $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
            var textUpdated = tinymce.activeEditor.getContent();
            setTimeout(function() {
                //alert(tinyMCE.get('elm1'));
                //alert(tinymce.get('elm1'));
                var postData = {                    
                    "alias": $scope.alias,
                    "published": ($scope.published === "true"),
                    "showTitle": ($scope.showTitle === "true"),
                    "showSectionName": ($scope.showSectionName === "true"),
                    "showCategoryName": ($scope.showCategoryName === "true"),
                    "showAuthor": ($scope.showAuthor === "true"),
                    "showCreationDate": ($scope.showCreationDate === "true"),
                    "showModifiedDate": ($scope.showModifiedDate === "true"),
                    "title": $scope.title,
                    "textList": [
                        {                            
                            "text": btoa(textUpdated)

                        }
                    ],
                    "section": {
                        "id": Number($scope.sectionId)
                    },
                    "category": {
                        "id": Number($scope.categoryId)
                    },
                    "accessLevel": {
                        "id": Number($scope.accessLevelId)
                    },
                    "location": {
                        "id": Number($scope.locationId)
                    },
                    "metaData": {                        
                        "metaDescription": $scope.metaDescription,
                        "metaKeyWords": $scope.metaKeyWords,
                        "metaRobotKeyWords": $scope.metaRobotKeyWords,
                        "metaAuthorName": $scope.metaAuthorName
                    },
                    "language": {
                        "id": Number($scope.languageId)

                    },
                    "frontPage": ($scope.frontPage === "true")
                };
                console.log("json request:" + JSON.stringify(postData));
                Article.save({}, postData,
                        function success(response) {
                            //alert($scope.challenge.question);
                            console.log("Success:" + JSON.stringify(response));
                            if (response.success === true) {
                                // set cookie
                                //setCreds($scope.username, $scope.password);
                                //$location.path('/');
                                console.log("Success:" + JSON.stringify(response));
                                $location.path('/articles');
                            } else {
                                //$location.path('/loginFailedForm');
                                console.log("Failed:" + JSON.stringify(response));
                            }
                        },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                            //$location.path('/loginFailedForm');
                            $location.path('/articles');
                        }
                );
            }, 500);

            //$location.path('/articles');
        };

    }]);
