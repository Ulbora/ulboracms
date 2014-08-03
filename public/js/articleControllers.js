'use strict';

/* Article Controllers */

var ulboraCmsArticleControllers = angular.module('ulboraCmsArticleControllers', []);



ulboraCmsArticleControllers.controller('ArticlesCtrl', ['$scope', 'checkCreds', '$location', 'ArticleList', 'DateUtil', '$http', 'getToken',
    function ArticlesCtrl($scope, checkCreds, $location, ArticleList, DateUtil, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        var searchDate = {
            "orderParams": {
                "title": false,
                "createDate": false,
                "author": false
            },
            "searchParams": {
                "categoryId": null,
                "sectionId": null,
                "userId": null
            }

        };
        //var header = "headers: {Authorization: 'Basic ' " + getToken() + "}";
       //$http.defaults.headers.common['Authorization: Basic '] = getToken();
       //$http.defaults.headers.common.authentication['Basic'] = getToken();
        //$http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        ArticleList.getArticleList({}, searchDate,
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));

                    $scope.articleList = response;
                    for (var cnt = 0; cnt < $scope.articleList.length; cnt++) {
                        //alert($scope.articleList[cnt].title);
                        var createDateLong = $scope.articleList[cnt].createdDate;
                        $scope.articleList[cnt].createdDate = DateUtil.stringifyDate(createDateLong);

                        if ($scope.articleList[cnt].published === true) {
                            //var updateDateLong = $scope.articleList[cnt].modifiedDate;
                            //$scope.articleList[cnt].modifiedDate = DateUtil.stringifyDate(updateDateLong);
                            //;
                            $scope.articleList[cnt].published = "Yes";
                        }else{
                            $scope.articleList[cnt].published = "No";
                        }
                        
                        if ($scope.articleList[cnt].frontPage === true) {
                            //var updateDateLong = $scope.articleList[cnt].modifiedDate;
                            //$scope.articleList[cnt].modifiedDate = DateUtil.stringifyDate(updateDateLong);
                            //;
                            $scope.articleList[cnt].frontPage = "Yes";
                        }else{
                            $scope.articleList[cnt].frontPage = "No";
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

        $scope.articleActiveClass = "active";
    }]);

