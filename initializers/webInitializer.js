//initialize web interface
var db = require('../db/db');
var fs = require('fs');
var refreshRssCache = false;
var cashedPages = [];
var contentController = require('../controllers/contentController');
var webtpl = require('../utils/webtpl');
var angular = require('./angularJsInitializer');
var fileInit = require('./fileInitializer');
exports.initialize = function (__dirname, self, refreshCache) {
    self.app.get('/', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            var requestedPage = req.originalUrl;
            var loggedIn = (req.session.loggedIn);
            console.log("requested page: " + requestedPage);
            if (template.angularTemplate) {
                res.sendFile(__dirname + "/public/templates/" + template.name + "/index.html");
            } else {
                //__dirname + 
                //console.log("cachedPages: " + JSON.stringify(cashedPages["index"]));
                if (!refreshCache && cashedPages["index"] !== undefined && cashedPages["index"] !== null) {
                    res.render("public/templates/" + template.name + "/index", {content: cashedPages["index"], loggedIn: loggedIn});
                } else {
                    if (refreshCache) {
                        cashedPages = [];
                    }
                    console.log("cachedPages: " + JSON.stringify(cashedPages["index"]));
                    refreshCache = false;
                    fs.readFile(__dirname + "/public/templates/" + template.name + "/json/index.json", function (err, data) {
                        if (!err) {
                            var filter = JSON.parse(data);
                            console.log("filter data: " + JSON.stringify(filter));
                            console.log("filter data frontpage: " + filter.frontPage);
                            contentController.getContentList(req, filter, loggedIn, function (results) {
                                cashedPages["index"] = results;
                                console.log("content results: " + JSON.stringify(results));
                                res.render("public/templates/" + template.name + "/index", {content: results, loggedIn: loggedIn});
                            });
                        } else {
                            res.render("public/templates/" + template.name + "/index", {});
                        }

                    });
                }
            }
        });
    });

    angular.partials(self);

    self.app.get('/*.html', function (req, res) {
        console.log("in html");
        webtpl.getDefaultTemplate(function (template) {
            if (!template.angularTemplate) {
                var loggedIn = (req.session.loggedIn);
                var requestedPage = req.originalUrl;
                var indexOfPeriod = requestedPage.indexOf(".");
                var filerName = requestedPage.substring(0, indexOfPeriod);
                filerName = filerName.replace("/", "");
                if (requestedPage.length > indexOfPeriod + 5) {
                    requestedPage = requestedPage.substring(0, indexOfPeriod + 5);
                }
                console.log("filter name: " + filerName);

                var revisedPage = requestedPage.replace("html", "ejs");
                //var revisedPage = requestedPage.replace("html", "hbs");
                if (!refreshCache && cashedPages[filerName] !== undefined && cashedPages[filerName] !== null && filerName !== "archive") {
                    res.render("public/templates/" + template.name + revisedPage, {content: cashedPages[filerName], loggedIn: loggedIn});
                } else {
                    if (refreshCache) {
                        cashedPages = [];
                    }
                    refreshCache = false;
                    fs.readFile(__dirname + "/public/templates/" + template.name + "/json/" + filerName + ".json", function (err, data) {
                        if (!err) {
                            var filter = JSON.parse(data);
                            console.log("filter data: " + JSON.stringify(filter));
                            console.log("filter data frontpage: " + filter.frontPage);
                            contentController.getContentList(req, filter, loggedIn, function (results) {
                                if (filerName !== "archive") {
                                    cashedPages[filerName] = results;
                                }
                                //console.log("cachedPages: " + cashedPages);
                                console.log("content results: " + JSON.stringify(results));
                                res.render("public/templates/" + template.name + revisedPage, {content: results, loggedIn: loggedIn});
                            });
                        } else {
                            try {
                                console.log("requested page: " + requestedPage);
                                res.render("public/templates/" + template.name + revisedPage, {content: []}, function (err, html) {
                                    if (err) {
                                        errorHander(req, res);
                                    }
                                });
                            } catch (e) {
                                console.log("page error: " + e);
                                errorHander(req, res);
                            }
                        }
                    });
                }
            } else {
                res.redirect('/templates/' + template.name + req.originalUrl);
            }
        });
    });


    self.app.get('/article', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            if (!template.angularTemplate) {
                var loggedIn = (req.session.loggedIn);
                var requestedPage = req.originalUrl;
                var indexOfQuestion = requestedPage.indexOf("?");
                requestedPage = requestedPage.substring(0, indexOfQuestion);
                var revisedPage = requestedPage.replace("html", "ejs");
                contentController.getArticle(req, loggedIn, function (results) {
                    console.log("content results: " + JSON.stringify(results));
                    fs.readFile(__dirname + "/public/templates/" + template.name + "/json/article.json", function (err, data) {
                        if (!err) {
                            var filter = JSON.parse(data);
                            contentController.getContentList(req, filter, loggedIn, function (articleList) {
                                console.log("content results: " + JSON.stringify(articleList));
                                if (results._id !== undefined && results._id !== null) {
                                    res.render("public/templates/" + template.name + revisedPage, {article: results, loggedIn: loggedIn, content: articleList});
                                } else {
                                    errorHander(req, res);
                                }
                            });
                        } else {
                            console.log(err);
                            res.render("public/templates/" + template.name + revisedPage, {article: results, loggedIn: loggedIn, content: []});
                        }
                    });
                });
            } else {
                res.redirect('templates/' + template.name + req.originalUrl);
            }
        });
    });

    self.app.post('/login', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            if (!template.angularTemplate) {
                contentController.login(req, function (results) {
                    console.log("login results: " + results);
                    if (results.loggedIn) {
                        if (req.cookies !== undefined && req.cookies.rememberme) {
                            res.cookie('rememberme', true, {expires: new Date(Date.now() + 900000), httpOnly: true});
                        }
                        req.session.loggedIn = true;
                        req.session.userId = results.id;
                        res.redirect("/");
                        //res.render("public/templates/" + template.name + revisedPage, {content: results});
                    } else {
                        res.render("public/templates/" + template.name + "/login.ejs", {loginFailed: true, message: "Login failed", content: []});
                    }
                });
            } else {
                res.redirect('templates/' + template.name + req.originalUrl);
            }
        });
    });

    self.app.get('/login', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            if (!template.angularTemplate) {
                var loggedIn = (req.session.loggedIn);
                // contentController.login(req, function (results) {
                //console.log("content results: " + JSON.stringify(results));
                var u = "";
                var p = "";
                if (req.cookies.rememberme) {
                    u = req.cookies.username;
                    p = req.cookies.password;
                }
                fs.readFile(__dirname + "/public/templates/" + template.name + "/json/login.json", function (err, data) {
                    if (!err) {
                        var filter = JSON.parse(data);
                        contentController.getContentList(req, filter, loggedIn, function (articleList) {
                            console.log("content results: " + JSON.stringify(articleList));
                            res.render("public/templates/" + template.name + "/login.ejs", {username: u, password: p, loginFailed: false, loggedIn: loggedIn, content: articleList});
                        });
                    } else {
                        console.log(err);
                        res.render("public/templates/" + template.name + "/login.ejs", {username: u, password: p, loginFailed: false, loggedIn: loggedIn, content: []});
                    }
                });
                //res.render("public/templates/" + template.name + "/login.ejs", {username: u, password: p, loginFailed: false, loggedIn: loggedIn});
                //res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });

                //});
            } else {
                res.redirect('templates/' + template.name + req.originalUrl);
            }
        });
    });

    self.app.post('/register', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            if (!template.angularTemplate) {
                contentController.register(req, function (results) {
                    console.log("register results: " + JSON.stringify(results));
                    var page;
                    if (results.success) {
                        page = "/registrationSuccess.ejs";
                    } else {
                        page = "/registrationFailed.ejs";
                    }
                    res.render("public/templates/" + template.name + page);
                });
            } else {
                res.redirect('templates/' + template.name + req.originalUrl);
            }
        });
    });


    self.app.get('/register', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            if (!template.angularTemplate) {
                contentController.getMicbuttionChallenge(req, function (results) {
                    var question = "";
                    var key = "";
                    try {
                        if (results !== {}) {
                            var chal = JSON.parse(results);
                            question = chal.question;
                            key = chal.key;
                        }
                    } catch (err) {
                        console.log(err);
                    }
                    fs.readFile(__dirname + "/public/templates/" + template.name + "/json/register.json", function (err, data) {
                        if (!err) {
                            var filter = JSON.parse(data);
                            var loggedIn = false;
                            contentController.getContentList(req, filter, loggedIn, function (articleList) {
                                console.log("content results: " + JSON.stringify(articleList));
                                res.render("public/templates/" + template.name + "/register.ejs", {question: question, key: key, content: articleList});
                            });
                        } else {
                            console.log(err);
                            res.render("public/templates/" + template.name + "/register.ejs", {question: question, key: key, content: []});
                        }
                    });
                    //res.render("public/templates/" + template.name + "/register.ejs", {question: question, key: key});
                });
            } else {
                res.redirect('templates/' + template.name + req.originalUrl);
            }
        });
    });

    self.app.post('/resetPassword', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            if (!template.angularTemplate) {
                contentController.resetPassword(req, function (results) {
                    console.log("resetPassword results: " + JSON.stringify(results));
                    var page;
                    if (results.success) {
                        page = "/registrationSuccess.ejs";
                    } else {
                        page = "/registrationFailed.ejs";
                    }
                    res.render("public/templates/" + template.name + page);
                });
            } else {
                res.redirect('templates/' + template.name + req.originalUrl);
            }
        });
    });

    self.app.get('/resetPassword', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            if (!template.angularTemplate) {
                contentController.getMicbuttionChallenge(req, function (results) {
                    var chal = JSON.parse(results);
                    var question = chal.question;
                    var key = chal.key;
                    fs.readFile(__dirname + "/public/templates/" + template.name + "/json/resetPassword.json", function (err, data) {
                        if (!err) {
                            var filter = JSON.parse(data);
                            var loggedIn = false;
                            contentController.getContentList(req, filter, loggedIn, function (articleList) {
                                console.log("content results: " + JSON.stringify(articleList));
                                res.render("public/templates/" + template.name + "/resetPassword.ejs", {question: question, key: key, content: articleList});
                            });
                        } else {
                            console.log(err);
                            res.render("public/templates/" + template.name + "/resetPassword.ejs", {question: question, key: key, content: []});
                        }
                    });
                    //res.render("public/templates/" + template.name + "/resetPassword.ejs", {question: question, key: key});
                });
            } else {
                res.redirect('templates/' + template.name + req.originalUrl);
            }
        });
    });

    self.app.get('/logout', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            if (!template.angularTemplate) {
                // contentController.login(req, function (results) {
                //console.log("content results: " + JSON.stringify(results));
                res.cookie('rememberme', false);
                req.session.loggedIn = false;
                res.redirect("/");
                //res.render("public/templates/" + template.name + "/login.ejs", {username: u, password: p, loginFailed: false});
                //res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });

                //});
            } else {
                res.redirect('templates/' + template.name + req.originalUrl);
            }
        });
    });
    
    //// add comment section here-------------------------
    self.app.post('/comment', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            if (!template.angularTemplate) {
                var loggedIn = (req.session.loggedIn);
                var userId = req.session.userId;
                var reqBody = req.body;
                var articleId = null;
                if (reqBody !== undefined && reqBody !== null) {
                    articleId = reqBody.article;
                }
                contentController.addComment(req, loggedIn, userId, function (results) {
                    console.log("comment add results: " + JSON.stringify(results));
                    if (results.success) {
                        // if (req.cookies !== undefined && req.cookies.rememberme ) {
                        //res.cookie('rememberme', true, {expires: new Date(Date.now() + 900000), httpOnly: true});                            
                        // }
                        //req.session.loggedIn = true;
                        if (articleId !== null) {
                            res.redirect("/article?id=" + articleId);
                        } else {
                            res.redirect("/");
                        }
                        //res.render("public/templates/" + template.name + revisedPage, {content: results});
                    } else {
                        //res.render("public/templates/" + template.name + "/login.ejs", {loginFailed: true, message: "Login failed"});
                        if (articleId !== null) {
                            res.redirect("/article?id=" + articleId);
                        } else {
                            res.redirect("/");
                        }
                    }
                });
            } else {
                res.redirect('templates/' + template.name + req.originalUrl);
            }
        });
    });

    // this if for mix angular and standard templates
    self.app.get('/page', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            var requestedPage = req.originalUrl;
            console.log("requested page: " + requestedPage);
            res.sendFile(__dirname + "/public/templates/" + template.name + "/appIndex.html");
        });

    });
    
    fileInit.fileInitializer(self);

};

