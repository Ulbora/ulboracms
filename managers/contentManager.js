//contentManager

var db = require('../db/db');
var manager = require('../managers/manager');
var atob = require('atob');//base64 to json
var btoa = require('btoa');//json to base64


/**
 * 
 * @param id
 *      
 */
exports.getArticle = function (id, creds, callback) {
    var isOk = manager.securityCheck(id);
    if (isOk) {
        console.log("id: " + id);
        var User = db.getUser();
        User.find({}, function (userListErr, userList) {
            var userMap = [];
            if (!userListErr && userList !== undefined && userList !== null) {
                for (var um = 0; um < userList.length; um++) {
                    var umo = userList[um].toObject();
                    umo.password = "";
                    userMap[umo._id] = umo;
                }
            }
            var Article = db.getArticle();
            Article.findById(id, function (artErr, results) {
                console.log("found article: " + JSON.stringify(results));
                if (!artErr && (results !== undefined && results !== null)) {
                    findPublicAccessLevel(function (publicAccessLevel) {
                        var useArticle = false;
                        if (results.accessLevel.toString() === publicAccessLevel.toString() && results.published) {
                            useArticle = true;
                        } else if (creds !== null && creds.loggedIn && results.published) {
                            useArticle = true;
                        }
                        if (useArticle) {
                            results.hits += 1;
                            results.save();
                            var a = results.toObject();
                            var ArticleText = db.getArticleText();
                            ArticleText.findOne({article: results._id, active: true}, null, function (artTxtErr, articleTextResults) {
                                if (!artTxtErr && (articleTextResults !== undefined && articleTextResults !== null)) {
                                    var binaryText = articleTextResults.text;
                                    //console.log("binary text: " + binaryText);
                                    //console.log("binary text to string: " + binaryText.toString());
                                    a.articleText = articleTextResults.toObject();
                                    a.articleText.text = binaryText.toString();
                                    //console.log("binary converted obj text: " + a.articleText.text);
                                    var FrontPage = db.getFrontPage();
                                    FrontPage.find({article: results._id}, function (fpErr, frontPageResults) {
                                        if (!fpErr && (frontPageResults !== undefined && frontPageResults !== null && frontPageResults.length > 0)) {
                                            a.frontPage = true;
                                        } else {
                                            a.frontPage = false;
                                        }
                                        var ArticleLocation = db.getArticleLocation();
                                        ArticleLocation.find({article: results._id}, function (artLocErr, artLocResults) {
                                            var Comment = db.getComment();
                                            Comment.find({article: results._id}, null, {sort: {_id: 1}}, function (commentErr, commentList) {
                                                if (!artLocErr && (artLocResults !== undefined && artLocResults !== null)) {
                                                    var artLocList = [];
                                                    for (var artLocCnt = 0; artLocCnt < artLocResults.length; artLocCnt++) {
                                                        artLocList.push(artLocResults[artLocCnt].location);
                                                    }
                                                    a.articleLocationList = artLocList;
                                                }
                                                if (!commentErr && commentList !== undefined && commentList !== null) {
                                                    var finalCommentList = [];
                                                    var cMap = [];
                                                    var subCommentList = [];
                                                    for (var c = 0; c < commentList.length; c++) {
                                                        var tempC = commentList[c].toObject();
                                                        tempC.subCommentList = [];
                                                        cMap[tempC._id] = tempC;
                                                    }
                                                    for (var c2 = 0; c2 < commentList.length; c2++) {
                                                        var tempC2 = commentList[c2].toObject();
                                                        if (tempC2.otherComment !== undefined && tempC2.otherComment !== null) {
                                                            cMap[tempC2.otherComment].subCommentList.push(tempC2)
                                                            subCommentList[tempC2._id] = tempC2;
                                                        }
                                                    }
                                                    for (var c3 = 0; c3 < commentList.length; c3++) {
                                                        var tempC3 = commentList[c3].toObject();
                                                        if (subCommentList[tempC3._id] === undefined && tempC3.approved) {
                                                            var tempCommenter = userMap[tempC3.commenter];
                                                            var foundComment = cMap[tempC3._id];
                                                            foundComment.commenter = tempCommenter;
                                                            finalCommentList.push(foundComment);
                                                        }
                                                    }
                                                    a.commentList = finalCommentList;
                                                    console.log("article object with comments: " + JSON.stringify(a));
                                                }
                                                var Tag = db.getTag();
                                                Tag.findOne({article: results._id}, function (tagErr, tagResults) {
                                                    if (!tagErr && (tagResults !== undefined && tagResults !== null)) {
                                                        var tagObj = tagResults.toObject();
                                                        var keyWords = [];
                                                        if (tagObj.keyWords !== undefined && tagObj.keyWords !== null) {
                                                            keyWords = tagObj.keyWords.split(",");
                                                        }
                                                        tagObj.keyWords = keyWords;
                                                        a.tag = tagObj;

                                                    }
                                                    //var User = db.getUser();
                                                    User.findById(results.user, function (userErr, foundUser) {
                                                        if (!userErr && (foundUser !== undefined && foundUser !== null)) {
                                                            a.user = foundUser;
                                                            callback(a);
                                                        } else {
                                                            callback({});
                                                        }

                                                    });
                                                    //console.log("article object: " + JSON.stringify(a));

                                                });

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
            });
        });

    } else {
        callback({});
    }
};


/**
 * 
 * @param id
 *      
 */
exports.getProduct = function (id, callback) {

};


/**
 * 
 * @param json
 *      
 */
exports.getContentList = function (json, creds, browserLan, callback) {
    //console.log("in getContentList----------------------------------------------------------------------------");
    var isOk = manager.securityCheck(json);
    var returnVal = {
        articleLocations: {
            FrontPage: []

        },
        productLocations: {
        },
        links: [],
        dates: []
    };
    if (isOk) {
        var parsedLan = manager.browserLanguageParser(browserLan);
        /*
         var blan = "";
         var browLan = "";
         
         if (browserLan !== undefined && browserLan !== null) {
         browLan = browserLan.replace("_", "-");
         var indexOfComma = browLan.indexOf(",");
         browLan = browLan.substring(0, indexOfComma);
         browLan = browLan.toLowerCase();
         var ind = browLan.indexOf("-");
         blan = browLan.substring(0, ind);
         }
         */
        // get language like blan
        var Language = db.getLanguage();
        var useLan = false;
        var useLanId = null;
        Language.find({}, function (lanErr, lanList) {
            console.log("found languageList: " + JSON.stringify(lanList));
            if (!lanErr && lanList !== undefined && lanList !== null) {
                for (var lanCnt = 0; lanCnt < lanList.length; lanCnt++) {
                    var lanCode = lanList[lanCnt].code;
                    lanCode = lanCode.replace("_", "-");
                    lanCode = lanCode.toLowerCase();
                    console.log("browLan=" + parsedLan.browLan + " lanCode=" + lanCode);
                    if (lanCode === parsedLan.browLan || lanCode === parsedLan.blan) {
                        useLan = true;
                        useLanId = lanList[lanCnt]._id;
                        break;
                    }
                }
            }
            findPublicAccessLevel(function (publicAccessLevel) {
                findLocations(function (locationList) {
                    console.log("locationList: " + JSON.stringify(locationList));
                    for (var cntLoc = 0; cntLoc < locationList.length; cntLoc++) {
                        var locName = locationList[cntLoc].name;
                        returnVal.articleLocations[locName] = [];
                        returnVal.productLocations[locName] = [];
                    }
                    console.log("returnVal: " + JSON.stringify(returnVal) + "------------------------------------------------");
                    if (json.frontPage) {
                        console.log("before dofrontpage---------------------------------------------------");
                        //var doneWithFrontPage = false;
                        doFrontPage(function (frontPageList) {
                            //console.log("doneWithFrontPage: " + doneWithFrontPage + "---------------------------------------------------");
                            //if (!doneWithFrontPage) {
                            //doneWithFrontPage = true;
                            // }
                            //console.log("in dofrontpage---------------------------------------------------");
                            //console.log("frontPageArticleList: " + JSON.stringify(frontPageList));
                            var fpList = [];
                            for (var fpCnt = 0; fpCnt < frontPageList.length; fpCnt++) {
                                var fp = frontPageList[fpCnt];
                                //console.log("frontPage Object: " + fp);
                                //console.log("public access: " + publicAccessLevel);
                                console.log("public access found : " + (fp.accessLevel.toString() === publicAccessLevel.toString()));
                                if (fp.accessLevel.toString() === publicAccessLevel.toString() && fp.published) {
                                    if (useLan) {
                                        if (useLanId.toString() === fp.language.toString()) {
                                            fpList.push(fp);
                                        }
                                    } else {
                                        fpList.push(fp);
                                    }

                                } else {
                                    if (creds !== null && creds.loggedIn && fp.published) {
                                        if (useLan) {
                                            if (useLanId.toString() === fp.language.toString()) {
                                                fpList.push(fp);
                                            }
                                        } else {
                                            fpList.push(fp);
                                        }
                                    }
                                }
                            }
                            returnVal.articleLocations.FrontPage = fpList;
                            if (json.articles) {
                                doArticles(json.searchFilter, json.searchDateFilter, returnVal, locationList, useLan, useLanId, publicAccessLevel, creds, function () {
                                    //do products
                                    if (json.products) {
                                        doProducts(json.searchFilter, returnVal, locationList, useLan, useLanId, function () {
                                            //do links
                                            if (json.links) {
                                                doLinks(returnVal, useLan, useLanId, function () {
                                                    //callback(returnVal);
                                                    doDates(returnVal, useLan, useLanId, function () {
                                                        callback(returnVal);
                                                    });
                                                });
                                            } else {
                                                callback(returnVal);
                                            }
                                        });
                                    } else {
                                        //do links
                                        if (json.links) {
                                            doLinks(returnVal, useLan, useLanId, function () {
                                                //callback(returnVal);
                                                doDates(returnVal, useLan, useLanId, function () {
                                                    callback(returnVal);
                                                });
                                            });
                                        } else {
                                            callback(returnVal);
                                        }
                                    }
                                });
                            } else {
                                //do products
                                if (json.products) {
                                    doProducts(json.searchFilter, returnVal, locationList, useLan, useLanId, function () {
                                        //do links
                                        if (json.links) {
                                            doLinks(returnVal, useLan, useLanId, function () {
                                                //callback(returnVal);
                                                doDates(returnVal, useLan, useLanId, function () {
                                                    callback(returnVal);
                                                });
                                            });
                                        } else {
                                            callback(returnVal);
                                        }
                                    });
                                } else {
                                    //do links
                                    if (json.links) {
                                        doLinks(returnVal, useLan, useLanId, function () {
                                            //callback(returnVal);
                                            doDates(returnVal, useLan, useLanId, function () {
                                                callback(returnVal);
                                            });
                                        });
                                    } else {
                                        callback(returnVal);
                                    }
                                }
                            }
                            //tempTesting

                        });
                    } else {
                        if (json.articles) {
                            doArticles(json.searchFilter, json.searchDateFilter, returnVal, locationList, useLan, useLanId, publicAccessLevel, creds, function () {
                                //do products
                                if (json.products) {
                                    doProducts(json.searchFilter, returnVal, locationList, useLan, useLanId, function () {
                                        //do links
                                        if (json.links) {
                                            doLinks(returnVal, useLan, useLanId, function () {
                                                //callback(returnVal);
                                                doDates(returnVal, useLan, useLanId, function () {
                                                    callback(returnVal);
                                                });
                                            });
                                        } else {
                                            callback(returnVal);
                                        }
                                    });
                                } else {
                                    //do links
                                    if (json.links) {
                                        doLinks(returnVal, useLan, useLanId, function () {
                                            //callback(returnVal);
                                            doDates(returnVal, useLan, useLanId, function () {
                                                callback(returnVal);
                                            });
                                        });
                                    } else {
                                        callback(returnVal);
                                    }
                                }

                            });
                        } else {
                            //do products
                            if (json.products) {
                                doProducts(json.searchFilter, returnVal, locationList, useLan, useLanId, function () {
                                    //do links
                                    if (json.links) {
                                        doLinks(returnVal, useLan, useLanId, function () {
                                            //callback(returnVal);
                                            doDates(returnVal, useLan, useLanId, function () {
                                                callback(returnVal);
                                            });
                                        });
                                    } else {
                                        callback(returnVal);
                                    }
                                });
                            } else {
                                //do links
                                if (json.links) {
                                    doLinks(returnVal, useLan, useLanId, function () {
                                        //callback(returnVal);
                                        doDates(returnVal, useLan, useLanId, function () {
                                            callback(returnVal);
                                        });
                                    });
                                } else {
                                    callback(returnVal);
                                }
                            }

                        }
                    }
                });

            });

        });

    } else {
        callback(returnVal);
    }
};


doFrontPage = function (callback) {
    var returnVal = [];
    var FrontPage = db.getFrontPage();
    FrontPage.find({}, null, function (fpErr, fpResults) {
        console.log("frontPageList: " + JSON.stringify(fpResults));
        if (!fpErr && fpResults !== undefined && fpResults !== null) {
            var Article = db.getArticle();
            Article.find({}, null, {sort: {createdDate: -1}}, function (artErr, articleList) {
                console.log("articleList----------------------: " + JSON.stringify(articleList));
                if (!artErr && articleList !== undefined && articleList !== null) {
                    var processedArticleList = [];
                    for (var aCnt = 0; aCnt < articleList.length; aCnt++) {
                        //console.log(" in first for loop" + aCnt + "-------------------------");
                        //console.log("frontpageCount: " + fpResults.length);
                        for (var fpCnt = 0; fpCnt < fpResults.length; fpCnt++) {
                            console.log(" in second for loop" + fpCnt + "-------------------------");
                            var a = articleList[aCnt].toObject();
                            //console.log("article: " + a);
                            //console.log("frontPage.article: " + fpResults[fpCnt].article);
                            //console.log("frontPage & article ===: " + (fpResults[fpCnt].article.toString() === a._id.toString()));
                            if (fpResults[fpCnt].article.toString() === a._id.toString()) {
                                processedArticleList.push(a);
                                break;
                            }
                        }
                    }
                    console.log("processed article:----------------- " + processedArticleList);
                    var paLen = 0;
                    if (processedArticleList.length === 0) {
                        callback(returnVal);
                    } else {
                        for (var paCnt = 0; paCnt < processedArticleList.length; paCnt++) {
                            var pa = processedArticleList[paCnt];
                            processArticle(pa, true, function (aComplete) {
                                console.log("article in process article callback: " + aComplete);
                                returnVal.push(aComplete);
                                paLen++;
                                if (paLen === processedArticleList.length) {
                                    console.log("frontpage articleList returned from service: " + JSON.stringify(returnVal));
                                    callback(returnVal);
                                }
                            });
                        }
                    }

                } else {
                    callback(returnVal);
                }
            });
        } else {
            callback(returnVal);
        }

    });
};

doArticles = function (searchFilter, searchDateFilter, returnVal, locationList, useLan, useLanId, publicAccessLevel, creds, callback) {
    console.log("in do article--------------------------------------------------------------------------");
    console.log("locationList: " + JSON.stringify(locationList));
    var ArticleLocation = db.getArticleLocation();
    ArticleLocation.find({}, function (artLocErr, artLocResults) {
        console.log("found articleLocation list: " + JSON.stringify(artLocResults));
        if (!artLocErr && (artLocResults !== undefined && artLocResults !== null)) {
            var searchList = [];
            var Category = db.getCategory();
            Category.find({}, function (catErr, catList) {
                console.log("found category list: " + JSON.stringify(catList));
                var useCat = false;
                var useSec = false;
                if (!catErr && catList !== undefined && catList !== null) {
                    useCat = true;
                }
                var Section = db.getSection();
                Section.find({}, function (secErr, secList) {
                    console.log("found section list: " + JSON.stringify(secList));
                    if (!secErr && secList !== undefined && secList !== null) {
                        useSec = true;
                    }
                    if (searchFilter !== undefined && searchFilter !== null && searchFilter.length > 0) {
                        for (var valCnt = 0; valCnt < searchFilter.length; valCnt++) {
                            var cName = searchFilter[valCnt].categoryName;
                            var sName = searchFilter[valCnt].sectionName;
                            var searchVal = {
                                catId: "0",
                                secId: "0"
                            };
                            if (useCat) {
                                for (var c = 0; c < catList.length; c++) {
                                    if (catList[c].name.toString() === cName) {
                                        searchVal.catId = catList[c]._id.toString();
                                        break;
                                    }
                                }
                            }
                            if (useSec) {
                                for (var s = 0; s < secList.length; s++) {
                                    if (secList[s].name.toString() === sName) {
                                        searchVal.secId = secList[s]._id.toString();
                                        break;
                                    }
                                }
                            }
                            searchList.push(searchVal);
                        }
                        console.log("searchList: " + JSON.stringify(searchList));
                        var filteredArticleList = [];
                        var Article = db.getArticle();
                        Article.find({published: true}, null, {sort: {createdDate: -1}}, function (artErr, articleList) {
                            console.log("articleList: " + JSON.stringify(articleList));
                            if (!artErr && articleList !== undefined && articleList !== null) {
                                for (var aCnt = 0; aCnt < articleList.length; aCnt++) {
                                    var a = articleList[aCnt].toObject();
                                    for (var slCnt = 0; slCnt < searchList.length; slCnt++) {
                                        var useCatSearch = false;
                                        var useSecSearch = false;
                                        var addArt = false;
                                        if (a.category.toString() === searchList[slCnt].catId.toString()) {
                                            useCatSearch = true;
                                        }
                                        if (a.section.toString() === searchList[slCnt].secId.toString()) {
                                            useSecSearch = true;
                                        }
                                        if (useCatSearch) {
                                            if (useSecSearch || searchList[slCnt].secId.toString() === "0") {
                                                addArt = true;
                                            }
                                        } else if (useSecSearch && searchList[slCnt].catId.toString() === "0") {
                                            addArt = true;
                                        }
                                        if (addArt) {
                                            if (searchDateFilter !== undefined && searchDateFilter !== null) {
                                                var ad = a.createdDate;
                                                var month = ad.getMonth();
                                                var year = ad.getFullYear();
                                                if (searchDateFilter.month === month && searchDateFilter.year === year) {
                                                    filteredArticleList.push(a);
                                                }
                                            } else {
                                                filteredArticleList.push(a);
                                            }

                                        }

                                    }
                                }
                                ///////////////
                                console.log("filteredArticleList: " + JSON.stringify(filteredArticleList));
                                var locationArticleList = [];
                                var sortableLocationList = [];
                                for (var faCnt = 0; faCnt < filteredArticleList.length; faCnt++) {
                                    var fa = filteredArticleList[faCnt];
                                    fa.position = [];
                                    //var breakArtLocLoop = false;
                                    for (var alCnt = 0; alCnt < artLocResults.length; alCnt++) {
                                        if (fa._id.toString() === artLocResults[alCnt].article.toString()) {
                                            for (var lCnt = 0; lCnt < locationList.length; lCnt++) {
                                                if (locationList[lCnt]._id.toString() === artLocResults[alCnt].location.toString()) {
                                                    console.log("article for location: " + JSON.stringify(fa));
                                                    console.log("article location: " + locationList[lCnt].name);
                                                    if (fa.accessLevel.toString() === publicAccessLevel.toString()) {
                                                        if (useLan) {
                                                            if (useLanId.toString() === fa.language.toString()) {
                                                                fa.position.push(locationList[lCnt].name);
                                                                if (sortableLocationList.indexOf(locationList[lCnt].name) < 0) {
                                                                    sortableLocationList.push(locationList[lCnt].name);
                                                                }
                                                                locationArticleList.push(fa);
                                                                //returnVal.articleLocations[locationList[lCnt].name].push(fa);
                                                            }
                                                        } else {
                                                            fa.position.push(locationList[lCnt].name);
                                                            if (sortableLocationList.indexOf(locationList[lCnt].name) < 0) {
                                                                sortableLocationList.push(locationList[lCnt].name);
                                                            }
                                                            locationArticleList.push(fa);
                                                            //returnVal.articleLocations[locationList[lCnt].name].push(fa);
                                                        }
                                                    } else if (creds !== null && creds.loggedIn) {
                                                        if (useLan) {
                                                            if (useLanId.toString() === fa.language.toString()) {
                                                                fa.position.push(locationList[lCnt].name);
                                                                if (sortableLocationList.indexOf(locationList[lCnt].name) < 0) {
                                                                    sortableLocationList.push(locationList[lCnt].name);
                                                                }
                                                                locationArticleList.push(fa);
                                                                //returnVal.articleLocations[locationList[lCnt].name].push(fa);
                                                            }
                                                        } else {
                                                            fa.position.push(locationList[lCnt].name);
                                                            if (sortableLocationList.indexOf(locationList[lCnt].name) < 0) {
                                                                sortableLocationList.push(locationList[lCnt].name);
                                                            }
                                                            locationArticleList.push(fa);
                                                            // returnVal.articleLocations[locationList[lCnt].name].push(fa);
                                                        }
                                                    }
                                                    //breakArtLocLoop = true;
                                                    break;
                                                }
                                            }
                                        }
                                        //if(breakArtLocLoop){
                                        // break;
                                        //}
                                    }
                                }
                                console.log("sortableLocationList: " + JSON.stringify(sortableLocationList));
                                var fcnt = 0;
                                var mapArray = [];
                                console.log("locationArticleList: " + JSON.stringify(locationArticleList));
                                if (locationArticleList.length === 0) {
                                    callback();
                                } else {
                                    for (var locACnt = 0; locACnt < locationArticleList.length; locACnt++) {
                                        var al1 = locationArticleList[locACnt];
                                        processArticle(al1, false, function (aComplete) {
                                            //if to check for existing article at position  
                                            for (var pcnt = 0; pcnt < aComplete.position.length; pcnt++) {
                                                if (mapArray.indexOf(aComplete.position[pcnt] + aComplete._id) < 0) {
                                                    returnVal.articleLocations[aComplete.position[pcnt]].push(aComplete);
                                                    mapArray.push(aComplete.position[pcnt] + aComplete._id);
                                                }
                                                fcnt++;
                                                if (fcnt === locationArticleList.length) {
                                                    callback();
                                                }
                                            }

                                        });
                                    }
                                }

                            } else {
                                callback();
                            }
                        });

                    } else {
                        callback();
                    }
                });

            });
        } else {
            callback();
        }
    });
};


doProducts = function (searchFilter, returnVal, locationList, useLan, useLanId, callback) {
    var ProductLocation = db.getProductLocation();
    ProductLocation.find({}, function (prodLocErr, prodLocResults) {
        console.log("found productLocation list: " + JSON.stringify(prodLocResults));
        if (!prodLocErr && (prodLocResults !== undefined && prodLocResults !== null)) {
            var searchList = [];
            var Category = db.getCategory();
            Category.find({}, function (catErr, catList) {
                console.log("found category list: " + JSON.stringify(catList));
                var useCat = false;
                var useSec = false;
                if (!catErr && catList !== undefined && catList !== null) {
                    useCat = true;
                }
                var Section = db.getSection();
                Section.find({}, function (secErr, secList) {
                    console.log("found section list: " + JSON.stringify(secList));
                    if (!secErr && secList !== undefined && secList !== null) {
                        useSec = true;
                    }
                    if (searchFilter !== undefined && searchFilter !== null && searchFilter.length > 0) {
                        for (var valCnt = 0; valCnt < searchFilter.length; valCnt++) {
                            var cName = searchFilter[valCnt].categoryName;
                            var sName = searchFilter[valCnt].sectionName;
                            var searchVal = {
                                catId: "0",
                                secId: "0"
                            };
                            if (useCat) {
                                for (var c = 0; c < catList.length; c++) {
                                    if (catList[c].name.toString() === cName) {
                                        searchVal.catId = catList[c]._id.toString();
                                        break;
                                    }
                                }
                            }
                            if (useSec) {
                                for (var s = 0; s < secList.length; s++) {
                                    if (secList[s].name.toString() === sName) {
                                        searchVal.secId = secList[s]._id.toString();
                                        break;
                                    }
                                }
                            }
                            searchList.push(searchVal);
                        }
                        console.log("searchList: " + JSON.stringify(searchList));
                        // got search id now and continue on
                        //returnVal.articleLocations[locName] = [];
                        var Product = db.getProduct();
                        Product.find({published: true}, null, {sort: {title: 1}}, function (prodErr, productList) {
                            console.log("productList: " + JSON.stringify(productList));
                            if (!prodErr && productList !== undefined && productList !== null) {
                                for (var pCnt = 0; pCnt < productList.length; pCnt++) {
                                    var p = productList[pCnt];
                                    for (var slCnt = 0; slCnt < searchList.length; slCnt++) {
                                        var useCatSearch = false;
                                        var useSecSearch = false;
                                        var addProd = false;
                                        if (p.category.toString() === searchList[slCnt].catId.toString()) {
                                            useCatSearch = true;
                                        }
                                        if (p.section.toString() === searchList[slCnt].secId.toString()) {
                                            useSecSearch = true;
                                        }
                                        if (useCatSearch) {
                                            if (useSecSearch || searchList[slCnt].secId.toString() === "0") {
                                                addProd = true;
                                            }
                                        } else if (useSecSearch && searchList[slCnt].catId.toString() === "0") {
                                            addProd = true;
                                        }
                                        if (addProd) {
                                            //for (var lCnt = 0; lCnt < locationList.length; lCnt++) {
                                            for (var plCnt = 0; plCnt < prodLocResults.length; plCnt++) {
                                                if (p._id.toString() === prodLocResults[plCnt].product.toString()) {
                                                    for (var lCnt = 0; lCnt < locationList.length; lCnt++) {
                                                        if (locationList[lCnt]._id.toString() === prodLocResults[plCnt].location.toString()) {
                                                            console.log("product: " + JSON.stringify(p));
                                                            if (useLan) {
                                                                if (useLanId.toString() === p.language.toString()) {
                                                                    returnVal.productLocations[locationList[lCnt].name].push(p);
                                                                }
                                                            } else {
                                                                returnVal.productLocations[locationList[lCnt].name].push(p);
                                                            }
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                            //}

                                        }
                                    }
                                }
                                callback();
                            } else {
                                callback();
                            }
                        });
                    } else {
                        callback();
                    }
                });

            });
        } else {
            callback();
        }
    });
};

doLinks = function (returnVal, useLan, useLanId, callback) {
    var Link = db.getLink();
    Link.find({}, function (linkErr, linkList) {
        if (!linkErr && linkList !== undefined && linkList !== null) {
            for (var linkCnt = 0; linkCnt < linkList.length; linkCnt++) {
                var l = linkList[linkCnt];
                if (useLan) {
                    if (useLanId.toString() === l.language.toString()) {
                        returnVal.links.push(l);
                    }
                } else {
                    returnVal.links.push(l);
                }
            }
            callback();
        } else {
            callback();
        }
    });
};

doDates = function (returnVal, useLan, useLanId, callback) {
    var Article = db.getArticle();
    var q = {
        published: true
    };
    if (useLan) {
        q.language = useLanId;
    }
    var filterMap = [];

    Article.find(q, null, {sort: {createdDate: -1}}, function (artErr, articleList) {
        console.log("articles: " + JSON.stringify(articleList));
        if (!artErr && articleList !== undefined && articleList !== null) {
            for (var aCnt = 0; aCnt < articleList.length; aCnt++) {
                var d = articleList[aCnt].createdDate;
                var month = d.getMonth()
                var year = d.getFullYear();
                var key = month + year;
                var c = filterMap[key];
                if (c === undefined) {
                    var mObj = {
                        dateLabel: manager.MONTH_NAMES[month] + " " + year,
                        month: month,
                        year: year
                    }
                    returnVal.dates.push(mObj);
                    filterMap[key] = true;
                }
            }
            callback();
        } else {
            callback();
        }
    });
};


findPublicAccessLevel = function (callback) {
    var AccessLevel = db.getAccessLevel();
    AccessLevel.find({}, function (err, results) {
        console.log("accessLevelList: " + results);
        var publicId = "-1";
        if (!err && results !== undefined && results !== null) {
            for (var cnt = 0; cnt < results.length; cnt++) {
                if (manager.ACCESS_LEVEL_PUBLIC === results[cnt].name) {
                    publicId = results[cnt]._id;
                    break;
                }
            }
            callback(publicId);
        } else {
            callback(publicId);
        }
    });
};


findLocations = function (callback) {
    var Location = db.getLocation();
    Location.find({}, function (err, results) {
        if (!err && results !== undefined && results !== null) {
            callback(results);
        } else {
            callback([]);
        }
    });
};

processArticle = function (art, frontPage, callback) {
    var a = art;
    var pageBreak = "<!-- pagebreak -->";
    var pEnd = "</p>";
    var dEnd = "</div>";
    if (a !== undefined && a !== null) {
        var ArticleText = db.getArticleText();
        ArticleText.findOne({article: a._id, active: true}, null, function (artTxtErr, articleTextResults) {
            if (!artTxtErr && (articleTextResults !== undefined && articleTextResults !== null)) {
                var binaryText = articleTextResults.text;
                //console.log("binary text: " + binaryText);
                //console.log("binary text to string: " + binaryText.toString());
                var tempTxt = atob(binaryText.toString());
                console.log("article text before processing: " + tempTxt);
                var pbIndex = tempTxt.indexOf(pageBreak);
                console.log("index of page break: " + pbIndex);
                if (pbIndex > 0) {
                    tempTxt = tempTxt.substring(0, pbIndex);
                    a.fullPage = false;
                } else {
                    a.fullPage = true;
                }
                /*
                 if (!a.fullPage) {
                 var indexOfPEnd = tempTxt.indexOf(pEnd);
                 var indexOfDEnd = tempTxt.indexOf(dEnd);
                 if (indexOfPEnd > indexOfDEnd) {
                 indexOfPEnd += 4;
                 tempTxt = tempTxt.substring(0, indexOfPEnd);
                 } else if (indexOfDEnd > indexOfPEnd) {
                 indexOfDEnd += 6;
                 tempTxt = tempTxt.substring(0, indexOfDEnd);
                 }
                 }*/

                //console.log("article text: " + binaryText);
                console.log("article text: " + tempTxt);
                a.articleText = articleTextResults.toObject();
                //a.articleText.text = binaryText.toString();
                a.articleText.text = btoa(tempTxt);
                //console.log("binary converted obj text: " + a.articleText.text);
                // var FrontPage = db.getFrontPage();
                // FrontPage.find({article: results._id}, function (fpErr, frontPageResults) {
                //if (!fpErr && (frontPageResults !== undefined && frontPageResults !== null && frontPageResults.length > 0)) {
                a.frontPage = frontPage;
                //} else {
                //   a.frontPage = false;
                //}
                var ArticleLocation = db.getArticleLocation();
                ArticleLocation.find({article: a._id}, function (artLocErr, artLocResults) {
                    if (!artLocErr && (artLocResults !== undefined && artLocResults !== null)) {
                        var artLocList = [];
                        for (var artLocCnt = 0; artLocCnt < artLocResults.length; artLocCnt++) {
                            artLocList.push(artLocResults[artLocCnt].location);
                        }
                        a.articleLocationList = artLocList;
                    }
                    var Tag = db.getTag();
                    Tag.findOne({article: a._id}, function (tagErr, tagResults) {
                        if (!tagErr && (tagResults !== undefined && tagResults !== null)) {
                            a.tag = tagResults;
                        }
                        var User = db.getUser();
                        User.findById(a.user, function (userErr, foundUser) {
                            var u = {
                                _id: null,
                                firstName: null,
                                lastName: null,
                                emailAddress: null
                            };
                            if (!userErr && (foundUser !== undefined && foundUser !== null)) {
                                u._id = foundUser._id;
                                u.firstName = foundUser.firstName;
                                u.lastName = foundUser.lastName;
                                u.emailAddress = foundUser.emailAddress;
                                a.user = u;
                                //callback(a);
                                var Section = db.getSection();
                                Section.findById(a.section, function (err, section) {
                                    console.log("found section: " + JSON.stringify(section));
                                    if (!err && (section !== undefined && section !== null)) {
                                        a.section = section;
                                        var Category = db.getCategory();
                                        Category.findById(a.category, function (err, category) {
                                            console.log("found category: " + JSON.stringify(category));
                                            if (!err && (category !== undefined && category !== null)) {
                                                a.category = category;
                                                console.log("article passed back: " + JSON.stringify(a));
                                                callback(a);
                                            } else {
                                                callback({});
                                            }
                                        });
                                        //callback(a);
                                    } else {
                                        callback({});
                                    }
                                });
                            } else {
                                callback({});
                            }

                        });
                        //console.log("article object: " + JSON.stringify(a));

                    });

                });

                //});

            } else {
                callback({});
            }
        });
    } else {
        callback({});
    }

};
