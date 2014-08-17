'use strict';
/* User Controllers */

var ulboraCmsUserControllers = angular.module('ulboraCmsUserControllers', []);
ulboraCmsUserControllers.controller('UsersCtrl', ['$scope', 'checkCreds', '$location', 'UserList', '$http', 'getToken',
    function UsersCtrl($scope, checkCreds, $location, UserList, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }

        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        UserList.getUserList({},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    $scope.userList = response;
                    /*
                    for (var cnt = 0; cnt < $scope.userList.length; cnt++) {
                        if ($scope.userList[cnt].user.role.roleName === "superAdmin") {
                            $scope.userList[cnt].user.role.roleName = "Super Admin";
                        } else if ($scope.userList[cnt].user.role.roleName === "admin") {
                            $scope.userList[cnt].user.role.roleName = "Admin";
                        } else if ($scope.userList[cnt].user.role.roleName === "author") {
                            $scope.userList[cnt].user.role.roleName = "Author";
                        } else if ($scope.userList[cnt].user.role.roleName === "user") {
                            $scope.userList[cnt].user.role.roleName = "User";
                        }
                    }
                    */
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );
        $scope.usersActiveClass = "active";
    }]);
ulboraCmsUserControllers.controller('DeleteUserCtrl', ['$scope', 'User', '$location', '$route', '$http', 'getToken',
    function DeleteUserCtrl($scope, User, $location, $route, $http, getToken) {
        $scope.deleteUser = function(id, name) {
            var doDelete = confirm("Delete " + name);
            if (doDelete === true) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                User.delete({id: id},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    if (response.success === true) {
                        $location.path('/users');
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
ulboraCmsUserControllers.controller('UserAddCtrl', ['$scope', 'User', '$location', '$http', 'getToken',
    function UserAddCtrl($scope, User, $location, $http, getToken) {
        $scope.submit = function() {
            var passwd = $scope.password;
            var confirm = $scope.confirm;
            var userEnabled = false;
            if ($scope.enabled === "true") {
                userEnabled = true;
            }
            if (passwd === confirm) {
                var postData = {
                    "id": $scope.id,
                       "firstName": $scope.firstName,
                    "lastName": $scope.lastName,
                    "emailAddress": $scope.email,                          
                    "username": $scope.username,
                    "password": passwd,
                    "enabled": userEnabled,
                    "role": $scope.newUserRoleId
                            
                };
                console.log("json request:" + JSON.stringify(postData));
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                User.save({}, postData,
                        function success(response) {
                            console.log("Success:" + JSON.stringify(response));
                            if (response.success === true) {
                                // set cookie
                                //setCreds($scope.username, $scope.password);
                                //$location.path('/');
                                console.log("Success:" + JSON.stringify(response));
                                $location.path('/users');
                            } else {
                                //$location.path('/loginFailedForm');
                                console.log("Failed:" + JSON.stringify(response));
                            }
                        },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                            //$location.path('/loginFailedForm');
                            $location.path('/users');
                        }
                );
            } else {
                alert("Passwords must match");
            }


            //$location.path('/articles');

        };
    }]);
ulboraCmsUserControllers.controller('NewUserCtrl', ['$scope', 'checkCreds', '$location', "UserRoleList", '$http', 'getToken',
    function NewUserCtrl($scope, checkCreds, $location, UserRoleList, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        UserRoleList.getUserRoleList({},
                function success(response) {
                    //alert($scope.challenge.question);
                    console.log("Success:" + JSON.stringify(response));
                    $scope.enabled = "false";
                    $scope.newUserActiveClass = "active";
                    $scope.userRoleList = response;
                    /*
                    for (var cnt = 0; cnt < $scope.userRoleList.length; cnt++) {
                        if ($scope.userRoleList[cnt].roleName === "superAdmin") {
                            $scope.userRoleList[cnt].roleName = "Super Admin";
                        } else if ($scope.userRoleList[cnt].roleName === "admin") {
                            $scope.userRoleList[cnt].roleName = "Admin";
                        } else if ($scope.userRoleList[cnt].roleName === "author") {
                            $scope.userRoleList[cnt].roleName = "Author";
                        } else if ($scope.userRoleList[cnt].roleName === "user") {
                            $scope.userRoleList[cnt].roleName = "User";
                            $scope.newUserRoleId = $scope.userRoleList[cnt].id;
                        }
                    }
                    */


                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );
    }]);
ulboraCmsUserControllers.controller('UserEditCtrl', ['$scope', 'User', '$location', '$http', 'getToken',
    function UserEditCtrl($scope, User, $location, $http, getToken) {
        $scope.submit = function() {

            var passwd = $scope.password;
            var confirm = $scope.confirm;
            var userEnabled = false;
            if ($scope.enabled === "true") {
                userEnabled = true;
            }
            if (passwd === confirm) {
                if (passwd === "none") {
                    passwd = "";
                }
                var putData = {
                    "id": $scope.id,   
                       "firstName": $scope.firstName,
                       "lastName": $scope.lastName,
                       "emailAddress": $scope.email,                       
                       "username": $scope.username,
                       "password": passwd,
                    "enabled": userEnabled,
                       "role": $scope.roleId
                      };
                   //}

                //};
                console.log("json request:" + JSON.stringify(putData));
                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                User.update({}, putData,
                        function success(response) {
                            //alert($scope.challenge.question);
                            console.log("Success:" + JSON.stringify(response));
                            if (response.success === true) {
                                // set cookie
                                //setCreds($scope.username, $scope.password);
                                //$location.path('/');
                                console.log("Success:" + JSON.stringify(response));
                                $location.path('/users');
                            } else {
                                //$location.path('/loginFailedForm');
                                console.log("Failed:" + JSON.stringify(response));
                            }
                        },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                            //$location.path('/loginFailedForm');
                            $location.path('/users');
                        }
                );
            } else {
                alert("Passwords must match");
            }



        };
    }]);
ulboraCmsUserControllers.controller('UserCtrl', ['$scope', 'checkCreds', '$location', "User", '$routeParams', '$http', 'getToken', 'UserRoleList',
    function UserCtrl($scope, checkCreds, $location, User, $routeParams, $http, getToken, UserRoleList) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        var userId = $routeParams.a;
        User.get({id: userId},
        function success(response) {
            //alert($scope.challenge.question);
            console.log("Success:" + JSON.stringify(response));
            var userEnabled = "false";
            if (response.enabled === true) {
                userEnabled = "true";
            }

            $scope.id = response._id;
            $scope.username = response.username;
            $scope.username2 = response.username;
            $scope.firstName = response.firstName;
            $scope.lastName = response.lastName;
            $scope.email = response.emailAddress;
            $scope.enabled = userEnabled; //response.user.enabled;
            $scope.password = "none";
            $scope.confirm = "none";
            //$scope.roleId = response.user.role.id;
            //$scope.roleSelectId = response.user.role.id;
            $scope.roleId = response.role;
            UserRoleList.getUserRoleList({},
                    function success(roleRes) {
                        $scope.userRoleList = roleRes;
                    });
            /*
             for (var cnt = 0; cnt < $scope.userRoleList.length; cnt++) {
             if ($scope.userRoleList[cnt].roleName === "superAdmin") {
             $scope.userRoleList[cnt].roleName = "Super Admin";
             } else if ($scope.userRoleList[cnt].roleName === "admin") {
             $scope.userRoleList[cnt].roleName = "Admin";
             } else if ($scope.userRoleList[cnt].roleName === "author") {
             $scope.userRoleList[cnt].roleName = "Author";
             } else if ($scope.userRoleList[cnt].roleName === "user") {
             $scope.userRoleList[cnt].roleName = "User";
             }
             }
             */


        },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                    //$location.path('/loginFailedForm');
                }
        );
        $scope.userActiveClass = "active";
    }]);
ulboraCmsUserControllers.controller('PasswordCtrl', ['$scope', 'checkCreds', '$location', 'getUsername', '$http', 'getToken',
    function PasswordCtrl($scope, checkCreds, $location, getUsername, $http, getToken) {
        if (checkCreds() !== true) {
            $location.path('/loginForm');
        }
        $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
        $scope.username = getUsername();
        $scope.passwordActiveClass = "active";
    }]);
ulboraCmsUserControllers.controller('PasswordChangeCtrl', ['$scope', 'Password', '$location', 'setCreds', '$http', 'getToken', '$http', 'getToken',
    function PasswordChangeCtrl($scope, Password, $location, setCreds, $http, getToken) {
        $scope.submit = function() {
            var passwd = $scope.password;
            var confirm = $scope.confirm;
            if (passwd === confirm) {
                var postData = {
                    "oldPassword": $scope.oldPassword,
                    "password": passwd
                };
                console.log("json request:" + JSON.stringify(postData));
                Password.change({}, postData,
                        function success(response) {
                            console.log("Success:" + JSON.stringify(response));
                            if (response.success === true) {
                                setCreds($scope.username, $scope.password);
                                $http.defaults.headers.common['Authorization'] = 'Basic ' + getToken();
                                console.log("Success:" + JSON.stringify(response));
                                $location.path('/users');
                            } else {
                                //$location.path('/loginFailedForm');
                                alert("Old Password Failed");
                                console.log("Failed:" + JSON.stringify(response));
                            }
                        },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                            //$location.path('/loginFailedForm');
                            $location.path('/users');
                        }
                );
            } else {
                alert("Passwords must match");
            }


            //$location.path('/articles');

        };
    }]);