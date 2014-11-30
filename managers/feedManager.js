//feedManager

var db = require('../db/db');
var manager = require('../managers/manager');
var RSS = require('rss');
var feed = null;

exports.rssFeed = function (cache, callback) {
    var Configuration = db.getConfiguration();
    var feedObj = {
        title: "Ulbora CMS",
        description: "MEAN Stack CMS and Blog",
        feed_url: "http://www.ulboracms.org/feed",
        site_url: "http://www.ulboracms.org"
    };
    if (!cache && feed !== null) {
        callback(feed.xml());
    } else {
        var Language = db.getLanguage();
        Language.findOne({defaultLanguage: true}, function (lanErr, lan) {
            console.log("found language set to default: " + JSON.stringify(lan));
            if (!lanErr && lan !== undefined && lan !== null) {
                Configuration.findOne({language: lan._id}, function (confErr, conf) {
                    console.log("found Configuration: " + JSON.stringify(conf));
                    if (!confErr && conf !== undefined && conf !== null) {
                        feedObj.title = conf.siteName;
                        feedObj.description = conf.siteDesc;
                        feedObj.feed_url = conf.domainName + "/rss";
                        feedObj.site_url = conf.domainName;
                        feed = new RSS(feedObj);
                        loadArticles(conf.domainName, function (itemList) {
                            for (var cnt = 0; cnt < itemList.length; cnt++) {
                                feed.item(itemList[cnt]);
                            }
                            callback(feed.xml());
                        });
                    } else {
                        feed = new RSS(feedObj);
                        callback(feed.xml());
                    }

                });
            } else {
                callback("");
            }
        });
    }
};

loadArticles = function (domain, callback) {
    var itemList = [];
    if (domain !== undefined && domain !== null) {
        var Article = db.getArticle();
        Article.find({published: true}, null, {sort: {title: 1}}, function (artErr, results) {
            console.log("found article list: " + JSON.stringify(results));
            if (artErr || results === undefined || results === null || results.length === 0) {
                callback(itemList);
            } else {
                for (var cnt = 0; cnt < results.length; cnt++) {
                    var tempItem = results[cnt];
                    var item = {
                        title: tempItem.title,
                        description: tempItem.title,
                        url: domain + "/rs/content/article/" + tempItem._id, // link to the item                       
                        date: tempItem.createdDate // any format that js Date can parse.
                    };
                    itemList.push(item);
                }
                callback(itemList);
            }
        });
    } else {
        callback(itemList);
    }
};