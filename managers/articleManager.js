//articleManager


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
    var sendPublishEmail = false;
    var isOk = manager.securityCheck(json);
    if (isOk) {
        var Location = db.getLocation();
        Location.find({}, null, {sort: {name: 1}}, function(locErr, locationlist) {
            if (locErr) {
                returnVal.message = "save failed";
                console.log("location error: " + locErr);
                callback(returnVal);
            } else {
                console.log("locationlist=" + locationlist);
                requirePublishApproval(function(publicationRules) {
                    if (publicationRules.approvalRequired) {
                        json.published = false;
                        sendPublishEmail = true;
                    }
                    if (json.accessLevel !== undefined && json.accessLevel !== null) {
                        manager.validateAccessLevel(json.accessLevel, function(validAccessLevel) {
                            if (validAccessLevel) {
                                //no need to validate user already done at this point
                                //validate cat
                                if (json.category !== undefined && json.category !== null) {
                                    manager.validateCategory(json.category, function(validCategory) {
                                        if (validCategory) {
                                            //no need to validate user already done at this point 
                                            //validate sec
                                            if (json.section !== undefined && json.section !== null) {
                                                manager.validateSection(json.section, function(validSection) {
                                                    if (validSection) {
                                                        //no need to validate user already done at this point 
                                                        //validate lan
                                                        if (json.language !== undefined && json.language !== null) {
                                                            manager.validateLanguage(json.language, function(validLanguage) {
                                                                if (validLanguage) {
                                                                    //no need to validate user already done at this point 
                                                                    console.log("locationList:" + json.locationList);
                                                                    var locIds = json.locationList.toString();
                                                                    var locList = null;
                                                                    if (locIds !== undefined && locIds !== null) {
                                                                        locList = locIds.split(",");
                                                                    }
                                                                    console.log("article locations=" + locList);
                                                                    delete json.locationList;
                                                                    var articleText = json.articleText;
                                                                    if (articleText !== undefined && articleText !== null &&
                                                                            articleText.text !== undefined && articleText !== null) {
                                                                        console.log("article text=" + JSON.stringify(articleText));
                                                                        delete json.articleText;
                                                                        json.user = creds.id;
                                                                        var tag = json.tag;
                                                                        delete json.tag;
                                                                        var Article = db.getArticle();
                                                                        var art = new Article(json);
                                                                        art.save(function(artErr) {
                                                                            if (artErr) {
                                                                                returnVal.message = "save failed";
                                                                                console.log("article save error: " + artErr);
                                                                                callback(returnVal);
                                                                            } else {
                                                                                articleText.active = true;
                                                                                if (articleText.version === undefined || articleText.version === null) {
                                                                                    articleText.version = 1;
                                                                                }
                                                                                if (articleText.text === "") {
                                                                                    articleText.text = " ";
                                                                                }
                                                                                articleText.article = art._id;
                                                                                var ArticleText = db.getArticleText();
                                                                                var artText = new ArticleText(articleText);
                                                                                artText.save(function(atErr) {
                                                                                    if (atErr) {
                                                                                        returnVal.message = "save failed";
                                                                                        console.log("article text save error: " + atErr);
                                                                                        callback(returnVal);
                                                                                    } else {
                                                                                        // validate location
                                                                                        if (locList !== undefined && locList !== null) {
                                                                                            console.log("in location check");
                                                                                            for (var locCnt = 0; locCnt < locList.length; locCnt++) {
                                                                                                console.log("in location for loop");
                                                                                                var loc = locList[locCnt];
                                                                                                console.log("location to save=" + loc);
                                                                                                if (loc !== undefined && loc !== null) {
                                                                                                    for (var locListCnt = 0; locListCnt < locationlist.length; locListCnt++) {
                                                                                                        console.log("locations the same:" + (loc === locationlist[locListCnt]._id.toString()))
                                                                                                        if (loc === locationlist[locListCnt]._id.toString()) {
                                                                                                            console.log("in location for save");
                                                                                                            saveArticleLocation(loc, art._id);
                                                                                                            console.log("save article location");
                                                                                                            break;
                                                                                                        }
                                                                                                    }

                                                                                                }
                                                                                            }

                                                                                        }
                                                                                        if (tag !== undefined && tag !== null &&
                                                                                                tag.keyWords !== undefined && tag.keyWords !== null) {
                                                                                            //tag.link = "article/";
                                                                                            tag.article = art._id;
                                                                                            saveTag(tag);
                                                                                        }
                                                                                        if (json.frontPage !== undefined && json.frontPage !== null && json.frontPage) {
                                                                                            saveFrontPage(art._id);
                                                                                        }
                                                                                        if (sendPublishEmail) {
                                                                                            // send email here-----------------
                                                                                        }
                                                                                        returnVal.success = true;
                                                                                        callback(returnVal);
                                                                                    }
                                                                                });
                                                                                //returnVal.success = true;
                                                                                //callback(returnVal);
                                                                            }
                                                                        });
                                                                    } else {
                                                                        returnVal.message = "bad article";
                                                                        callback(returnVal);
                                                                    }
                                                                } else {
                                                                    returnVal.message = "bad language";
                                                                    callback(returnVal);
                                                                }
                                                            });
                                                        } else {
                                                            returnVal.message = "bad language";
                                                            callback(returnVal);
                                                        }
                                                    } else {
                                                        returnVal.message = "bad section";
                                                        callback(returnVal);
                                                    }
                                                });
                                            } else {
                                                returnVal.message = "bad section";
                                                callback(returnVal);
                                            }
                                        } else {
                                            returnVal.message = "bad Category";
                                            callback(returnVal);
                                        }
                                    });
                                } else {
                                    returnVal.message = "bad category";
                                    callback(returnVal);
                                }
                            } else {
                                returnVal.message = "bad access level";
                                callback(returnVal);
                            }
                        });
                    } else {
                        returnVal.message = "bad access level";
                        callback(returnVal);
                    }
                });
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
    var returnVal = {
        success: false,
        message: ""
    };
    var sendPublishEmail = false;
    var isOk = manager.securityCheck(json);
    if (isOk) {
        var Location = db.getLocation();
        Location.find({}, null, {sort: {name: 1}}, function(locErr, locationlist) {
            if (locErr) {
                returnVal.message = "save failed";
                console.log("location error: " + locErr);
                callback(returnVal);
            } else {
                console.log("locationlist=" + locationlist);
                requirePublishApproval(function(publicationRules) {
                    if (publicationRules.approvalRequired) {
                        json.published = false;
                        sendPublishEmail = true;
                    }
                    if (json.accessLevel !== undefined && json.accessLevel !== null) {
                        manager.validateAccessLevel(json.accessLevel, function(validAccessLevel) {
                            if (validAccessLevel) {
                                //no need to validate user already done at this point
                                //validate cat
                                if (json.category !== undefined && json.category !== null) {
                                    manager.validateCategory(json.category, function(validCategory) {
                                        if (validCategory) {
                                            //no need to validate user already done at this point 
                                            //validate sec
                                            if (json.section !== undefined && json.section !== null) {
                                                manager.validateSection(json.section, function(validSection) {
                                                    if (validSection) {
                                                        //no need to validate user already done at this point 
                                                        //validate lan
                                                        if (json.language !== undefined && json.language !== null) {
                                                            manager.validateLanguage(json.language, function(validLanguage) {
                                                                if (validLanguage) {
                                                                    //no need to validate user already done at this point 
                                                                    console.log("locationList:" + json.locationList);
                                                                    var locIds = json.locationList.toString();
                                                                    var locList = null;
                                                                    if (locIds !== undefined && locIds !== null) {
                                                                        locList = locIds.split(",");
                                                                    }
                                                                    console.log("article locations=" + locList);
                                                                    delete json.locationList;
                                                                    var articleText = json.articleText;
                                                                    if (articleText !== undefined && articleText !== null &&
                                                                            articleText.text !== undefined && articleText !== null &&
                                                                            articleText.id !== undefined && articleText.id !== null) {
                                                                        console.log("article text=" + JSON.stringify(articleText));
                                                                        delete json.articleText;
                                                                        /////json.user = creds.id;
                                                                        if (articleText.text === "") {
                                                                            articleText.text = " ";
                                                                        }

                                                                        var tag = json.tag;
                                                                        delete json.tag;
                                                                        var Article = db.getArticle();
                                                                        // var art = new Article(json);
                                                                        // get article
                                                                        Article.findById(json.id, function(artErr, art) {
                                                                            //art.save(function(artErr) {
                                                                            if (artErr) {
                                                                                returnVal.message = "save failed";
                                                                                console.log("article save error: " + artErr);
                                                                                callback(returnVal);
                                                                            } else {
                                                                                if (art !== undefined && art !== null) {
                                                                                    art.user = creds.id;
                                                                                    art.title = json.title;
                                                                                    art.alias = json.alias;
                                                                                    art.metaAuthorName = json.metaAuthorName;
                                                                                    art.metaDesc = json.metaDesc;
                                                                                    art.metaKeyWords = json.metaKeyWords;
                                                                                    art.metaRobotKeyWords = json.metaRobotKeyWords;
                                                                                    art.modifiedDate = new Date();
                                                                                    art.published = json.published;
                                                                                    art.showAuthor = json.showAuthor;
                                                                                    art.showCategoryName = json.showCategoryName;
                                                                                    art.showCreateDate = json.showCreateDate;
                                                                                    art.showIntroText = json.showIntroText;
                                                                                    art.showModifyDate = json.showModifyDate;
                                                                                    art.showSectionName = json.showSectionName;
                                                                                    art.showTitle = json.showTitle;
                                                                                    art.fullPage = json.fullPage;
                                                                                    art.allowComments = json.allowComments;
                                                                                    art.commentsRequireLogin =  json.commentsRequireLogin;
                                                                                    art.createdDate = json.createdDate;
                                                                                    art.commentsStartDate = json.commentsStartDate;
                                                                                    art.commentsEndDate = json.commentsEndDate;
                                                                                    art.accessLevel = json.accessLevel;
                                                                                    art.category = json.category;
                                                                                    art.section = json.section;
                                                                                    art.language = json.language;
                                                                                    if(json.menuIndex !== undefined && json.menuIndex !== null){
                                                                                        art.menuIndex = json.menuIndex;
                                                                                    }                                                                                    
                                                                                    art.save(function(artUpdateErr) {
                                                                                        if (artUpdateErr) {
                                                                                            returnVal.message = "update failed";
                                                                                            console.log("article update error: " + artErr);
                                                                                            callback(returnVal);
                                                                                        } else {
                                                                                            var ArticleText = db.getArticleText();
                                                                                            //var artText = new ArticleText(articleText);
                                                                                            //get articleText
                                                                                            ArticleText.findById(articleText.id, function(artTxtErr, articleTextResults) {
                                                                                                // artText.save(function(atErr) {
                                                                                                if (artTxtErr) {
                                                                                                    returnVal.message = "update failed";
                                                                                                    console.log("article text update error: " + atErr);
                                                                                                    callback(returnVal);
                                                                                                } else {
                                                                                                    if (articleTextResults !== undefined && articleTextResults !== null) {
                                                                                                        articleTextResults.text = articleText.text;
                                                                                                        articleTextResults.save(function(atErr) {
                                                                                                            if (atErr) {
                                                                                                                returnVal.message = "update failed";
                                                                                                                console.log("article text update error: " + atErr);
                                                                                                                callback(returnVal);
                                                                                                            } else {

                                                                                                                // make a call to delete all art locations===========
                                                                                                                // validate location
                                                                                                                deleteArticleLocations(art._id, function() {
                                                                                                                    if (locList !== undefined && locList !== null) {
                                                                                                                        console.log("in location check");
                                                                                                                        for (var locCnt = 0; locCnt < locList.length; locCnt++) {
                                                                                                                            console.log("in location for loop");
                                                                                                                            var loc = locList[locCnt];
                                                                                                                            console.log("location to save=" + loc);
                                                                                                                            if (loc !== undefined && loc !== null) {
                                                                                                                                for (var locListCnt = 0; locListCnt < locationlist.length; locListCnt++) {
                                                                                                                                    console.log("locations the same:" + (loc === locationlist[locListCnt]._id.toString()))
                                                                                                                                    if (loc === locationlist[locListCnt]._id.toString()) {
                                                                                                                                        console.log("in location for save");
                                                                                                                                        saveArticleLocation(loc, art._id);
                                                                                                                                        break;
                                                                                                                                    }
                                                                                                                                }

                                                                                                                            }
                                                                                                                        }

                                                                                                                    }
                                                                                                                    // find the tag and update it===================
                                                                                                                    if (tag !== undefined && tag !== null &&
                                                                                                                            tag.keyWords !== undefined && tag.keyWords !== null) {
                                                                                                                        //tag.link = "article/";
                                                                                                                        var Tag = db.getTag();
                                                                                                                        Tag.findOne({article: art._id}, function(tagErr, tagResults) {
                                                                                                                            if (!tagErr && tagResults !== undefined && tagResults !== null) {
                                                                                                                                tagResults.keyWords = tag.keyWords;
                                                                                                                                tagResults.save(function(tagErr) {
                                                                                                                                    if (tagErr) {
                                                                                                                                        console.log("tag to update error" + tagErr);
                                                                                                                                    }
                                                                                                                                });
                                                                                                                            } else {
                                                                                                                                tag.article = art._id;
                                                                                                                                saveTag(tag);
                                                                                                                            }
                                                                                                                        });
                                                                                                                        //tag.article = art._id;
                                                                                                                        //saveTag(tag);
                                                                                                                    }
                                                                                                                    if (json.frontPage !== undefined && json.frontPage !== null && json.frontPage) {
                                                                                                                        saveFrontPage(art._id);
                                                                                                                    } else {
                                                                                                                        removeFrontPage(art._id);
                                                                                                                    }
                                                                                                                    if (sendPublishEmail) {
                                                                                                                        // send email here-----------------
                                                                                                                    }

                                                                                                                    returnVal.success = true;
                                                                                                                    callback(returnVal);
                                                                                                                });


                                                                                                            }
                                                                                                        });


                                                                                                    } else {
                                                                                                        returnVal.message = "bad article";
                                                                                                        callback(returnVal);
                                                                                                    }

                                                                                                }
                                                                                                ////////////////////// });
                                                                                                //returnVal.success = true;
                                                                                                //callback(returnVal);
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                    //articleText.active = true;
                                                                                    // if (articleText.version === undefined || articleText.version === null) {
                                                                                    //   articleText.version = 1;
                                                                                    // }
                                                                                    // articleText.article = art._id;

                                                                                } else {
                                                                                    returnVal.message = "bad article";
                                                                                    callback(returnVal);
                                                                                }

                                                                            }
                                                                        });

                                                                        //});
                                                                    } else {
                                                                        returnVal.message = "bad article";
                                                                        callback(returnVal);
                                                                    }
                                                                } else {
                                                                    returnVal.message = "bad language";
                                                                    callback(returnVal);
                                                                }
                                                            });
                                                        } else {
                                                            returnVal.message = "bad language";
                                                            callback(returnVal);
                                                        }
                                                    } else {
                                                        returnVal.message = "bad section";
                                                        callback(returnVal);
                                                    }
                                                });
                                            } else {
                                                returnVal.message = "bad section";
                                                callback(returnVal);
                                            }
                                        } else {
                                            returnVal.message = "bad Category";
                                            callback(returnVal);
                                        }
                                    });
                                } else {
                                    returnVal.message = "bad category";
                                    callback(returnVal);
                                }
                            } else {
                                returnVal.message = "bad access level";
                                callback(returnVal);
                            }
                        });
                    } else {
                        returnVal.message = "bad access level";
                        callback(returnVal);
                    }
                });
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
exports.delete = function(id, callback) {
    // it is important to delete all mongodb documents related to this article before deleting the article
    var returnVal = {
        success: false,
        message: ""
    };
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var Article = db.getArticle();
        Article.findById(id, function(artErr, results) {
            if (!artErr && results !== undefined && results !== null) {
                deleteArticleLocations(id, null);
                deleteArticleText(id);
                deleteComments(id);
                removeFrontPage(id);
                deleteTags(id);
                results.remove();
                returnVal.success = true;
                callback(returnVal);
            } else {
                returnVal.message = "bad article";
                callback(returnVal);
            }
        });
    } else {
        returnVal.message = "bad article";
        callback(returnVal);
    }
};


/**
 * 
 * @param id
 *      
 */
exports.get = function(id, callback) {
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var Article = db.getArticle();
        Article.findById(id, function(artErr, results) {
            console.log("found article: " + JSON.stringify(results));
            if (!artErr && (results !== undefined && results !== null)) {
                var a = results.toObject();
                var ArticleText = db.getArticleText();
                ArticleText.findOne({article: results._id, active: true}, null, function(artTxtErr, articleTextResults) {
                    if (!artTxtErr && (articleTextResults !== undefined && articleTextResults !== null)) {
                        var binaryText = articleTextResults.text;
                        //console.log("binary text: " + binaryText);
                        //console.log("binary text to string: " + binaryText.toString());
                        a.articleText = articleTextResults.toObject();
                        a.articleText.text = binaryText.toString();
                        //console.log("binary converted obj text: " + a.articleText.text);
                        var FrontPage = db.getFrontPage();
                        FrontPage.find({article: results._id}, function(fpErr, frontPageResults) {
                            if (!fpErr && (frontPageResults !== undefined && frontPageResults !== null && frontPageResults.length > 0)) {
                                a.frontPage = true;
                            } else {
                                a.frontPage = false;
                            }
                            var ArticleLocation = db.getArticleLocation();
                            ArticleLocation.find({article: results._id}, function(artLocErr, artLocResults) {
                                if (!artLocErr && (artLocResults !== undefined && artLocResults !== null)) {
                                    var artLocList = [];
                                    for (var artLocCnt = 0; artLocCnt < artLocResults.length; artLocCnt++) {
                                        artLocList.push(artLocResults[artLocCnt].location);
                                    }
                                    a.articleLocationList = artLocList;
                                }
                                var Tag = db.getTag();
                                Tag.findOne({article: results._id}, function(tagErr, tagResults) {
                                    if (!tagErr && (tagResults !== undefined && tagResults !== null)) {
                                        a.tag = tagResults;
                                    }
                                    var User = db.getUser();
                                    User.findById(results.user, function(userErr, foundUser) {
                                        if (!userErr && (foundUser !== undefined && foundUser !== null)) {
                                            a.user = foundUser;
                                            var articleUrlLink = "http://yourDomain"  + "/article/" + a._id;
                                            a.accessUrl = articleUrlLink;
                                            callback(a);
                                        } else {
                                            callback({});
                                        }

                                    });
                                    //console.log("article object: " + JSON.stringify(a));

                                });

                            });

                        });

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
exports.list = function(callback) {
    var Article = db.getArticle();
    Article.find({}, null, {sort: {title: 1}}, function(artErr, results) {
        console.log("found article list: " + JSON.stringify(results));
        if (artErr) {
            callback({});
        } else {
            if (results !== undefined && results !== null) {
                var FrontPage = db.getFrontPage();
                FrontPage.find({}, function(fpErr, frontPageResults) {
                    if (fpErr) {
                        callback({});
                    }
                    var returnVal = [];
                    var userList = [];
                    for (var cnt = 0; cnt < results.length; cnt++) {
                        var uid = results[cnt].user.toString();
                        var i = userList.indexOf(uid);
                        if (i === -1) {
                            userList.push(uid);
                        }
                    }
                    var User = db.getUser();
                    User.find({_id: {$in: userList}}, null, {sort: {username: 1}}, function(uErr, users) {
                        if (!uErr && users !== undefined && users !== null) {
                            for (var cnt = 0; cnt < results.length; cnt++) {
                                var a = null;
                                for (var uCnt = 0; uCnt < users.length; uCnt++) {
                                    if (users[uCnt]._id.toString() === results[cnt].user.toString()) {
                                        a = results[cnt].toObject();
                                        a.user = users[uCnt];
                                        a.frontPage = false;
                                        //returnVal.push(a);
                                        break;
                                    }
                                }
                                if (frontPageResults !== undefined && frontPageResults !== null) {
                                    for (var fpCnt = 0; fpCnt < frontPageResults.length; fpCnt++) {
                                        if (frontPageResults[fpCnt].article.toString() === results[cnt]._id.toString()) {
                                            a.frontPage = true;
                                            break;
                                        }
                                    }
                                }
                                returnVal.push(a);
                            }

                            callback(returnVal);
                        } else {
                            callback({});
                        }
                    });
                });
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
exports.values = function(json, creds, callback) {
    if (json.languageCode !== undefined && json.languageCode !== null) {
        json.languageCode = json.languageCode.toLowerCase();
        json.languageCode = json.languageCode.replace("_", "-");
    }
    console.log("languageCode: " + JSON.stringify(json.languageCode));
    var returnVal = {
        "uploadKey": null,
        "username": null,
        "accessLevelList": null,
        "categoryList": null,
        "sectionList": null,
        "locationList": null,
        "languageList": null
    };
    var isOk = manager.securityCheck(json);
    if (isOk) {
        var LanguageLookup = db.getLanguage();
        LanguageLookup.findOne({code: json.languageCode}, function(lannerr, lan) {
            console.log("found lookup language: " + JSON.stringify(lan));
            if (!lannerr && lan !== undefined && lan !== null) {

                returnVal.uploadKey = manager.generateFileUploadKey(creds.username);
                returnVal.username = creds.username;
                var AccessLevel = db.getAccessLevel();
                AccessLevel.find({}, null, {sort: {name: 1}}, function(alerr, alList) {
                    console.log("found AccessLevel list: " + JSON.stringify(alList));
                    if (!alerr && alList !== undefined && alList !== null) {
                        returnVal.accessLevelList = alList;
                    }
                    var Category = db.getCategory();
                    Category.find({language: lan._id}, null, {sort: {name: 1}}, function(cerr, clist) {
                        console.log("found category list: " + JSON.stringify(clist));
                        if (!cerr && clist !== undefined && clist !== null) {
                            returnVal.categoryList = clist;
                        }
                        var Section = db.getSection();
                        Section.find({language: lan._id}, null, {sort: {name: 1}}, function(serr, slist) {
                            console.log("found section list: " + JSON.stringify(slist));
                            if (!serr && slist !== undefined && slist !== null) {
                                returnVal.sectionList = slist;
                            }
                            var Location = db.getLocation();
                            Location.find({}, null, {sort: {name: 1}}, function(lerr, llist) {
                                console.log("found locaton list: " + JSON.stringify(llist));
                                if (!lerr && llist !== undefined && llist !== null) {
                                    returnVal.locationList = llist;
                                }
                                var Language = db.getLanguage();
                                Language.find({}, null, {sort: {name: 1}}, function(lnerr, lnlist) {
                                    console.log("found locaton list: " + JSON.stringify(lnlist));
                                    if (!lnerr && lnlist !== undefined && lnlist !== null) {
                                        returnVal.languageList = lnlist;
                                    }
                                    callback(returnVal);
                                });
                            });
                        });
                    });
                });
            } else {
                callback(returnVal);
            }
        });
    } else {
        callback(returnVal);
    }
};


requirePublishApproval = function(callback) {
    var rule = {
        "approvalRequired": false
    };
    var RuleDeclaration = db.getRuleDeclaration();
    RuleDeclaration.findOne({ruleKey: manager.REQUIRE_PUBLISH_APPROVAL_RULE_KEY}, function(ruleErr, ruleDec) {
        if (!ruleErr && ruleDec !== undefined && ruleDec !== null) {
            var WorkflowRule = db.getWorkflowRule();
            WorkflowRule.find({ruleDeclaration: ruleDec._id}, function(wfrErr, wfrResults) {
                console.log("rules Dec: " + JSON.stringify(wfrResults));
                if (!wfrErr && wfrResults !== undefined && wfrResults !== null && wfrResults.length > 0) {
                    rule.approvalRequired = true;
                    callback(rule);
                } else {
                    callback(rule);
                }
            });
        } else {
            callback(rule);
        }
    });



};


saveArticleLocation = function(loc, art) {
    //manager.validateLocation(loc, function(validLocation) {
    //if (validLocation) 
    console.log("in save article location: loc: "+ loc + "article: "+ art);
    var ArticleLocation = db.getArticleLocation();
    console.log("after get article location");
    var artLoc = {
        "article": null,
        "location": null
    };
    artLoc.article = art;
    artLoc.location = loc;
    console.log("artLoc:" + artLoc);
    var articleLocation = new ArticleLocation(artLoc);
    articleLocation.save(function(err) {
        if (err) {
            console.log("article location save error: " + err);
        }else{
            console.log("article location saved");
        }
    });
    // }
    // });
};

saveTag = function(tag) {
    var Tag = db.getTag();
    var t = new Tag(tag);
    t.save(function(err) {
        if (err) {
            console.log("article tag save error: " + err);
        }
    });

};

saveFrontPage = function(artId) {
    var FrontPage = db.getFrontPage();
    FrontPage.find({article: artId}, function(err, results) {
        if (!err && results === undefined || results === null || results.length === 0) {
            var fp = {
                "article": artId
            }
            var f = new FrontPage(fp);
            f.save(function(err) {
                if (err) {
                    console.log("front page save error: " + err);
                }
            });
        }
    });


};

removeFrontPage = function(artId) {
    var FrontPage = db.getFrontPage();
    FrontPage.find({article: artId}, function(err, results) {
        if (!err && results !== undefined && results !== null) {
            console.log("front page delete: " + results);
            for (var cnt = 0; cnt < results.length; cnt++) {
                var fp = results[cnt];
                fp.remove();
            }

        } else {
            console.log("front page delete error: " + err);
        }
    });
};



deleteArticleLocations = function(artId, callback) {
    var ArticleLocation = db.getArticleLocation();
    ArticleLocation.find({article: artId}, function(artLocErr, artLocResults) {
        if (!artLocErr && (artLocResults !== undefined && artLocResults !== null)) {
            for (var cnt = 0; cnt < artLocResults.length; cnt++) {
                var artLoc = artLocResults[cnt];
                artLoc.remove();
            }
            if (callback !== undefined && callback !== null) {
                callback();
            }
        } else {
            if (callback !== undefined && callback !== null) {
                callback();
            }
        }
    });
};

deleteArticleText = function(artId) {
    var ArticleText = db.getArticleText();
    ArticleText.find({article: artId}, function(err, results) {
        if (!err && results !== undefined && results !== null) {
            console.log("article text delete: " + results);
            for (var cnt = 0; cnt < results.length; cnt++) {
                var obj = results[cnt];
                obj.remove();
            }

        } else {
            console.log("article text delete error: " + err);
        }
    });
};

deleteComments = function(artId) {
    var Comment = db.getComment();
    Comment.find({article: artId}, function(err, results) {
        if (!err && results !== undefined && results !== null) {
            console.log("comment delete: " + results);
            for (var cnt = 0; cnt < results.length; cnt++) {
                var obj = results[cnt];
                obj.remove();
            }

        } else {
            console.log("comment delete error: " + err);
        }
    });
};

deleteTags = function(artId) {
    var Tag = db.getTag();
    Tag.find({article: artId}, function(err, results) {
        if (!err && results !== undefined && results !== null) {
            console.log("tag delete: " + results);
            for (var cnt = 0; cnt < results.length; cnt++) {
                var obj = results[cnt];
                obj.remove();
            }

        } else {
            console.log("tag delete error: " + err);
        }
    });
};


