'use strict';

/* Location Controllers */

var ulboraCmsLocationControllers = angular.module('ulboraCmsLocationControllers', []);

ulboraCmsLocationControllers.controller('LocationsCtrl', ['$scope', 'checkCreds', '$location', 'LocationList', '$http', 'getToken',
    function LocationsCtrl($scope, checkCreds, $location, LocationList, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        LocationList.getLocationList({},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));

                    $scope.locationList = response;

                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.locationActiveClass = "active";
    }]);


ulboraCmsLocationControllers.controller('DeleteLocationCtrl', ['$scope', 'Location', '$location', '$route', '$http', 'getToken',
    function DeleteLocationCtrl($scope, Location, $location, $route, $http, getToken) {
        $scope.deleteLocation = function(id, name) {
            var doDelete = confirm("Delete " + name);
            if (doDelete === true) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                Location.delete({id: id},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    if (response.success === true) {
                        $location.path('/locations');
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



ulboraCmsLocationControllers.controller('LocationAddCtrl', ['$scope', 'Location', '$location', '$http', 'getToken',
    function LocationAddCtrl($scope, Location, $location, $http, getToken) {
        $scope.submit = function() {
            
          
            var postData = {
                "name": $scope.name
                
            };
            console.log("json request:" + JSON.stringify(postData));
            $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
            Location.save({}, postData,
                    function success(response) {
                        console.log("Success:" + JSON.stringify(response));
                        if (response.success === true) {
                            // set cookie
                            //setCreds($scope.username, $scope.password);
                            //$location.path('/');
                            console.log("Success:" + JSON.stringify(response));
                            $location.path('/locations');
                        } else {
                            //$location.path('/loginFailedForm');
                            console.log("Failed:" + JSON.stringify(response));
                        }
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                        //$location.path('/loginFailedForm');
                        $location.path('/locations');
                    }
            );


            //$location.path('/articles');
        };

    }]);

ulboraCmsLocationControllers.controller('NewLocationCtrl', ['$scope', 'checkCreds', '$location', '$http', 'getToken',
    function NewLocationCtrl($scope, checkCreds, $location, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();


        $scope.newLocationActiveClass = "active";

    }]);




ulboraCmsLocationControllers.controller('LocationCtrl', ['$scope', 'checkCreds', '$location', "Location", '$routeParams', '$http', 'getToken',
    function LocationCtrl($scope, checkCreds, $location, Location, $routeParams, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        var locationId = $routeParams.a;
        Location.get({id: locationId},
        function success(response) {
            //alert($scope.challenge.question);
            console.log("Success:" + JSON.stringify(response));
            
            
            $scope.locationName = response.name;
            $scope.articleList = response.usageList.articleList;
            $scope.productList = response.usageList.productList;
            
            var artCnt = $scope.articleList.length;
            var prodCnt = $scope.productList.length;
            var totCnt = artCnt + prodCnt;
            var locationList = [totCnt];
            var cnt = 0;
            for(var cnt1 = 0; cnt1<$scope.articleList.length; cnt1++, cnt++){
                var art = {
                    "name": $scope.articleList[cnt1],
                    "type": "Article"
                }
                locationList[cnt]=art;
            }
            for(var cnt2 = 0; cnt2< $scope.productList.length; cnt2++, cnt++){
                var prod = {
                    "name": $scope.productList[cnt2],
                    "type": "Product"
                }
                locationList[cnt]=prod;
            }
            $scope.locationList = locationList;
            
        },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.locationActiveClass = "active";
    }]);



