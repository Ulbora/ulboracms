//commentManager



var db = require('../db/db');
var manager = require('../managers/manager');

/**
 * 
 * @param json
 *      
 */
exports.create = function (json, creds, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        if (json.article !== undefined && json.article !== null &&
                json.text !== undefined && json.text !== null) {
            var Article = db.getArticle();
            Article.findById(json.article, function (artErr, art) {
                if (artErr) {
                    returnVal.message = "bad article";
                    console.log("article error: " + artErr);
                    callback(returnVal);
                } else {
                    if (art !== undefined && art !== null) {
                        console.log("comments in manager: " + JSON.stringify(json));
                        var allowComment = false;
                        if (art.commentsRequireLogin && creds !== undefined && creds !== null) {
                            json.commenter = creds.id;
                            allowComment = true;
                        } else if (!art.commentsRequireLogin) {
                            allowComment = true;
                        }
                        //if (!json.anonymousComments) {
                        //json.commenter = creds.id;
                        //}
                        console.log("allow comments: " + allowComment);
                        if (allowComment) {
                            var Comment = db.getComment();
                            var com = new Comment(json);
                            com.save(function (comErr) {
                                if (comErr) {
                                    returnVal.message = "comment save failed";
                                    console.log("comment save error: " + comErr);
                                    callback(returnVal);
                                } else {
                                    returnVal.success = true;
                                    callback(returnVal);
                                }
                            });
                        } else {
                            callback(returnVal);
                        }
                    } else {
                        returnVal.message = "bad article";
                        callback(returnVal);
                    }
                }
            });
        } else {
            returnVal.message = "bad article";
            callback(returnVal);
        }
    } else {
        callback(returnVal);
    }
};


/**
 * 
 * @param json
 *      
 */
exports.update = function (json, creds, callback) {
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        if (json.id !== undefined && json.id !== null &&
                json.text !== undefined && json.text !== null && json.text.length > 0) {
            var Comment = db.getComment();
            Comment.findById(json.id, function (comErr, comResults) {
                console.log("found comment: " + JSON.stringify(comResults));
                if (!comErr && (comResults !== undefined && comResults !== null)) {
                    comResults.text = json.text;
                    comResults.approved = json.approved;
                    comResults.save(function (err) {
                        if (err) {
                            console.log("comment save error: " + err);
                        } else {
                            returnVal.success = true;
                        }
                        callback(returnVal);
                    });
                } else {
                    returnVal.message = "bad input";
                    callback(returnVal);
                }
            });

        } else {
            returnVal.message = "bad input";
            callback(returnVal);
        }
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
        var Comment = db.getComment();
        Comment.findById(id, function (comErr, comResults) {
            console.log("found comment: " + JSON.stringify(comResults));
            if (!comErr && (comResults !== undefined && comResults !== null)) {
                comResults.remove();
                returnVal.success = true;
                callback(returnVal);
            } else {
                returnVal.message = "bad input";
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
        var Comment = db.getComment();
        Comment.findById(id, function (comErr, comResults) {
            console.log("found comment: " + JSON.stringify(comResults));
            if (!comErr && (comResults !== undefined && comResults !== null)) {
                var c = {
                    _id: null,
                    text: null,
                    articleTitle: null,
                    commenter: null,
                    approved: false
                }
                var Article = db.getArticle();
                Article.findById(comResults.article, function (artErr, article) {
                    if (!artErr && (article !== undefined && article !== null)) {
                        if (comResults.commenter !== undefined && comResults.commenter !== null) {
                            var User = db.getUser();
                            User.findById(comResults.commenter, function (userErr, foundUser) {
                                if (!userErr && (foundUser !== undefined && foundUser !== null)) {
                                    c._id = comResults._id;
                                    c.text = comResults.text;
                                    c.approved = comResults.approved;
                                    c.articleTitle = article.title;
                                    c.commenter = foundUser.firstName + " " + foundUser.lastName;
                                    callback(c);
                                } else {
                                    callback({});
                                }

                            });
                        } else {
                            c._id = comResults._id;
                            c.text = comResults.text;
                            c.approved = comResults.approved;
                            c.articleTitle = article.title;
                            c.commenter = "Anonymous";
                            callback(c);
                        }

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
exports.list = function (callback) {
    console.log("in comment manager");
    var Comment = db.getComment();
    Comment.find({}, null, {sort: {article: 1}}, function (comErr, commentList) {
        console.log("found comment list: " + JSON.stringify(commentList));
        if (comErr) {
            callback({});
        } else {
            if (commentList !== undefined && commentList !== null) {
                var returnVal = [];
                var artList = [];
                for (var cnt = 0; cnt < commentList.length; cnt++) {
                    var aid = commentList[cnt].article.toString();
                    var i = artList.indexOf(aid);
                    if (i === -1) {
                        artList.push(aid);
                    }
                }
                var Article = db.getArticle();
                Article.find({_id: {$in: artList}}, null, {sort: {title: 1}}, function (artErr, articleList) {
                    if (!artErr && articleList !== undefined && articleList !== null) {
                        for (var cnt = 0; cnt < commentList.length; cnt++) {
                            var c = null;
                            for (var aCnt = 0; aCnt < articleList.length; aCnt++) {
                                if (articleList[aCnt]._id.toString() === commentList[cnt].article.toString()) {
                                    c = commentList[cnt].toObject();
                                    c.articleTitle = articleList[aCnt].title;
                                    var ct = c.text;
                                    if (ct.length > 16) {
                                        c.text = c.text.substring(0, 15);
                                    }
                                    break;
                                }
                            }
                            returnVal.push(c);
                        }
                        callback(returnVal);
                    } else {
                        callback({});
                    }
                });

            } else {
                callback({});
            }
        }
    });
};



