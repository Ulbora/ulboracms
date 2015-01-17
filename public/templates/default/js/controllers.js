'use strict';

/* Controllers */

var ulboraCmsControllers = angular.module('ulboraCmsControllers', []);

ulboraCmsControllers.controller('MainCtrl', ['$scope', 'checkCreds', '$location', '$http', 'getToken', 'Content', 'ContentUlboraSite', '$sce',
    function MainCtrl($scope, checkCreds, $location, $http, getToken, Content, ContentUlboraSite, $sce) {
        $scope.brandColor = "color: white;";
        if (checkCreds() === true) {
            $scope.loggedIn = true;
        } else {
            $scope.loggedIn = false;
        }
        $scope.showContent = false;
        $scope.useUlboraSite = false;
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        var postData = {
            "frontPage": true,
            "links": true,
            "articles": true,
            "products": true,
            "searchFilter": [
                {
                    "sectionName": "MainPage",
                    "categoryName": null
                },
                {
                    "sectionName": "Tech",
                    "categoryName": null
                },
                {
                    "sectionName": "About",
                    "categoryName": null
                },
                {
                    "sectionName": "Menu",
                    "categoryName": null
                }
            ]

        };
        var contentLen = 0;
        console.log("json request:" + JSON.stringify(postData));
        Content.getContent({}, postData,
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    contentLen = response.articleLocations.FrontPage.length;
                    $scope.content = response;
                    if (response.links !== null && response.links.length > 0) {
                        $scope.showLinks = true;
                    } else {
                        $scope.showLinks = false;
                    }

                    if (response.articleLocations.Left.length > 0) {
                        $scope.showNewsFlash = true;
                    } else {
                        $scope.showNewsFlash = false;
                    }

                    if (response.articleLocations.Right.length > 0) {
                        $scope.showNews = true;
                    } else {
                        $scope.showNews = false;
                    }

                    for (var cnt = 0; cnt < response.articleLocations.FrontPage.length; cnt++) {
                        $scope.content.articleLocations.FrontPage[cnt].articleText.text = $sce.trustAsHtml(atob(response.articleLocations.FrontPage[cnt].articleText.text));

                    }
                    $scope.showContent = true;
                    console.log("Html:");
                    console.log(JSON.stringify($scope.content));

                    if (contentLen === 0) {
                        console.log("content count" + contentLen);
                        ContentUlboraSite.getContent({}, postData,
                                function success(response) {
                                    $scope.useUlboraSite = true;
                                    //alert($scope.challenge.question);
                                    console.log("Success:" + JSON.stringify(response));
                                    contentLen = response.articleLocations.FrontPage.length;
                                    $scope.content = response;
                                    if (response.links !== null && response.links.length > 0) {
                                        $scope.showLinks = true;
                                    } else {
                                        $scope.showLinks = false;
                                    }

                                    if (response.articleLocations.Left.length > 0) {
                                        $scope.showNewsFlash = true;
                                    } else {
                                        $scope.showNewsFlash = false;
                                    }

                                    if (response.articleLocations.Right.length > 0) {
                                        $scope.showNews = true;
                                    } else {
                                        $scope.showNews = false;
                                    }

                                    for (var cnt = 0; cnt < response.articleLocations.FrontPage.length; cnt++) {
                                        $scope.content.articleLocations.FrontPage[cnt].articleText.text = $sce.trustAsHtml(atob(response.articleLocations.FrontPage[cnt].articleText.text));

                                    }
                                    $scope.showContent = true;
                                    console.log("Html:");
                                    console.log(JSON.stringify($scope.content));


                                },
                                function error(errorResponse) {
                                    console.log("Error:" + JSON.stringify(errorResponse));
                                    //$location.path('/loginFailedForm');
                                }
                        );
                    }


                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );



        $scope.homeActiveClass = "activeLink";

    }]);

