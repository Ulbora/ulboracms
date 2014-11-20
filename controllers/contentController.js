//contentController
var db = require('../db/db');
var manager = require('../managers/manager');
var contentManager = require('../managers/contentManager');
var commentManager = require('../managers/commentManager');
var publicUserManager = require('../managers/publicUserManager');
var atob = require('atob');//base64 to json

exports.getContentList = function (req, filter, loggedIn, callback) {
    var creds = {
        loggedIn: loggedIn
    };
    console.log("filter data in content list: " + JSON.stringify(filter));
    var browserLan = req.headers["accept-language"];
    var locations = [];
    locations.push("FrontPage");
    var Location = db.getLocation();
    Location.find({}, function (err, locs) {
        if (!err && locs !== undefined && locs !== null) {
            for (var locCnt = 0; locCnt < locs.length; locCnt++) {
                var foundLoc = locs[locCnt];
                locations.push(foundLoc.name);
            }
        }
        contentManager.getContentList(filter, creds, browserLan, function (result) {
            console.log("in callback");
            console.log("articleLocation: " + JSON.stringify(result));
            for (var lcnt = 0; lcnt < locations.length; lcnt++) {
                var locName = locations[lcnt];
                console.log("location:" + locName);
                for (var cnt = 0; cnt < result.articleLocations[locName].length; cnt++) {
                    console.log("location array all:" + JSON.stringify(result.articleLocations));
                    console.log("location array:" + JSON.stringify(result.articleLocations[locName]));
                    console.log("location before conversion html:" + result.articleLocations[locName][cnt].articleText.text);
                    if (result.articleLocations[locName][cnt].articleText.processed === undefined || result.articleLocations[locName][cnt].articleText.processed === null) {
                        result.articleLocations[locName][cnt].articleText.text = atob(result.articleLocations[locName][cnt].articleText.text);
                        console.log("location after conversion html:" + result.articleLocations[locName][cnt].articleText.text);
                        result.articleLocations[locName][cnt].articleText.processed = true;
                    }

                }
            }

            callback(result);
        });
    });


};


exports.getArticle = function (req, loggedIn, callback) {
    var creds = {
        loggedIn: loggedIn
    };
    var id = req.query.id;
    contentManager.getArticle(id, creds, function (results) {
        results.articleText.text = atob(results.articleText.text);
        results.user.password = "";
        callback(results);
    });
};

exports.login = function (req, callback) {
    var json = {
        username: null,
        password: null
    };
    var creds = {
        id: null,
        loggedIn: false
    };
    var u = req.body.username;
    var p = req.body.password;
    if (u !== undefined && u !== null && p !== undefined && p !== null) {
        json.username = u;
        json.password = p;
        console.log("login request: " + json);
        publicUserManager.login(json, function (loginStatus) {
            //console.log("login success: " + returnVal);
            console.log("exit service login success: " + loginStatus);

            if (loginStatus) {
                var User = db.getUser();
                User.findOne({username: json.username}, function (err, results) {
                    if (!err && results !== undefined && results !== null) {
                        creds.id = results._id;
                        creds.loggedIn = loginStatus;
                    }
                    callback(creds);
                });
            } else {
                callback(creds);
            }

        });
    } else {
        callback(creds);
    }


};

exports.addComment = function (req, loggedIn, userId, callback) {
    var creds = null;
    var reqBody = req.body;
    var bodyJson = JSON.stringify(reqBody);
    console.log("comment body: " + bodyJson);
    if (loggedIn && userId !== undefined && userId !== null) {
        creds = {
            id: userId,
            loggedIn: loggedIn
        };
    }
    commentManager.create(reqBody, creds, function (result) {
        callback(result);
    });

};

exports.getMicbuttionChallenge = function (req, callback) {
    var browserLan = req.headers["accept-language"];
    publicUserManager.getMicbuttionChallenge(browserLan, function (response) {
        console.log("micbutton challenge:" + JSON.stringify(response));
        callback(response);
    });
};

exports.register = function (req, callback) {
    var returnVal = {
        success: false
    };
    var reqBody = req.body;
    if (reqBody.password !== undefined && reqBody.password !== null &&
            reqBody.confirm !== undefined && reqBody.confirm !== null &&
            reqBody.password === reqBody.confirm) {
        console.log("registration request: " + JSON.stringify(reqBody));
        publicUserManager.register(reqBody, function (regStatus) {
            console.log("exit registration success: " + JSON.stringify(regStatus));
            callback(regStatus);
        });
    } else {
        console.log("exit registration failed: " + JSON.stringify(reqBody));
        callback(returnVal);
    }

};


exports.resetPassword = function (req, callback) {
    var reqBody = req.body;
    console.log("registration request: " + JSON.stringify(reqBody));
    publicUserManager.resetPassword(reqBody, function (regStatus) {
        console.log("exit registration success: " + JSON.stringify(regStatus));
        callback(regStatus);
    });
};