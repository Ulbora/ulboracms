'use strict';

/* Category Controllers */

var ulboraCmsCategoryControllers = angular.module('ulboraCmsCategoryControllers', []);

ulboraCmsCategoryControllers.controller('CategoriesCtrl', ['$scope', 'checkCreds', '$location', 'CategoryList', '$http', 'getToken',
    function CategoriesCtrl($scope, checkCreds, $location, CategoryList, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        CategoryList.getCategoryList({}, 
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));

                    $scope.categoryList = response;                    
                   
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.categoryActiveClass = "active";
    }]);


ulboraCmsCategoryControllers.controller('DeleteCategoryCtrl', ['$scope', 'Category', '$location', '$route', '$http', 'getToken',
    function DeleteCategoryCtrl($scope, Category, $location, $route, $http, getToken) {
        $scope.deleteCategory = function(id, name) {
            var doDelete = confirm("Delete " + name);
            if (doDelete === true) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                Category.delete({id: id},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    // put wate code here
                    //$rootScope.articleSaved = true;
                    $location.path('/categories');
                    $route.reload();
                },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                        }
                );

            }


        };
    }]);



ulboraCmsCategoryControllers.controller('CategoryAddCtrl', ['$scope', 'Category', '$location', '$http', 'getToken',
    function CategoryAddCtrl($scope, Category, $location, $http, getToken) {
        $scope.submit = function() {            
            
                var postData = {                    
                    "name": $scope.name,
                    "language": $scope.languageId                    
                };
                console.log("json request:" + JSON.stringify(postData));
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                Category.save({}, postData,
                        function success(response) {                            
                            console.log("Success:" + JSON.stringify(response));
                            if (response.success === true) {
                                // set cookie
                                //setCreds($scope.username, $scope.password);
                                //$location.path('/');
                                console.log("Success:" + JSON.stringify(response));
                                $location.path('/categories');
                            } else {
                                //$location.path('/loginFailedForm');
                                console.log("Failed:" + JSON.stringify(response));
                            }
                        },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                            //$location.path('/loginFailedForm');
                            $location.path('/categories');
                        }
                );
           

            //$location.path('/articles');
        };

    }]);

ulboraCmsCategoryControllers.controller('NewCategoryCtrl', ['$scope', 'checkCreds', '$location', "LanguageList", '$http', 'getToken',
    function NewCategoryCtrl($scope, checkCreds, $location, LanguageList, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        LanguageList.getLanguageList({}, 
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));

                    $scope.languageList = response;                    
                   
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );
        
        
        $scope.newCategoryActiveClass = "active";

    }]);