ulboraCmsControllers.controller('ArchiveCtrl', ['$scope', 'checkCreds', '$location', '$http', 'getToken', 'Content', '$sce', '$routeParams',
    function ArchiveCtrl($scope, checkCreds, $location, $http, getToken, Content, $sce, $routeParams) {
        $scope.useUlboraSite = false;
        $scope.brandColor = "color: white;";
        if (checkCreds() === true) {
            $scope.loggedIn = true;
        } else {
            $scope.loggedIn = false;
        }
        $scope.showContent = false;
        var searchMonth = $routeParams.month;
        var searchYear = $routeParams.year;
        if (searchMonth !== undefined && searchMonth !== null) {
            searchMonth = parseInt(searchMonth);
        }
        if (searchYear !== undefined && searchYear !== null) {
            searchYear = parseInt(searchYear);
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        var postData = {
            "frontPage": false,
            "links": true,
            "articles": true,
            "products": true,
            "searchFilter": [
                {
                    "sectionName": "MainPage",
                    "categoryName": null
                },
                {
                    "sectionName": "Tech",
                    "categoryName": null
                },
                {
                    "sectionName": "About",
                    "categoryName": null
                },
                {
                    "sectionName": "Menu",
                    "categoryName": null
                }
            ],
            "searchDateFilter": {
                "month": searchMonth,
                "year": searchYear
            }

        };
        console.log("json request:" + JSON.stringify(postData));
        Content.getContent({}, postData,
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));

                    $scope.content = response;
                    if (response.links !== null && response.links.length > 0) {
                        $scope.showLinks = true;
                    } else {
                        $scope.showLinks = false;
                    }

                    if (response.articleLocations.Left.length > 0) {
                        $scope.showNewsFlash = true;
                    } else {
                        $scope.showNewsFlash = false;
                    }

                    if (response.articleLocations.Right.length > 0) {
                        $scope.showNews = true;
                    } else {
                        $scope.showNews = false;
                    }

                    for (var cnt = 0; cnt < response.articleLocations.Center.length; cnt++) {
                        $scope.content.articleLocations.Center[cnt].articleText.text = $sce.trustAsHtml(atob(response.articleLocations.Center[cnt].articleText.text));

                    }
                    $scope.showContent = true;
                    console.log("Html:");
                    console.log(JSON.stringify($scope.content));


                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );
        $scope.homeActiveClass = "activeLink";

    }]);

ulboraCmsControllers.controller('ArticleCtrl', ['$scope', 'checkCreds', '$location', '$http', 'getToken', '$routeParams', 'Article', 'Content', '$sce',
    function ArticleCtrl($scope, checkCreds, $location, $http, getToken, $routeParams, Article, Content, $sce) {
        $scope.useUlboraSite = false;
        if (checkCreds() === true) {
            $scope.loggedIn = true;
        } else {
            $scope.loggedIn = false;
        }
        $scope.showComments = false;
        $scope.showCommentLoginRequied = false;
        $scope.showContent = false;
        $scope.showTags = false;
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();

        var articleId = $routeParams.a;
        $scope.menuLinkName = $routeParams.name;
        Article.get({id: articleId},
        function success(response) {
            //alert($scope.challenge.question);
            console.log("Success:" + JSON.stringify(response));

            if (response.allowComments && (!response.commentsRequireLogin || $scope.loggedIn)) {
                $scope.showComments = true;
            }

            if (response.allowComments && !$scope.loggedIn) {
                $scope.showCommentLoginRequied = true;
            }
            if (response.tag !== undefined) {
                $scope.showTags = true;
            }


            var result = "";

            result = atob(response.articleText.text);


            $scope.articleHtml = $sce.trustAsHtml(result);

            console.log(result);//+ JSON.stringify(errorResponse));
            $scope.article = response;


            var cDate = new Date(response.createdDate);
            $scope.createDate = cDate.getMonth() + "/" + cDate.getDate() + "/" + cDate.getFullYear();

            var modDate = response.modifiedDate;
            if (modDate !== null) {
                var mDate = new Date(modDate);
                $scope.modifiedDate = mDate.getMonth() + "/" + mDate.getDate() + "/" + mDate.getFullYear();

            }

            $scope.showContent = true;


        },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
        );

        var postData = {
            "frontPage": false,
            "links": true,
            "articles": true,
            "products": false,
            "searchFilter": [
                {
                    "sectionName": "Menu",
                    "categoryName": null
                }
            ]

        };
        Content.getContent({}, postData,
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));

                    $scope.content = response;
                    if (response.links !== null && response.links.length > 0) {
                        $scope.showLinks = true;
                    } else {
                        $scope.showLinks = false;
                    }

                    if (response.articleLocations.Left.length > 0) {
                        $scope.showNewsFlash = true;
                    } else {
                        $scope.showNewsFlash = false;
                    }

                    if (response.articleLocations.Right.length > 0) {
                        $scope.showNews = true;
                    } else {
                        $scope.showNews = false;
                    }

                    for (var cnt = 0; cnt < response.articleLocations.FrontPage.length; cnt++) {
                        $scope.content.articleLocations.FrontPage[cnt].articleText.text = $sce.trustAsHtml(atob(response.articleLocations.FrontPage[cnt].articleText.text));

                    }
                    console.log("Html:");
                    console.log(JSON.stringify($scope.content));


                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );


        //$scope.newsActiveClass = "active";

    }]);




