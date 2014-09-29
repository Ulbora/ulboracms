//adminManager

var db = require('../db/db');
var manager = require('../managers/manager');


/**
 * 
 */
exports.summary = function (callback) {
    var returnVal = {
        articleList: null,
        frontPageList: null,
        categoryList: null,
        sectionList: null
    };


    var Article = db.getArticle();
    Article.find({}, null, {sort: {title: 1}}, function (artErr, articleList) {
        console.log("found article list: " + JSON.stringify(articleList));
        if (!artErr && articleList !== undefined && articleList !== null) {
            returnVal.articleList = articleList;
        } else {
            returnVal.articleList = [];
        }

        var FrontPage = db.getFrontPage();
        FrontPage.find({}, function (fpErr, frontPageResults) {
            console.log("found front page list: " + JSON.stringify(frontPageResults));
            var fpList = [];
            if (!fpErr && frontPageResults !== undefined && frontPageResults !== null) {
                for (var cntArt = 0; cntArt < articleList.length; cntArt++) {
                    for (var fpCnt = 0; fpCnt < frontPageResults.length; fpCnt++) {
                        if (frontPageResults[fpCnt].article.toString() === articleList[cntArt]._id.toString()) {
                            fpList.push(articleList[cntArt]);

                        }
                    }
                }
            }
            returnVal.frontPageList = fpList;

            var Category = db.getCategory();
            Category.find({}, null, {sort: {name: 1}}, function (catErr, catList) {
                console.log("found category list: " + JSON.stringify(catList));
                if (!catErr && catList !== undefined && catList !== null) {
                    returnVal.categoryList = catList;
                } else {
                    returnVal.categoryList = [];
                }

                var Section = db.getSection();
                Section.find({}, null, {sort: {name: 1}}, function (secErr, secList) {
                    console.log("found section list: " + JSON.stringify(secList));
                    if (!secErr && secList !== undefined && secList !== null) {
                        returnVal.sectionList = secList;
                    } else {
                        returnVal.sectionList = [];
                    }
                    callback(returnVal);
                });
            });
        });
        
    });
};