ulboraCmsArticleControllers.controller('ArticleCtrl', ['$scope', '$rootScope', '$routeParams', 'checkCreds', '$location', 'Article', '$http', 'getToken',
    function ArticleCtrl($scope, $rootScope, $routeParams, checkCreds, $location, Article, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        $scope.brandColor = "color: white;";
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

        var articleId = $routeParams.a;
        Article.get({id: articleId, lastVersion: true, version: -1},
        function success(response) {
            //alert($scope.challenge.question);
            console.log("Success:" + JSON.stringify(response));
            
            var tempArticleReq = response;
            var result = "";

            result = atob(tempArticleReq.article.textList[0].text);
            
            //$scope.trueVal = "true";
           // $scope.falseVal = "false";

            $scope.articleHtml = result;
            $scope.articleTextId = tempArticleReq.article.textList[0].id;
            console.log(result);//+ JSON.stringify(errorResponse));
            $scope.article = tempArticleReq.article;
            $scope.articleId = tempArticleReq.article.id;
            $scope.title = tempArticleReq.article.title;
            $scope.alias = tempArticleReq.article.alias;

            $scope.languageSelectId = tempArticleReq.article.language.id;
            $scope.languageId = tempArticleReq.article.language.id;
            //$scope.languageSelectName = tempArticleReq.article.language.name;
            $scope.languageList = tempArticleReq.languageList;

            $scope.sectionSelectId = tempArticleReq.article.section.id;
            $scope.sectionId = tempArticleReq.article.section.id;
            $scope.sectionList = tempArticleReq.sectionList;

            $scope.categorySelectId = tempArticleReq.article.category.id;
            $scope.categoryId = tempArticleReq.article.category.id;
            $scope.categoryList = tempArticleReq.categoryList;

            var tempLoc = tempArticleReq.article.location;
            if (tempLoc !== null) {
                $scope.locationSelectId = tempArticleReq.article.location.id;
                $scope.locationId = tempArticleReq.article.location.id;
            } else {
                $scope.locationSelectId = 0;

            }


            $scope.locationList = tempArticleReq.locationList;


            $scope.accessLevelSelectId = tempArticleReq.article.accessLevel.id;
            $scope.accessLevelId = tempArticleReq.article.accessLevel.id;
            $scope.accessLevelList = tempArticleReq.accessLevelList;
            $scope.metaId = tempArticleReq.article.metaData.id;
            $scope.metaDescription = tempArticleReq.article.metaData.metaDescription;
            $scope.metaKeyWords = tempArticleReq.article.metaData.metaKeyWords;
            $scope.metaAuthorName = tempArticleReq.article.metaData.metaAuthorName;
            $scope.metaRobotKeyWords = tempArticleReq.article.metaData.metaRobotKeyWords;
            $scope.published = tempArticleReq.article.published.toString();
           // if(tempArticleReq.article.published.toString() === true){
              // $scope.publishedTrueValue = true;
              // $scope.publishedFalseValue = false;
            //}else{
              //  $scope.publishedValue = false;
            //}
             
            
            $scope.showTitle = tempArticleReq.article.showTitle.toString();
            $scope.showSectionName = tempArticleReq.article.showSectionName.toString();
            $scope.showCategoryName = tempArticleReq.article.showCategoryName.toString();
            $scope.showAuthor = tempArticleReq.article.showAuthor.toString();
            $scope.showCreationDate = tempArticleReq.article.showCreationDate.toString();
            $scope.showModifiedDate = tempArticleReq.article.showModifiedDate.toString();
            $scope.frontPage = tempArticleReq.article.frontPage.toString();
            $scope.authorName = tempArticleReq.article.author.firstName + " " + tempArticleReq.article.author.lastName;
            
            var cDate = new Date(tempArticleReq.article.createdDate);            
            $scope.createDate = cDate.getMonth()+"/"+cDate.getDate()+"/"+ cDate.getFullYear();
            
            var modDate = tempArticleReq.article.modifiedDate;   
            if(modDate !== null){
                var mDate = new Date(modDate);
                $scope.modifiedDate = mDate.getMonth()+"/"+mDate.getDate()+"/"+ mDate.getFullYear();
                $scope.showModDate = "true";
            }else{
                $scope.showModDate = "false";
            }
            

            //$scope.published = "false";

            // put wate code here
            //$location.path('/articles');

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
            //$rootScope.tmce = tinymce;

        },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
        );






        $scope.message = "hello";
    }]);



ulboraCmsArticleControllers.controller('ArticleEditCtrl', ['$scope', '$rootScope', 'Article', '$location', 'setCreds','$http', 'getToken',
    function ArticleEditCtrl($scope, $rootScope, Article, $location, setCreds, $http, getToken) {
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
                var putData = {
                    "id": Number($scope.articleId),
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
                            "id": Number($scope.articleTextId),
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
                        "id": Number($scope.metaId),
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
                console.log("json request:" + JSON.stringify(putData));
                Article.update({}, putData,
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



ulboraCmsArticleControllers.controller('DeleteArticlesCtrl', ['$scope', '$rootScope', 'Article', '$location', '$route', '$http', 'getToken',
    function DeleteArticlesCtrl($scope, $rootScope, Article, $location, $route, $http, getToken) {
        $scope.deleteArticle = function(id, name) {
            var doDelete = confirm("Delete " + name);
            if (doDelete === true) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                Article.delete({id: id},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    // put wate code here
                    $rootScope.articleSaved = true;
                    $location.path('/articles');
                    $route.reload();
                },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                        }
                );

            }


        };
    }]);



ulboraCmsArticleControllers.controller('UploadArticleCtrl', ['$scope', 'checkCreds', '$location', 'ArticleValues', '$http', 'getToken',
    function UploadArticleCtrl($scope, checkCreds, $location, ArticleValues, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        $scope.articleUrl = clientUrl + "/#!/article/";
        $scope.errorUrl = clientUrl;
        $scope.api = siteUrl + "pdf";
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        $scope.articleValues = ArticleValues.getValues({},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
        );
        $scope.uploadArticleActiveClass = "active";
    }]);