ulboraCmsControllers.controller('LoginScreenCtrl', ['$scope', 'checkCreds', 'setCreds', '$location', '$http', 'getToken', 'Login', 'Content',
    function LoginScreenCtrl($scope, checkCreds, setCreds, $location, $http, getToken, Login, Content) {
        $scope.useUlboraSite = false;
        if (checkCreds() === true) {
            $scope.loggedIn = true;
        } else {
            $scope.loggedIn = false;
        }
        $scope.loginFailMessage = "";

        //$http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        //$scope.loginActiveClass = "active";
        $scope.showfooter = true;
        var postData = {
            "frontPage": false,
            "links": true,
            "articles": true,
            "products": false,
            "searchFilter": [
                {
                    "sectionName": "Menu",
                    "categoryName": null
                }
            ]

        };
        Content.getContent({}, postData,
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));

                    $scope.content = response;
                    if (response.links !== null && response.links.length > 0) {
                        $scope.showLinks = true;
                    } else {
                        $scope.showLinks = false;
                    }

                    if (response.articleLocations.Left.length > 0) {
                        $scope.showNewsFlash = true;
                    } else {
                        $scope.showNewsFlash = false;
                    }

                    if (response.articleLocations.Right.length > 0) {
                        $scope.showNews = true;
                    } else {
                        $scope.showNews = false;
                    }

                    for (var cnt = 0; cnt < response.articleLocations.FrontPage.length; cnt++) {
                        $scope.content.articleLocations.FrontPage[cnt].articleText.text = $sce.trustAsHtml(atob(response.articleLocations.FrontPage[cnt].articleText.text));

                    }
                    console.log("Html:");
                    console.log(JSON.stringify($scope.content));


                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.loginActiveClass = "activeLink";

    }]);

ulboraCmsControllers.controller('LoginCtrl', ['$scope', 'checkCreds', 'setCreds', '$location', '$http', 'getToken', 'Login', 'Content',
    function LoginCtrl($scope, checkCreds, setCreds, $location, $http, getToken, Login, Content) {
        $scope.useUlboraSite = false;
        if (checkCreds() === true) {
            $scope.loggedIn = true;
        } else {
            $scope.loggedIn = false;
        }
        $scope.loginFailMessage = "";

        //$http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        $scope.loginActiveClass = "active";
        $scope.showfooter = true;

        $scope.submit = function () {
            var postDate = {
                "username": $scope.username,
                "password": $scope.password
            };
            Login.save({}, postDate,
                    function success(response) {
                        //alert($scope.challenge.question);
                        console.log("Success:" + JSON.stringify(response));
                        if (response.success === true) {
                            // set cookie
                            setCreds($scope.username, $scope.password);
                            $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                            $location.path('/');
                        } else {
                            $location.path('/loginFailedForm');
                        }
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                        $location.path('/loginFailedForm');
                    }
            );
        };
        //$scope.loginActiveClass = "activeLink";

    }]);


