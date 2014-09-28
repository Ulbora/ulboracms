//addOnManager

var db = require('../db/db');
var manager = require('../managers/manager');
var proxy = require('../restProxy/restProxy');
var atob = require('atob');//base64 to json
var btoa = require('btoa');//json to base64


/**
 * 
 * @param json
 *      
 */
exports.create = function (json, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        if (json.password !== undefined && json.password !== null) {
            json.password = manager.aes256Encrypt(json.password);
        }
        var Addons = db.getAddons();
        var addon = new Addons(json);
        addon.save(function (err) {
            if (err) {
                returnVal.message = "save failed";
                console.log("addon save error: " + err);
            } else {
                returnVal.success = true;
            }
            callback(returnVal);
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
exports.update = function (json, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        var Addons = db.getAddons();
        Addons.findById(json.id, function (err, results) {
            console.log("found addons in update: " + JSON.stringify(results));
            if (!err && (results !== undefined && results !== null)) {
                if (json.password !== undefined && json.password !== null) {
                    json.password = manager.aes256Encrypt(json.password);
                }
                results.name = json.name;
                results.url = json.url;
                results.basicAuth = json.basicAuth;
                results.username = json.username;
                results.password = json.password;
                results.save(function (err) {
                    if (err) {
                        console.log("addons save error: " + err);
                    } else {
                        returnVal.success = true;
                    }
                    callback(returnVal);
                });

            } else {
                returnVal.message = "addon not found";
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
exports.delete = function (id, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var Addons = db.getAddons();
        Addons.findById(id, function (err, results) {
            console.log("found addon for delete: " + JSON.stringify(results));
            if (!err && (results !== undefined && results !== null)) {
                results.remove();
                returnVal.success = true;
                callback(returnVal);
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
exports.get = function (id, callback) {
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var Addons = db.getAddons();
        Addons.findById(id, function (err, results) {
            console.log("found addon: " + JSON.stringify(results));
            if (!err && (results !== undefined && results !== null)) {
                var a = {
                    _id: null,
                    name: null,
                    url: null,
                    basicAuth: false,
                    username: null,
                    password: null,
                    requireUserLogin: null
                };
                a._id = results._id;
                a.name = results.name;
                a.url = results.url;
                a.basicAuth = results.basicAuth;
                a.username = results.username;
                if (results.password !== undefined && results.password !== null) {
                    a.password = manager.aes256Decrypt(results.password);
                }
                a.requireUserLogin = results.requireUserLogin;
                callback(a);
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
exports.list = function (callback) {
    var returnVal = [];
    var Addons = db.getAddons();
    Addons.find({}, null, {sort: {name: 1}}, function (err, results) {
        console.log("found addon list: " + JSON.stringify(results));
        if (err) {
            callback({});
        } else {
            if (results !== undefined && results !== null) {
                for (var cnt = 0; cnt < results.length; cnt++) {
                    var a = {
                        _id: null,
                        name: null,
                        url: null,
                        basicAuth: false,
                        username: null,
                        password: ""
                    };
                    var addOn = results[cnt].toObject();
                    a._id = addOn._id;
                    a.name = addOn.name;
                    a.url = addOn.url;
                    a.basicAuth = addOn.basicAuth;
                    a.username = addOn.username;
                    returnVal.push(a);
                    console.log("Addon:" + JSON.stringify(a));
                }
                callback(returnVal);
            } else {
                callback({});
            }
        }
    });
};


/**
 * 
 * @param json
 *      
 */
exports.call = function (json, creds, callback) {
    var returnVal = {
        success: false,
        message: "",
        jsonResponse: null
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        var addOnId = json.addOnId;
        //var addOnName = json.addOnName;
        var method = json.method;
        var serviceName = json.serviceName;
        var methodName = json.methodName;       
        var base64Json = json.jsonRequest;
        var queryParameters = json.queryParameters;//array of key value (map)
        var pathParameters = json.pathParameters; // array of values (list)
        if (addOnId !== undefined && addOnId !== null &&
                serviceName !== undefined && serviceName !== null) {
            var Addons = db.getAddons();
            Addons.findById(addOnId, function (err, results) {
                if (err) {
                    console.log("error finding addon: " + err);
                    callback(returnVal);
                } else {
                    console.log("addon: " + JSON.stringify(results));
                    if (results !== undefined && results !== null) {
                        var allowCall = false;
                        if (results.requireUserLogin && creds !== null) {
                            allowCall = true;
                        } else if (!results.requireUserLogin) {
                            allowCall = true;
                        }
                        if (allowCall) {
                            var a = {
                                basicAuth: false,
                                username: null,
                                password: null,
                                //method: null,
                                url: null,
                                jsonRequest: null,
                                queryParameters: null,
                                pathParameters: null
                            };
                            a.basicAuth = results.basicAuth;
                            if (results.basicAuth) {
                                a.username = results.username;
                                a.password = manager.aes256Decrypt(results.password);
                            }
                            var tempUrl = results.url;
                            if (tempUrl !== undefined && tempUrl !== null) {
                                var lastChar = tempUrl.substring(tempUrl.length - 1);
                                if (lastChar !== "/") {
                                    tempUrl += "/";
                                }
                                if(methodName !== undefined && methodName !== null){
                                    tempUrl += (serviceName + "/" + methodName);
                                }else{
                                    tempUrl += serviceName;
                                }
                                
                                a.url = tempUrl;
                                if ("POST" === method) {
                                    //a.method = method;
                                    a.jsonRequest = atob(base64Json);
                                    //call proxy
                                    proxy.doPost(a, function (results) {
                                        if (results.success) {
                                            returnVal.success = true;
                                            var jsonRes = results.jsonResponse;
                                            if(jsonRes !== undefined && jsonRes !== null){
                                                jsonRes = btoa(jsonRes);
                                            }
                                            returnVal.jsonResponse = jsonRes;
                                        } else {
                                            returnVal.message = results.message;
                                        }
                                        callback(returnVal);
                                    });
                                } else if ("PUT" === method) {
                                    //a.method = method;
                                    a.jsonRequest = atob(base64Json);
                                    //call proxy
                                    proxy.doPut(a, function (results) {
                                        if (results.success) {
                                            returnVal.success = true;
                                            returnVal.jsonResponse = results.jsonResponse;
                                        } else {
                                            returnVal.message = results.message;
                                        }
                                        callback(returnVal);
                                    });
                                } else if ("GET" === method) {
                                    //a.method = method;
                                    a.queryParameters = queryParameters;
                                    a.pathParameters = pathParameters;
                                    proxy.doGet(a, function (results) {
                                        if (results.success) {
                                            returnVal.success = true;
                                            var jsonRes = results.jsonResponse;
                                            if(jsonRes !== undefined && jsonRes !== null){
                                                jsonRes = btoa(jsonRes);
                                            }
                                            returnVal.jsonResponse = jsonRes;
                                        } else {
                                            returnVal.message = results.message;
                                        }
                                        callback(returnVal);
                                    });
                                } else if ("DELETE" === method) {
                                    //a.method = method;
                                    a.queryParameters = queryParameters;
                                    a.pathParameters = pathParameters;
                                    proxy.doDelete(a, function (results) {
                                        if (results.success) {
                                            returnVal.success = true;
                                            returnVal.jsonResponse = results.jsonResponse;
                                        } else {
                                            returnVal.message = results.message;
                                        }
                                        callback(returnVal);
                                    });
                                }
                            } else {
                                callback(returnVal);
                            }
                        }
                    }

                }
            });
        } else {
            returnVal.message = "bad addon";
            callback(returnVal);
        }

    } else {
        callback(returnVal);
    }
};



