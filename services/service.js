
var db = require('../db/db');
var manager = require('../managers/manager');

var superAdminAuthRole = [
    manager.ROLE_SUPER_ADMIN
];
exports.superAdminAuthRole = superAdminAuthRole;

var adminAuthRole = [
    manager.ROLE_SUPER_ADMIN,
    manager.ROLE_ADMIN
];
exports.adminAuthRole = adminAuthRole;

var authorAuthRole = [
    manager.ROLE_SUPER_ADMIN,
    manager.ROLE_ADMIN,
    manager.ROLE_AUTHOR
];
exports.authorAuthRole = authorAuthRole;

var userAuthRole = [
    manager.ROLE_SUPER_ADMIN,
    manager.ROLE_ADMIN,
    manager.ROLE_AUTHOR,
    manager.ROLE_USER
];

exports.userAuthRole = userAuthRole;

authenticate = function(req, res, role, callback) {
    console.log("in auth");
    var token = req.header("authorization");
    //console.log("token:" + token);
    if (token !== undefined && token !== null) {
        var tokenArray = token.split(' ');
        if (tokenArray !== undefined && tokenArray !== null && tokenArray.length === 2) {
            var clearText = new Buffer(tokenArray[1], 'base64').toString();
            console.log("clear text:" + clearText);
            var credentials = clearText.split(':');
            var User = db.getUser();
            User.findOne({username: credentials[0]}, function(err, results) {
                console.log("found user in auth:" + results);
                var loginInSuccess = false;
                var roleAuthized = false;
                if (!err && results !== undefined && results !== null) {
                    var foundUser = results.toObject();
                    if (foundUser.password === manager.hashPasswordSync(credentials[0], credentials[1]) && foundUser.enabled) {
                        loginInSuccess = true;
                        console.log("correct password: " + loginInSuccess);
                        var Role = db.getRole();
                        Role.findById(foundUser.role, function(err, results) {   
                            var callbackUserCreds = {
                                "id": "",
                                "username" : "",
                                "role" : ""
                            };
                            console.log("Role:" + JSON.stringify(results));
                            for (var cnt = 0; cnt < role.length; cnt++) {
                                var r = role[cnt];
                                if (results.name === r) {
                                    roleAuthized = true;
                                    callbackUserCreds.id = foundUser._id;
                                    callbackUserCreds.username = credentials[0];
                                    callbackUserCreds.role = results.name;
                                    break;
                                }
                            }
                            console.log("correct role: " + roleAuthized);
                            if (!loginInSuccess) {
                                res.status(401);
                                res.send();
                            } else if (!roleAuthized) {
                                res.status(403);
                                res.send();
                            } else {
                                console.log("manager login success: " + true);
                                callback(callbackUserCreds);
                            }
                        });
                    } else {
                        console.log("correct password: " + false);
                        res.status(401);
                        res.send();
                    }
                } else {
                    res.status(401);
                    res.send();
                }
            });
        } else {
            res.status(401);
            res.send();
        }
    } else {
        res.status(401);
        res.send();
    }
};

exports.authenticate = authenticate;


//generic create
exports.create = function(req, res, manager, roles) {
    if (req.is('application/json')) {
        var reqBody = req.body;
        var bodyJson = JSON.stringify(reqBody);
        console.log("body: " + bodyJson);
        authenticate(req, res, roles, function() {
            console.log("in auth callback");
            manager.create(reqBody, function(result) {
                res.send(result);
            });
        });
    } else {
        res.status(415);
        res.send({success: false});
    }
    

};

/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.update = function(req, res, manager, roles) {
    if (req.is('application/json')) {
        var reqBody = req.body;
        var bodyJson = JSON.stringify(reqBody);
        console.log("body: " + bodyJson);
        authenticate(req, res, roles, function() {
            console.log("in auth callback");
            manager.update(reqBody, function(result) {
                res.send(result);
            });
        });
    } else {
        res.status(415);
        res.send({success: false});
    }
};

/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.delete = function(req, res, manager, roles) {
    authenticate(req, res, roles, function() {
        console.log("in auth callback");
        var id = req.params.id;
        if (id !== null && id !== undefined) {
            manager.delete(id, function(result) {
                res.send(result);
            });
        }else{
            res.send({success: false});
        }

    });
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.get = function(req, res, manager, roles) {
    authenticate(req, res, roles, function() {
        console.log("in auth callback");
        var id = req.params.id;
        if (id !== null && id !== undefined) {
            manager.get(id, function(result) {
                res.send(result);
            });
        }else{
            res.send({});
        }

    });
};


/**
 * 
 * @param req
 *      
 * @param res
 *      
 */
exports.list = function(req, res, manager, roles) {
    authenticate(req, res, roles, function() {
        console.log("in auth callback");
        manager.list(function(result) {
            res.send(result);
        });
    });
};