ulboraCmsControllers.controller('LoginFailedFormCtrl', ['$scope',
    function LoginFailedFormCtrl($scope) {
        $scope.loginFailMessage = "Login Failed";

    }]);

ulboraCmsControllers.controller('LogOutCtrl', ['$scope', 'deleteCreds', '$location', '$http',
    function LogOutCtrl($scope, deleteCreds, $location, $http) {
        //alert("test");

        var doLogOut = confirm("Log Out?");
        if (doLogOut === true) {
            deleteCreds();
            //$http.defaults.headers.common['Authorization'] = 'Basic ';
            //$location.path('/loginForm');
        }//else{
        $location.path('/');
        //}


        //$scope.message = "hello";
        //$scope.uploadArticleActiveClass = "active";

    }]);


ulboraCmsControllers.controller('RegistrationNewCtrl', ['$scope', 'Challenge', '$location', 'checkCreds',
    function RegistrationNewCtrl($scope, Challenge, $location, checkCreds) {
        $scope.useUlboraSite = false;
        if (checkCreds() === true) {
            $scope.loggedIn = true;
        } else {
            $scope.loggedIn = false;
        }
        $scope.showfooter = true;
        Challenge.getChallenge({},
                function success(response) {
                    //alert($scope.challenge.question);
                    $scope.challenge = response;
                    $scope.key = response.key;
                    console.log("Success:" + JSON.stringify(response));
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
        );


    }]);


ulboraCmsControllers.controller('RegistrationCtrl', ['$scope', 'Registration', '$location',
    function RegistrationCtrl($scope, Registration, $location) {

        $scope.submit = function () {

            var pw = $scope.password;
            var confirm = $scope.confirm;
            if (pw === confirm) {
                var postDate = {
                    "answer": $scope.answer,
                    "key": $scope.key,
                    "firstName": $scope.firstName,
                    "lastName": $scope.lastName,
                    "emailAddress": $scope.email,
                    "username": $scope.username,
                    "password": $scope.password
                };

                Registration.save({}, postDate,
                        function success(response) {
                            //alert($scope.challenge.question);
                            console.log("Success:" + JSON.stringify(response));
                            if (response.success === true) {
                                // set cookie
                                //setCreds($scope.username, $scope.password);
                                //$http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                                $location.path('/processSuccess');
                            } else {
                                $location.path('/processFailure');
                            }
                        },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                            $location.path('/processFailure');
                        }
                );
            } else {
                alert("Passwords must match");
            }

        };

    }]);

