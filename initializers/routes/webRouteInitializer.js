var fs = require('fs');
var webTemplateUtility = require('../../utils/webTemplateUtility');
var contentController = require('../../controllers/contentController');
var cashedPages = [];
var angularJsRouteInitializer = require('./angularJsRouteInitializer');
exports.initialize = function (self, cacheControlUtility, __dirname) {
    self.app.get('/login', function (req, res) {
        webTemplateUtility.getDefaultTemplate(function (template) {
            if (!template.angularTemplate) {
                var loggedIn = (req.session.loggedIn);
                var u = "";
                var p = "";
                if (req.cookies.rememberme) {
                    u = req.cookies.username;
                    p = req.cookies.password;
                }
                res.render("templates/" + template.name + "/login", {username: u, password: p, loginFailed: false, loggedIn: loggedIn});
            } else {
                //res.redirect('templates/' + template.name + req.originalUrl);
                angularJsRouteInitializer.redirectAngularRequest(template.name, req, res);
            }
        });
    });


    self.app.post('/login', function (req, res) {
        webTemplateUtility.getDefaultTemplate(function (template) {
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
                    } else {
                        res.render("templates/" + template.name + "/login", {loginFailed: true, message: "Login failed", content: []});
                    }
                });
            } else {
                //res.redirect('templates/' + template.name + req.originalUrl);
                angularJsRouteInitializer.redirectAngularRequest(template.name, req, res);
            }
        });
    });


    self.app.get('/logout', function (req, res) {
        webTemplateUtility.getDefaultTemplate(function (template) {
            if (!template.angularTemplate) {
                res.cookie('rememberme', false);
                req.session.loggedIn = false;
                res.redirect("/");
            } else {
                //res.redirect('templates/' + template.name + req.originalUrl);
                angularJsRouteInitializer.redirectAngularRequest(template.name, req, res);
            }
        });
    });


    self.app.post('/resetPassword', function (req, res) {
        webTemplateUtility.getDefaultTemplate(function (template) {
            if (!template.angularTemplate) {
                contentController.resetPassword(req, function (results) {
                    console.log("resetPassword results: " + JSON.stringify(results));
                    var page;
                    if (results.success) {
                        page = "/registrationSuccess";
                    } else {
                        page = "/registrationFailed";
                    }
                    res.render("templates/" + template.name + page);
                });
            } else {
                //res.redirect('templates/' + template.name + req.originalUrl);
                angularJsRouteInitializer.redirectAngularRequest(template.name, req, res);
            }
        });
    });

    self.app.get('/resetPassword', function (req, res) {
        webTemplateUtility.getDefaultTemplate(function (template) {
            if (!template.angularTemplate) {
                contentController.getMicbuttionChallenge(req, function (results) {
                    var chal = JSON.parse(results);
                    var question = chal.question;
                    var key = chal.key;
                    res.render("templates/" + template.name + "/resetPassword", {question: question, key: key});
                });
            } else {
                //res.redirect('templates/' + template.name + req.originalUrl);
                angularJsRouteInitializer.redirectAngularRequest(template.name, req, res);
            }
        });
    });

    self.app.get('/article', function (req, res) {
        webTemplateUtility.getDefaultTemplate(function (template) {
            if (!template.angularTemplate) {
                var loggedIn = (req.session.loggedIn);
                contentController.getArticle(req, loggedIn, function (results) {
                    console.log("content results: " + JSON.stringify(results));
                    fs.readFile(__dirname + "/public/templates/" + template.name + "/json/article.json", function (err, data) {
                        if (!err) {
                            var filter = JSON.parse(data);
                            contentController.getContentList(req, filter, loggedIn, function (articleList) {
                                console.log("content results: " + JSON.stringify(articleList));
                                if (results._id !== undefined && results._id !== null) {
                                    res.render("templates/" + template.name + "/article", {article: results, loggedIn: loggedIn, content: articleList});
                                } else {
                                    //errorHander(req, res);
                                    res.status(404).send('Not Found');
                                }
                            });
                        } else {
                            console.log(err);
                            res.render("templates/" + template.name + "/article", {article: results, loggedIn: loggedIn, content: []});
                        }
                    });
                });
            } else {
                //res.redirect('templates/' + template.name + req.originalUrl);
                angularJsRouteInitializer.redirectAngularRequest(template.name, req, res);
            }
        });
    });


    self.app.post('/register', function (req, res) {
        webTemplateUtility.getDefaultTemplate(function (template) {
            if (!template.angularTemplate) {
                contentController.register(req, function (results) {
                    console.log("register results: " + JSON.stringify(results));
                    var page;
                    if (results.success) {
                        page = "/registrationSuccess";
                    } else {
                        page = "/registrationFailed";
                    }
                    res.render("templates/" + template.name + page);
                });
            } else {
                //res.redirect('templates/' + template.name + req.originalUrl);
                angularJsRouteInitializer.redirectAngularRequest(template.name, req, res);
            }
        });
    });


    self.app.get('/register', function (req, res) {
        webTemplateUtility.getDefaultTemplate(function (template) {
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
                    res.render("templates/" + template.name + "/register", {question: question, key: key});
                });
            } else {
                //res.redirect('templates/' + template.name + req.originalUrl);
                angularJsRouteInitializer.redirectAngularRequest(template.name, req, res);
            }
        });
    });
    
    
    //// add comment section here-------------------------
    self.app.post('/comment', function (req, res) {
        webTemplateUtility.getDefaultTemplate(function (template) {
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
                        if (articleId !== null) {
                            res.redirect("/article?id=" + articleId);
                        } else {
                            res.redirect("/");
                        }                        
                    } else {                        
                        if (articleId !== null) {
                            res.redirect("/article?id=" + articleId);
                        } else {
                            res.redirect("/");
                        }
                    }
                });
            } else {
                //res.redirect('templates/' + template.name + req.originalUrl);
                angularJsRouteInitializer.redirectAngularRequest(template.name, req, res);
            }
        });
    });
    
    // this if for mix angular and standard templates
    self.app.get('/application', function (req, res) {
        webTemplateUtility.getDefaultTemplate(function (template) {
            var requestedPage = req.originalUrl;
            console.log("requested page: " + requestedPage);
            res.sendFile(__dirname + "/public/templates/" + template.name + "/appIndex.html");
        });

    });

    self.app.get('/*', function (req, res) {
        webTemplateUtility.getDefaultTemplate(function (template) {
            if (template.angularTemplate) {
                res.sendFile(__dirname + "/public/templates/" + template.name + "/index.html");
                angularJsRouteInitializer.sendAngularRequestFile(__dirname, template.name, res);
            } else {
                var page = null;
                var requestedPage = req.originalUrl;
                page = requestedPage.replace("/", "");
                var indexOfq = page.indexOf("?");
                if(indexOfq > 0){
                    page = page.substring(0, indexOfq);
                }
                var loggedIn = (req.session.loggedIn);
                console.log("requested page: " + requestedPage);
                console.log("page: " + page);
                if (page === "") {
                    page = "index"
                }
                console.log("page: " + page);
                if (!cacheControlUtility.needsRefresh() && cashedPages[page] !== undefined && cashedPages[page] !== null) {
                    console.log("found cashed page" + JSON.stringify(cashedPages[page]));
                    res.render("templates/" + template.name + "/" + page, {content: cashedPages[page], loggedIn: loggedIn});
                } else {
                    if (cacheControlUtility.needsRefresh()) {
                        cashedPages = [];
                    }
                    console.log("cachedPages: " + JSON.stringify(cashedPages[page]));
                    cacheControlUtility.refreshed();
                    fs.readFile(__dirname + "/public/templates/" + template.name + "/json/" + page + ".json", function (err, data) {
                        if (!err) {
                            var filter = JSON.parse(data);
                            console.log("filter data: " + JSON.stringify(filter));
                            console.log("filter data frontpage: " + filter.frontPage);
                            contentController.getContentList(req, filter, loggedIn, function (results) {
                                cashedPages[page] = results;
                                console.log("content results: " + JSON.stringify(results));
                                console.log("page: " + page);
                                res.render("templates/" + template.name + "/" + page, {content: results, loggedIn: loggedIn});
                            });
                        }else{
                            res.status(404).send('Not Found');
                        }
                    });
                }
            }
        });
    });
};