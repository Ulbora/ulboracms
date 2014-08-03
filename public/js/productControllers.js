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
        $scope.deleteProduct = function(id, name) {
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
        $scope.submit = function() {
            var acc = $scope.accessLevelId;
            var cat = $scope.categoryId;
            var sec = $scope.sectionId;
            var lan = $scope.languageId;
            if (acc !== "" && acc !== undefined && cat !== "" && cat !== undefined && sec !== ""
                    && sec !== undefined && lan !== "" && lan !== undefined) {
                var postData = {
                    "published": false,
                    "name": $scope.name,
                    "description": $scope.desc,
                    "promoLink": $scope.promo,
                    "externalLink": $scope.extLink,
                    "metaData": {
                        "metaDescription": $scope.metaDescription,
                        "metaKeyWords": $scope.metaKeyWords,
                        "metaRobotKeyWords": $scope.metaRobotKeyWords,
                        "metaAuthorName": $scope.metaAuthorName
                    },
                    "accessLevel": {
                        "id": Number($scope.accessLevelId)
                    },
                    "category": {
                        "id": Number($scope.categoryId)
                    },
                    "section": {
                        "id": Number($scope.sectionId)
                    },
                    "language": {
                        "id": Number($scope.languageId)
                    },
                    "location": {
                        "id": Number($scope.locationId)
                    }
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
        ArticleValues.getValues({},
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
        $scope.submit = function() {
            
            var published = false;
            var pubed = $scope.published;
            if(pubed === "true"){
                published = true;
            }
            var newPriceId = Number($scope.priceId);
            if(newPriceId === 0){
                newPriceId = null;
            }
            var newPrice = Number($scope.price);
            if(newPrice === 0){
                newPrice = null;
            }
            
            var putData = {
                "id": Number($scope.productId),
                "published": published,
                "name": $scope.name,
                "description": $scope.desc,
                "promoLink": $scope.promo,
                "externalLink": $scope.extLink,
                "metaData": {
                    "id": Number($scope.metaId),
                    "metaDescription": $scope.metaDescription,
                    "metaKeyWords": $scope.metaKeyWords,
                    "metaRobotKeyWords": $scope.metaRobotKeyWords,
                    "metaAuthorName": $scope.metaAuthorName
                },
                "accessLevel": {
                    "id": Number($scope.accessLevelId)
                },
                "category": {
                    "id": Number($scope.categoryId)
                },
                "section": {
                    "id": Number($scope.sectionId)
                },
                "language": {
                    "id": Number($scope.languageId)
                },
                "location": {
                    "id": Number($scope.locationId)
                },
                "price": {
                    "id": newPriceId,
                    "price": newPrice,
                    "currencyCode": $scope.currencyCode
                },
                "imageLocation" : $scope.imageLocation 
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

            $scope.productId = response.id;
            $scope.name = response.name;
            $scope.desc = response.description;
            if (response.published === true) {
                $scope.published = "true";
            } else {
                $scope.published = "false";
            }

            $scope.promo = response.promoLink;
            $scope.extLink = response.externalLink;
            $scope.metaId = response.metaData.id;
            $scope.metaDescription = response.metaData.metaDescription;
            $scope.metaKeyWords = response.metaData.metaKeyWords;
            $scope.metaAuthorName = response.metaData.metaAuthorName;
            $scope.metaRobotKeyWords = response.metaData.metaRobotKeyWords;
            $scope.languageId = response.language.id;
            $scope.sectionId = response.section.id;
            $scope.categoryId = response.category.id;
            if (response.location !== null) {
                $scope.locationId = response.location.id;
            }
            $scope.accessLevelId = response.accessLevel.id;
            
            if(response.price !== null){
                $scope.priceId = response.price.id;
                $scope.price = response.price.price;
                $scope.currencyCode = response.price.currencyCode;
            }else{
                $scope.priceId = null;
                $scope.price = null;
                $scope.currencyCode = null;
            }          
            
            $scope.imageLocation = response.imageLocation;


            ArticleValues.getValues({},
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