ulboraCmsControllers.controller('PasswordResetCtrl', ['$scope', 'Challenge', 'Password', '$location', 'checkCreds',
    function PasswordResetCtrl($scope, Challenge, Password, $location, checkCreds) {
        $scope.useUlboraSite = false;
        if (checkCreds() === true) {
            $scope.loggedIn = true;
        } else {
            $scope.loggedIn = false;
        }
        Challenge.getChallenge({},
                function success(response) {
                    //alert($scope.challenge.question);
                    $scope.challenge = response;
                    $scope.key = response.key;
                    console.log("Success:" + JSON.stringify(response));
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
        );
        $scope.showfooter = true;
        $scope.submit = function () {

            //var pw = $scope.password;
            //var confirm = $scope.confirm;
            //if (pw === confirm) {
            var postDate = {
                "answer": $scope.answer,
                "key": $scope.key,
                "emailAddress": $scope.email,
                "username": $scope.username

            };

            Password.reset({}, postDate,
                    function success(response) {
                        //alert($scope.challenge.question);
                        console.log("Success:" + JSON.stringify(response));
                        if (response.success === true) {
                            // set cookie
                            //setCreds($scope.username, $scope.password);
                            //$http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                            $location.path('/processSuccess');
                        } else {
                            $location.path('/processFailure');
                        }
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                        $location.path('/processFailure');
                    }
            );
            //}else{
            //   alert("Passwords must match");
            // }


        };

    }]);

ulboraCmsControllers.controller('ProcessSuccessCtrl', ['$scope', 'deleteCreds', '$location', '$http',
    function ProcessSuccessCtrl($scope, deleteCreds, $location, $http) {
        $scope.loggedIn = false;
    }]);

ulboraCmsControllers.controller('ProcessFailureCtrl', ['$scope', 'deleteCreds', '$location', '$http',
    function ProcessFailureCtrl($scope, deleteCreds, $location, $http) {
        $scope.loggedIn = false;
    }]);





ulboraCmsControllers.controller('ArticleSiteCtrl', ['$scope', 'checkCreds', '$location', '$http', 'getToken', '$routeParams', 'ArticleUlboraSite', 'ContentUlboraSite', '$sce',
    function ArticleSiteCtrl($scope, checkCreds, $location, $http, getToken, $routeParams, ArticleUlboraSite, ContentUlboraSite, $sce) {
        $scope.useUlboraSite = true;
        if (checkCreds() === true) {
            $scope.loggedIn = true;
        } else {
            $scope.loggedIn = false;
        }
        $scope.showComments = false;
        $scope.showCommentLoginRequied = false;
        $scope.showContent = false;
        $scope.showTags = false;
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();

        var articleId = $routeParams.a;
        $scope.menuLinkName = $routeParams.name;
        ArticleUlboraSite.get({id: articleId},
        function success(response) {
            //alert($scope.challenge.question);
            console.log("Success:" + JSON.stringify(response));

            if (response.allowComments && (!response.commentsRequireLogin || $scope.loggedIn)) {
                $scope.showComments = true;
            }

            if (response.allowComments && !$scope.loggedIn) {
                $scope.showCommentLoginRequied = true;
            }
            if (response.tag !== undefined) {
                $scope.showTags = true;
            }


            var result = "";

            result = atob(response.articleText.text);
            result = result.replace("..", 'http://www.ulboracms.org');
            result = result.replace("..", 'http://www.ulboracms.org');
            result = result.replace("..", 'http://www.ulboracms.org');
            result = result.replace("..", 'http://www.ulboracms.org');
            result = result.replace("..", 'http://www.ulboracms.org');
            result = result.replace("..", 'http://www.ulboracms.org');
            result = result.replace("..", 'http://www.ulboracms.org');
            result = result.replace("..", 'http://www.ulboracms.org');

            $scope.articleHtml = $sce.trustAsHtml(result);

            console.log(result);//+ JSON.stringify(errorResponse));
            $scope.article = response;


            var cDate = new Date(response.createdDate);
            $scope.createDate = cDate.getMonth() + "/" + cDate.getDate() + "/" + cDate.getFullYear();

            var modDate = response.modifiedDate;
            if (modDate !== null) {
                var mDate = new Date(modDate);
                $scope.modifiedDate = mDate.getMonth() + "/" + mDate.getDate() + "/" + mDate.getFullYear();

            }

            $scope.showContent = true;


        },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
        );

        var postData = {
            "frontPage": false,
            "links": true,
            "articles": true,
            "products": false,
            "searchFilter": [
                {
                    "sectionName": "Menu",
                    "categoryName": null
                }
            ]

        };
        ContentUlboraSite.getContent({}, postData,
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));

                    $scope.content = response;
                    if (response.links !== null && response.links.length > 0) {
                        $scope.showLinks = true;
                    } else {
                        $scope.showLinks = false;
                    }

                    if (response.articleLocations.Left.length > 0) {
                        $scope.showNewsFlash = true;
                    } else {
                        $scope.showNewsFlash = false;
                    }

                    if (response.articleLocations.Right.length > 0) {
                        $scope.showNews = true;
                    } else {
                        $scope.showNews = false;
                    }

                    for (var cnt = 0; cnt < response.articleLocations.FrontPage.length; cnt++) {
                        $scope.content.articleLocations.FrontPage[cnt].articleText.text = $sce.trustAsHtml(atob(response.articleLocations.FrontPage[cnt].articleText.text));

                    }
                    console.log("Html:");
                    console.log(JSON.stringify($scope.content));


                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );


        //$scope.newsActiveClass = "active";

    }]);
