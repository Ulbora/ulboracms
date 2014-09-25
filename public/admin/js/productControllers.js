'use strict';

/* Category Controllers */

var ulboraCmsProductControllers = angular.module('ulboraCmsProductControllers', []);

ulboraCmsProductControllers.controller('ProductsCtrl', ['$scope', 'checkCreds', '$location', 'ProductList', '$http', 'getToken',
    function ProductsCtrl($scope, checkCreds, $location, ProductList, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        ProductList.getList({},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));

                    $scope.productList = response;

                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.productActiveClass = "active";
    }]);


ulboraCmsProductControllers.controller('DeleteProductCtrl', ['$scope', 'Product', '$location', '$route', '$http', 'getToken',
    function DeleteProductCtrl($scope, Product, $location, $route, $http, getToken) {
        $scope.deleteProduct = function (id, name) {
            var doDelete = confirm("Delete " + name);
            if (doDelete === true) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                Product.delete({id: id},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    if (response.success === true) {
                        $location.path('/products');
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



ulboraCmsProductControllers.controller('ProductAddCtrl', ['$scope', 'Product', '$location', '$http', 'getToken',
    function ProductAddCtrl($scope, Product, $location, $http, getToken) {
        $scope.submit = function () {
            var acc = $scope.accessLevelId;
            var cat = $scope.categoryId;
            var sec = $scope.sectionId;
            var lan = $scope.languageId;

            if (acc !== "" && acc !== undefined && cat !== "" && cat !== undefined && sec !== ""
                    && sec !== undefined && lan !== "" && lan !== undefined) {
                var postData = {
                    "published": false,
                    "name": $scope.name,
                    "desc": $scope.desc,
                    "promoVideoLink": $scope.promo,
                    "externalLink": $scope.extLink,
                    "metaDes": $scope.metaDescription,
                    "metaKeyWords": $scope.metaKeyWords,
                    "metaRobotKeyWords": $scope.metaRobotKeyWords,
                    "metaAuthorName": $scope.metaAuthorName,
                    "accessLevel": $scope.accessLevelId,
                    "category": $scope.categoryId,
                    "section": $scope.sectionId,
                    "language": $scope.languageId,
                    "locationList": $scope.locationIds,
                    "price": Number($scope.price),
                    "currencyCode": $scope.currencyCode,
                    "imageLocation": $scope.imageLocation
                };

                console.log("json request:" + JSON.stringify(postData));
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                Product.save({}, postData,
                        function success(response) {
                            console.log("Success:" + JSON.stringify(response));
                            if (response.success === true) {
                                // set cookie
                                //setCreds($scope.username, $scope.password);
                                //$location.path('/');
                                console.log("Success:" + JSON.stringify(response));
                                $location.path('/products');
                            } else {
                                //$location.path('/loginFailedForm');
                                console.log("Failed:" + JSON.stringify(response));
                            }
                        },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                            alert("Failed");
                            //$location.path('/loginFailedForm');
                            $location.path('/products');
                        }
                );

            } else {
                alert("Missing Fields");
            }

        };

    }]);

ulboraCmsProductControllers.controller('NewProductCtrl', ['$scope', 'checkCreds', '$location', '$http', 'getToken', 'ArticleValues',
    function NewProductCtrl($scope, checkCreds, $location, $http, getToken, ArticleValues) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        var postData = {
            "languageCode": "en-us"
        };
        ArticleValues.getValues({}, postData,
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
                    $scope.imageLocation = "";
                    $scope.articleValues = response;

                    console.log("Success:" + JSON.stringify(response));
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
        );




        $scope.newProductActiveClass = "active";

    }]);




ulboraCmsProductControllers.controller('ProductEditCtrl', ['$scope', 'Product', '$location', '$http', 'getToken',
    function ProductEditCtrl($scope, Product, $location, $http, getToken) {
        $scope.submit = function () {
            var price = Number($scope.price);
            if (price === undefined || price === null || isNaN(price)) {
                alert("Enter valid price");
            } else {
                var putData = {
                    "id": $scope.productId,
                    "published": ($scope.published === "true"),
                    "name": $scope.name,
                    "desc": $scope.desc,
                    "promoVideoLink": $scope.promo,
                    "externalLink": $scope.extLink,
                    "metaDesc": $scope.metaDescription,
                    "metaKeyWords": $scope.metaKeyWords,
                    "metaRobotKeyWords": $scope.metaRobotKeyWords,
                    "metaAuthorName": $scope.metaAuthorName,
                    "accessLevel": $scope.accessLevelId,
                    "category": $scope.categoryId,
                    "section": $scope.sectionId,
                    "language": $scope.languageId,
                    "locationList": $scope.locationIds,
                    "price": Number($scope.price),
                    "currencyCode": $scope.currencyCode,
                    "imageLocation": $scope.imageLocation
                };

                console.log("json request:" + JSON.stringify(putData));
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                Product.update({}, putData,
                        function success(response) {
                            console.log("Success:" + JSON.stringify(response));
                            if (response.success === true) {
                                // set cookie
                                //setCreds($scope.username, $scope.password);
                                //$location.path('/');
                                console.log("Success:" + JSON.stringify(response));
                                $location.path('/products');
                            } else {
                                //$location.path('/loginFailedForm');
                                console.log("Failed:" + JSON.stringify(response));
                            }
                        },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                            alert("Failed");
                            //$location.path('/loginFailedForm');
                            $location.path('/products');
                        }
                );

            }

        };

    }]);


ulboraCmsProductControllers.controller('ProductCtrl', ['$scope', 'checkCreds', '$location', "Product", '$routeParams', '$http', 'getToken', 'ArticleValues',
    function ProductCtrl($scope, checkCreds, $location, Product, $routeParams, $http, getToken, ArticleValues) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        var prodId = $routeParams.a;
        Product.get({id: prodId},
        function success(response) {
            //alert($scope.challenge.question);
            console.log("Success:" + JSON.stringify(response));

            $scope.productId = response._id;
            $scope.name = response.name;
            $scope.desc = response.desc;
            if (response.published === true) {
                $scope.published = "true";
            } else {
                $scope.published = "false";
            }

            $scope.promo = response.promoVideoLink;
            $scope.extLink = response.externalLink;
            $scope.metaDescription = response.metaDesc;
            $scope.metaKeyWords = response.metaKeyWords;
            $scope.metaAuthorName = response.metaAuthorName;
            $scope.metaRobotKeyWords = response.metaRobotKeyWords;
            $scope.languageId = response.language;
            $scope.sectionId = response.section;
            $scope.categoryId = response.category;
            //if (response.location !== null) {
            //$scope.locationId = response.location.id;
            // }
            var tempLoc = response.productLocationList;
            if (tempLoc !== undefined && tempLoc !== null) {
                // $scope.locationSelectId = tempLoc[0];
                $scope.locationIds = tempLoc;
                console.log("locationIds:" + tempLoc)
            } else {
                $scope.locationSelectId = 0;

            }
            $scope.accessLevelId = response.accessLevel;

            //if (response.price !== null) {

            $scope.price = response.price;
            $scope.currencyCode = response.currencyCode;
            //} else {
            //  $scope.priceId = null;
            //$scope.price = null;
            //$scope.currencyCode = null;
            //}

            $scope.imageLocation = response.imageLocation;

            var postData = {
                "languageCode": "en-us"
            };
            ArticleValues.getValues({}, postData,
                    function success(values) {
                        //alert($scope.challenge.question);                   
                        $scope.articleValues = values;

                        console.log("Success:" + JSON.stringify(values));
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                    }
            );


        },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );




        $scope.prodictActiveClass = "active";
    }]);



