'use strict';

/* Controllers */

var ulboraCmsControllers = angular.module('ulboraCmsControllers', []);

ulboraCmsControllers.controller('MainCtrl', ['$scope', 'checkCreds', '$location', '$http', 'getToken', 'DateUtil', 'Content', '$sce',
    function MainCtrl($scope, checkCreds, $location, $http, getToken, DateUtil, Content, $sce) {
        $scope.brandColor = "color: white;";

        if (checkCreds() === true) {
            $scope.loggedIn = true;
        } else {
            $scope.loggedIn = false;
        }

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
                    "sectionName": "News",
                    "categoryName": null
                }
            ]


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



    }]);


ulboraCmsControllers.controller('ArticleCtrl', ['$scope', 'checkCreds', '$location', '$http', 'getToken', 'DateUtil', '$routeParams', 'Article', '$sce',
    function ArticleCtrl($scope, checkCreds, $location, $http, getToken, DateUtil, $routeParams, Article, $sce) {

        if (checkCreds() === true) {
            $scope.loggedIn = true;
        } else {
            $scope.loggedIn = false;
        }
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();

        var articleId = $routeParams.a;
        Article.get({id: articleId},
        function success(response) {
            //alert($scope.challenge.question);
            console.log("Success:" + JSON.stringify(response));


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




        },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
        );


        $scope.newsActiveClass = "active";

    }]);



ulboraCmsControllers.controller('NewsCtrl', ['$scope', 'checkCreds', '$location', '$http', 'getToken', 'DateUtil', 'Content', '$sce',
    function NewsCtrl($scope, checkCreds, $location, $http, getToken, DateUtil, Content, $sce) {
        if (checkCreds() === true) {
            $scope.loggedIn = true;
        } else {
            $scope.loggedIn = false;
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        var postData = {
            "frontPage": false,
            "links": true,
            "articles": true,
            "products": false,
            "searchFilter": [
                {
                    "sectionName": "News",
                    "categoryName": null
                }
            ]
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
                    console.log("Html:");
                    console.log(JSON.stringify($scope.content));


                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.newsActiveClass = "active";

    }]);


ulboraCmsControllers.controller('AboutCtrl', ['$scope', 'checkCreds', '$location', '$http', 'getToken', 'DateUtil', 'Content', '$sce',
    function AboutCtrl($scope, checkCreds, $location, $http, getToken, DateUtil, Content, $sce) {

        if (checkCreds() === true) {
            $scope.loggedIn = true;
        } else {
            $scope.loggedIn = false;
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        var postData = {
            "frontPage": false,
            "links": true,
            "articles": true,
            "articlesText": true,
            "products": false,
            "searchFilter": [
                {
                    "sectionName": "About",
                    "categoryName": null
                },
                {
                    "sectionName": null,
                    "categoryName": "NewsFlash"
                }
            ]
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
                    console.log("Html:");
                    console.log(JSON.stringify($scope.content));


                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );
        $scope.aboutActiveClass = "active";

    }]);


ulboraCmsControllers.controller('ContactsCtrl', ['$scope', 'checkCreds', '$location', '$http', 'getToken', 'DateUtil', 'Content', '$sce',
    function ContactsCtrl($scope, checkCreds, $location, $http, getToken, DateUtil, Content, $sce) {

        if (checkCreds() === true) {
            $scope.loggedIn = true;
        } else {
            $scope.loggedIn = false;
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        var postData = {
            "frontPage": false,
            "links": true,
            "articles": true,
            "articlesText": true,
            "products": false,
            "searchFilter": [
                {
                    "sectionName": "Contacts",
                    "categoryName": null
                },
                {
                    "sectionName": null,
                    "categoryName": "NewsFlash"
                }
            ]
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
                    console.log("Html:");
                    console.log(JSON.stringify($scope.content));


                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );
        $scope.contactsActiveClass = "active";

    }]);


ulboraCmsControllers.controller('LoginCtrl', ['$scope', 'checkCreds', 'setCreds', '$location', '$http', 'getToken', 'DateUtil', 'Login',
    function LoginCtrl($scope, checkCreds, setCreds, $location, $http, getToken, DateUtil, Login) {
        if (checkCreds() === true) {
            $scope.loggedIn = true;
        } else {
            $scope.loggedIn = false;
        }
        $scope.loginFailMessage = "";

        //$http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        $scope.loginActiveClass = "active";

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

ulboraCmsControllers.controller('RegistrationNewCtrl', ['$scope', 'Challenge', '$location',
    function RegistrationNewCtrl($scope, Challenge, $location) {
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

ulboraCmsControllers.controller('PasswordResetCtrl', ['$scope', 'Challenge', 'Password', '$location',
    function PasswordResetCtrl($scope, Challenge, Password, $location) {
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

        $scope.submit = function () {

            //var pw = $scope.password;
            //var confirm = $scope.confirm;
            //if (pw === confirm) {
            var postDate = {
                "answer": $scope.answer,
                "key": $scope.key,
                "ulboraUser": {
                    "emailAddress": $scope.email,
                    "user": {
                        "username": $scope.username
                    }
                }
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


ulboraCmsControllers.controller('PasswordChangeCtrl', ['$scope', 'User', '$location', '$http', 'getToken', 'checkCreds',
    function PasswordChangeCtrl($scope, User, $location, $http, getToken, checkCreds) {
        if (checkCreds() === true) {
            $scope.loggedIn = true;
        } else {
            $scope.loggedIn = false;
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();

        $scope.submit = function () {

            var pw = $scope.password;
            var confirm = $scope.confirm;
            if (pw === confirm) {
                var postDate = {
                    "password": $scope.password,
                    "oldPassword": $scope.oldPassword
                };

                User.changePassword({}, postDate,
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

ulboraCmsControllers.controller('ProcessSuccessCtrl', ['$scope', 'deleteCreds', '$location', '$http',
    function ProcessSuccessCtrl($scope, deleteCreds, $location, $http) {
        //alert("test");


        //}


        //$scope.message = "hello";
        //$scope.uploadArticleActiveClass = "active";

    }]);

ulboraCmsControllers.controller('ProcessFailureCtrl', ['$scope', 'deleteCreds', '$location', '$http',
    function ProcessFailureCtrl($scope, deleteCreds, $location, $http) {
        //alert("test");


        //}


        //$scope.message = "hello";
        //$scope.uploadArticleActiveClass = "active";

    }]);

