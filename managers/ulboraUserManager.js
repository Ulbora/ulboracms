//ulboraUserManager



var db = require('../db/db');
var manager = require('../managers/manager');

/**
 * 
 * @param json
 *      
 */
exports.create = function(json, creds, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        manager.validateRole(json.role, function(roleResults) {
            if (roleResults.success) {
                var User = db.getUser();
                User.findOne({username: json.username}, function(err, results) {
                    console.log("found user in create: " + JSON.stringify(results));
                    if (!err && (results === undefined || results === null)) {
                        var allowAdd = true;
                        if (roleResults.roleName === manager.ROLE_SUPER_ADMIN && creds.role !== manager.ROLE_SUPER_ADMIN) {
                            allowAdd = false;
                        }
                        if (allowAdd) {
                            json.password = manager.hashPasswordSync(json.username, json.password);
                            var u = new User(json);
                            u.save(function(err) {
                                if (err) {
                                    returnVal.message = "save failed";
                                    console.log("user save error: " + err);
                                } else {
                                    returnVal.success = true;
                                }
                                callback(returnVal);
                            });
                        } else {
                            callback(returnVal);
                        }

                    } else {
                        returnVal.message = "existing user";
                        callback(returnVal);
                    }
                });
            } else {
                returnVal.message = "bad role";
                callback(returnVal);
            }
        });
    } else {
        callback(returnVal);
    }
};


/**
 * 
 * @param json
 *      
 */
exports.update = function(json, creds, callback) {
    var isOk = manager.securityCheck(json);
    if (isOk) {
        var returnVal = {
            success: false,
            message: ""
        };
        manager.validateRole(json.role, function(roleResults) {
            console.log("found role: " + JSON.stringify(roleResults));
            if (roleResults.success) {
                var User = db.getUser();
                User.findById(json.id, function(err, foundUser) {
                    console.log("found user: " + JSON.stringify(foundUser));
                    if (!err && (foundUser !== undefined && foundUser !== null)) {
                        var allowAdd = true;
                        if (roleResults.roleName === manager.ROLE_SUPER_ADMIN && creds.role !== manager.ROLE_SUPER_ADMIN) {
                            allowAdd = false;
                        }
                        if (allowAdd) {
                            foundUser.role = json.role;
                        } else {
                            //exit now because user is not authorized to upgrade role 
                            returnVal.message = "Bad role"
                            callback(returnVal);
                        }
                        if (json.password !== undefined && json.password !== null) {
                            foundUser.password = manager.hashPasswordSync(foundUser.username, json.password);
                        }
                        if (json.firstName !== undefined && json.firstName !== null) {
                            foundUser.firstName = json.firstName;
                        }
                        if (json.lastName !== undefined && json.lastName !== null) {
                            foundUser.lastName = json.lastName;
                        }
                        if (json.emailAddress !== undefined && json.emailAddress !== null) {
                            foundUser.emailAddress = json.emailAddress;
                        }
                        if (json.enabled !== undefined && json.enabled !== null) {
                            if (json.enabled) {
                                foundUser.enabled = true;
                            } else if (json.enabled === false) {
                                foundUser.enabled = false;
                            }

                        }
                        foundUser.save(function(err) {
                            if (err) {
                                console.log("user update error: " + err);
                            } else {
                                returnVal.success = true;
                            }
                            callback(returnVal);
                        });
                    } else {
                        console.log("bad json: " + JSON.stringify(json));
                        callback(returnVal);
                    }
                });
            } else {
                returnVal.message = "Bad role"
                callback(returnVal);
            }
        });
    } else {
        callback(returnVal);
    }
};


/**
 * 
 * @param id
 *      
 */
exports.delete = function(id, creds, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var User = db.getUser();
        User.findById(id, function(err, userResult) {
            console.log("user for delete: " + JSON.stringify(userResult));
            if (!err && userResult !== undefined && userResult !== null) {
                manager.validateRole(userResult.role, function(roleResults) {
                    if (roleResults.success) {
                        console.log("user role for delete: " + JSON.stringify(roleResults));
                        var allowDelete = true;
                        if (roleResults.roleName === manager.ROLE_SUPER_ADMIN && creds.role === manager.ROLE_SUPER_ADMIN) {
                            User.count({role: roleResults.id}, function(err, count) {
                                console.log("super admin user count for delete: " + JSON.stringify(count));
                                if (!err && count !== undefined && count !== null) {
                                    if (count <= 1) {
                                        allowDelete = false;
                                    }
                                    if (allowDelete) {
                                        userResult.remove();
                                        returnVal.success = true;
                                    }
                                    callback(returnVal);
                                } else {
                                    callback(returnVal);
                                }
                            });
                        } else {
                            if (roleResults.roleName === manager.ROLE_SUPER_ADMIN && creds.role !== manager.ROLE_SUPER_ADMIN) {
                                allowDelete = false;
                            }
                            if (allowDelete) {
                                userResult.remove();
                                returnVal.success = true;
                            }
                            callback(returnVal);
                        }
                    } else {
                        callback(returnVal);
                    }
                });
            } else {
                callback(returnVal);
            }
        });
    } else {
        callback(returnVal);
    }
};


