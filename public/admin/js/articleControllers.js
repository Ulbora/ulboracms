'use strict';

/* Article Controllers */

var ulboraCmsArticleControllers = angular.module('ulboraCmsArticleControllers', []);



ulboraCmsArticleControllers.controller('ArticlesCtrl', ['$scope', 'checkCreds', '$location', 'ArticleList', 'DateUtil', '$http', 'getToken',
    function ArticlesCtrl($scope, checkCreds, $location, ArticleList, DateUtil, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        /*
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
         */
        //var header = "headers: {Authorization: 'Basic ' " + getToken() + "}";
        //$http.defaults.headers.common['Authorization: Basic '] = getToken();
        //$http.defaults.headers.common.authentication['Basic'] = getToken();
        //$http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        ArticleList.getArticleList({},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));

                    $scope.articleList = response;
                    for (var cnt = 0; cnt < $scope.articleList.length; cnt++) {
                        //alert($scope.articleList[cnt].title);
                        //var createDateLong = $scope.articleList[cnt].createdDate;
                        //$scope.articleList[cnt].createdDate = DateUtil.stringifyDate(createDateLong);

                        if ($scope.articleList[cnt].published === true) {
                            //var updateDateLong = $scope.articleList[cnt].modifiedDate;
                            //$scope.articleList[cnt].modifiedDate = DateUtil.stringifyDate(updateDateLong);
                            //;
                            $scope.articleList[cnt].published = "Yes";
                        } else {
                            $scope.articleList[cnt].published = "No";
                        }

                        if ($scope.articleList[cnt].frontPage === true) {
                            //var updateDateLong = $scope.articleList[cnt].modifiedDate;
                            //$scope.articleList[cnt].modifiedDate = DateUtil.stringifyDate(updateDateLong);
                            //;
                            $scope.articleList[cnt].frontPage = "Yes";
                        } else {
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

ulboraCmsArticleControllers.controller('ArticleCtrl', ['$scope', '$rootScope', '$routeParams', 'checkCreds',
    '$location', 'Article', '$http', 'getToken', 'ArticleValues',
    function ArticleCtrl($scope, $rootScope, $routeParams, checkCreds, $location, Article, $http, getToken, ArticleValues) {
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
        var postData = {
            "languageCode": "en-us"
        };
        ArticleValues.getValues({}, postData,
                function success(valuesResponse) {
                    $scope.articleValues = valuesResponse;
                });

        var articleId = $routeParams.a;
        Article.get({id: articleId},
        function success(response) {
            //alert($scope.challenge.question);
            console.log("Success:" + JSON.stringify(response));

            //var tempArticleReq = response;
            var result = "";

            result = atob(response.articleText.text);

            //$scope.trueVal = "true";
            // $scope.falseVal = "false";

            $scope.articleHtml = result;
            $scope.articleTextId = response.articleText._id;
            console.log("articleText" + result);//+ JSON.stringify(errorResponse));
            $scope.article = response;
            $scope.articleId = response._id;
            $scope.title = response.title;
            $scope.alias = response.alias;

            $scope.languageSelectId = response.language;
            $scope.languageId = response.language;
            //$scope.languageSelectName = tempArticleReq.article.language.name;
            /////////////////$scope.languageList = tempArticleReq.languageList;

            $scope.sectionSelectId = response.section;
            $scope.sectionId = response.section;
            //////////////////////////$scope.sectionList = tempArticleReq.sectionList;

            $scope.categorySelectId = response.category;
            $scope.categoryId = response.category;
            //////////////////////////$scope.categoryList = tempArticleReq.categoryList;

            var tempLoc = response.articleLocationList;
            if (tempLoc !== undefined && tempLoc !== null) {
                // $scope.locationSelectId = tempLoc[0];
                $scope.locationIds = tempLoc;
                console.log("locationIds:" + tempLoc)
            } else {
                $scope.locationSelectId = 0;

            }


            //////////////////////////////$scope.locationList = tempArticleReq.locationList;


            $scope.accessLevelSelectId = response.accessLevel;
            $scope.accessLevelId = response.accessLevel;
            /////////////////////////$scope.accessLevelList = tempArticleReq.accessLevelList;
            $scope.metaId = response.metaData;
            $scope.metaDescription = response.metaDesc;
            $scope.metaKeyWords = response.metaKeyWords;
            $scope.metaAuthorName = response.metaAuthorName;
            $scope.metaRobotKeyWords = response.metaRobotKeyWords;
            $scope.published = response.published.toString();
            // if(tempArticleReq.article.published.toString() === true){
            // $scope.publishedTrueValue = true;
            // $scope.publishedFalseValue = false;
            //}else{
            //  $scope.publishedValue = false;
            //}
            //var tempDate = new Date();
            //tempDate = tempDate.getTime();

            $scope.showTitle = response.showTitle.toString();
            $scope.showSectionName = response.showSectionName.toString();
            $scope.showCategoryName = response.showCategoryName.toString();
            $scope.showAuthor = response.showAuthor.toString();
            $scope.showCreateDate = response.showCreateDate.toString();
            $scope.showModifyDate = response.showModifyDate.toString();
            $scope.allowComments = response.allowComments.toString();
            $scope.commentsRequireLogin = response.commentsRequireLogin.toString();
            if (response.commentsStartDate !== undefined && response.commentsStartDate !== null &&
                    response.commentsEndDate !== undefined && response.commentsEndDate !== null) {
                $scope.commentsStartDate = new Date(response.commentsStartDate).toISOString().substring(0, 10);
                $scope.commentsEndDate = new Date(response.commentsEndDate).toISOString().substring(0, 10);
            }

            $scope.frontPage = response.frontPage.toString();
            $scope.authorName = response.user.firstName + " " + response.user.lastName;
            if (response.tag !== undefined && response.tag !== null) {
                $scope.tagKeyWords = response.tag.keyWords;
            }


            //var cDate = new Date(tempArticleReq.article.createdDate);            
            //$scope.createDate = cDate.getMonth()+"/"+cDate.getDate()+"/"+ cDate.getFullYear();
            $scope.createdDate = new Date(response.createdDate).toISOString().substring(0, 10);// response.createdDate;
            var modDate = response.modifiedDate;
            if (modDate !== undefined && modDate !== null) {
                //var mDate = new Date(modDate);
                //$scope.modifiedDate = mDate.getMonth()+"/"+mDate.getDate()+"/"+ mDate.getFullYear();
                $scope.modifiedDate = response.modifiedDate;
                $scope.showModDate = "true";
            } else {
                $scope.showModDate = "false";
            }
            if(response.menuIndex !== undefined && response.menuIndex !== null){
                $scope.menuIndex = response.menuIndex;
            }else{
                $scope.menuIndex = 0;
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



ulboraCmsArticleControllers.controller('ArticleEditCtrl', ['$scope', '$rootScope', 'Article', '$location', 'setCreds', '$http', 'getToken',
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
            
            var createdDate = $scope.createdDate;
            if(createdDate !== undefined && createdDate !== null){
                createdDate = new Date(createdDate);
            }//else{
                //alert("Create Date Required");
            //}
            
            var commentsStartDate = $scope.commentsStartDate;
            var commentsEndDate = $scope.commentsEndDate;
            if(commentsStartDate !== undefined && commentsStartDate !== null &&
                    commentsEndDate !== undefined && commentsEndDate !== null){
                commentsStartDate = new Date(commentsStartDate);
                commentsEndDate = new Date(commentsEndDate);
            }else{
                commentsStartDate = null;
                commentsEndDate = null;
            }

            $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();

            var textUpdated = tinymce.activeEditor.getContent();
            setTimeout(function() {
                //alert(tinyMCE.get('elm1'));
                //alert(tinymce.get('elm1'));
                var putData = {
                    "id": $scope.articleId,
                    "alias": $scope.alias,
                    "published": ($scope.published === "true"),
                    "showTitle": ($scope.showTitle === "true"),
                    "showSectionName": ($scope.showSectionName === "true"),
                    "showCategoryName": ($scope.showCategoryName === "true"),
                    "showAuthor": ($scope.showAuthor === "true"),
                    "showCreateDate": ($scope.showCreateDate === "true"),
                    "showModifyDate": ($scope.showModifyDate === "true"),
                    "allowComments": ($scope.allowComments === "true"),
                    "commentsRequireLogin": ($scope.commentsRequireLogin === "true"),
                    "createdDate": createdDate,
                    "commentsStartDate" : commentsStartDate,
                    "commentsEndDate" : commentsEndDate,
                    "title": $scope.title,
                    "articleText": {
                        "id": $scope.articleTextId,
                        "text": btoa(textUpdated)

                    },
                    "section": $scope.sectionId,
                    "category": $scope.categoryId,
                    "accessLevel": $scope.accessLevelId,
                    "locationList": $scope.locationIds,
                    "metaDesc": $scope.metaDescription,
                    "metaKeyWords": $scope.metaKeyWords,
                    "metaRobotKeyWords": $scope.metaRobotKeyWords,
                    "metaAuthorName": $scope.metaAuthorName,
                    "language": $scope.languageId,
                    "frontPage": ($scope.frontPage === "true"),
                    "tag": {
                        "keyWords": $scope.tagKeyWords
                    },
                    "menuIndex": $scope.menuIndex
                };
                console.log("locations:" + $scope.locationIds);
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





