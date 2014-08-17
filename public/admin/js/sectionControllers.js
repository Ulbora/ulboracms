'use strict';

/* Section Controllers */

var ulboraCmsSectionControllers = angular.module('ulboraCmsSectionControllers', []);

ulboraCmsSectionControllers.controller('SectionsCtrl', ['$scope', 'checkCreds', '$location', 'SectionList', '$http', 'getToken',
    function SectionsCtrl($scope, checkCreds, $location, SectionList, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        SectionList.getSectionList({}, 
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));

                    $scope.sectionList = response;                    
                   
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );

        $scope.sectionActiveClass = "active";
    }]);


ulboraCmsSectionControllers.controller('DeleteSectionCtrl', ['$scope', 'Section', '$location', '$route', '$http', 'getToken',
    function DeleteSectionCtrl($scope, Section, $location, $route, $http, getToken) {
        $scope.deleteSection = function(id, name) {
            var doDelete = confirm("Delete " + name);
            if (doDelete === true) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                Section.delete({id: id},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    // put wate code here
                    //$rootScope.articleSaved = true;
                    $location.path('/sections');
                    $route.reload();
                },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                        }
                );

            }


        };
    }]);



ulboraCmsSectionControllers.controller('SectionAddCtrl', ['$scope', 'Section', '$location', '$http', 'getToken',
    function SectionAddCtrl($scope, Section, $location, $http, getToken) {
        $scope.submit = function() {            
            
                var postData = {                    
                    "name": $scope.name,
                    "language": $scope.languageId                    
                };
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                console.log("json request:" + JSON.stringify(postData));
                Section.save({}, postData,
                        function success(response) {                            
                            console.log("Success:" + JSON.stringify(response));
                            if (response.success === true) {
                                // set cookie
                                //setCreds($scope.username, $scope.password);
                                //$location.path('/');
                                console.log("Success:" + JSON.stringify(response));
                                $location.path('/sections');
                            } else {
                                //$location.path('/loginFailedForm');
                                console.log("Failed:" + JSON.stringify(response));
                            }
                        },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                            //$location.path('/loginFailedForm');
                            $location.path('/sections');
                        }
                );
           

            //$location.path('/articles');
        };

    }]);

ulboraCmsSectionControllers.controller('NewSectionCtrl', ['$scope', 'checkCreds', '$location', "LanguageList", '$http', 'getToken',
    function NewSectionCtrl($scope, checkCreds, $location, LanguageList, $http, getToken) {
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
        
        
        $scope.newSectionActiveClass = "active";

    }]);