/**
 * 
 * @param id
 *      
 */
exports.get = function(id, creds, callback) {
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var User = db.getUser();
        User.findById(id, function(err, foundUser) {
            if (!err && (foundUser !== undefined && foundUser !== null)) {
                var Role = db.getRole();
                Role.findById(foundUser.role, function(err, foundRole) {
                    var allowRead = true;
                    if (foundRole === undefined || foundRole === null) {
                        allowRead = false;
                    } else {
                        if (foundRole.name === manager.ROLE_SUPER_ADMIN && creds.role !== manager.ROLE_SUPER_ADMIN) {
                            allowRead = false;
                        }
                    }

                    if (allowRead) {
                        console.log("found user: " + JSON.stringify(foundUser));
                        foundUser.password = "";
                        callback(foundUser);
                    } else {
                        callback({});
                    }
                });
            } else {
                callback({});
            }
        });
    } else {
        callback({});
    }
};


/**
 * 
 * @param json
 *      
 */
exports.list = function(creds, callback) {
    var returnVal = [];
    var Role = db.getRole();
    Role.findOne({name: manager.ROLE_SUPER_ADMIN}, function(err, suRole) {
        var superAdmin = false;
        if (creds.role === manager.ROLE_SUPER_ADMIN) {
            superAdmin = true;
        }
        var filter = {};
        if (!superAdmin) {
            filter = {role: {$ne: suRole._id}};
        }
        var User = db.getUser();
        User.find(filter, null, {sort: {username: 1}}, function(err, results) {
            console.log("found user list: " + JSON.stringify(results));
            if (err) {
                callback({});
            } else {
                Role.find({}, function(roleErr, roleList) {
                    console.log("found role list: " + JSON.stringify(results));
                    if (!roleErr && roleList !== undefined && roleList !== null) {
                        if (results !== undefined && results !== null) {
                            for (var cnt = 0; cnt < results.length; cnt++) {
                                var u = results[cnt].toObject();
                                u.password = "";
                                var userRoleIdStr = u.role.toString();
                                for (var roleCnt = 0; roleCnt < roleList.length; roleCnt++) {
                                    var roleId = roleList[roleCnt]._id.toString();
                                    if (userRoleIdStr === roleId) {
                                        u.role = roleList[roleCnt];
                                        break;
                                    }
                                }
                                var tempRoleName = u.role.name;
                                tempRoleName = tempRoleName.replace("ROLE_", "");
                                tempRoleName = tempRoleName.replace(/_/g, " ");
                                u.role.name = tempRoleName;
                                returnVal.push(u);
                            }
                            callback(returnVal);
                        } else {
                            callback({});
                        }
                    } else {
                        callback({});
                    }
                });
            }
        });
    });


};


/**
 * 
 * @param json
 *      
 */
exports.changePassword = function(json, creds, callback) {
    var isOk = manager.securityCheck(json);
    if (isOk) {
        var returnVal = {
            success: false,
            message: ""
        }
        var User = db.getUser();
        User.findOne({username: creds.username}, function(err, foundUser) {
            //check that old password matchs what is sent in
            console.log("found user: " + JSON.stringify(foundUser));
            if (!err && (foundUser !== undefined && foundUser !== null)
                    && json.oldPassword !== undefined
                    && json.oldPassword !== null
                    && json.password !== undefined
                    && json.password !== null) {
                var encOldPassword = manager.hashPasswordSync(creds.username, json.oldPassword);
                if (encOldPassword === foundUser.password) {
                    console.log("Password match: true");
                    foundUser.password = manager.hashPasswordSync(creds.username, json.password);
                    foundUser.save(function(err) {
                        if (err) {
                            console.log("new password save error: " + err);
                        } else {
                            returnVal.success = true;
                        }
                        callback(returnVal);
                    });

                } else {
                    callback(returnVal);
                }
            } else {
                console.log("bad json: " + JSON.stringify(json));
                callback(returnVal);
            }
        });
    } else {
        callback(returnVal);
    }

};


/**
 * 
 */
exports.roleList = function(callback) {
    var returnVal = [];
    var Role = db.getRole();
    Role.find({}, function(err, results) {
        console.log("found role list: " + JSON.stringify(results));
        if (err) {
            callback({});
        } else {
            if (results !== undefined && results !== null) {
                for (var cnt = 0; cnt < results.length; cnt++) {
                    var r = results[cnt].toObject();
                    var tempRoleName = r.name;
                    tempRoleName = tempRoleName.replace("ROLE_", "");
                    tempRoleName = tempRoleName.replace(/_/g, " ");
                    r.name = tempRoleName;
                    returnVal.push(r);
                }
                callback(returnVal);
            } else {
                callback({});
            }
        }
    });
};



