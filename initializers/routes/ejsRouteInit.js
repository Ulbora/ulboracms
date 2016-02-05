var fs = require('fs');
var webtpl = require('../../utils/webtpl');
var contentController = require('../../controllers/contentController');
var cashedPages = [];

exports.initialize = function (self, refreshCache, __dirname) {
    
    self.app.get('/login', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            if (!template.angularTemplate) {
                var loggedIn = (req.session.loggedIn);                
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
                            res.render("templates/" + template.name + "/login", {username: u, password: p, loginFailed: false, loggedIn: loggedIn, content: articleList});
                        });
                    } else {
                        console.log(err);
                        res.render("templates/" + template.name + "/login", {username: u, password: p, loginFailed: false, loggedIn: loggedIn, content: []});
                    }
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
                        res.render("templates/" + template.name + "/login", {loginFailed: true, message: "Login failed", content: []});
                    }
                });
            } else {
                res.redirect('templates/' + template.name + req.originalUrl);
            }
        });
    });
    
    
    self.app.get('/*', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            if (template.angularTemplate) {
                res.sendFile(__dirname + "/public/templates/" + template.name + "/index.html");
            } else {
                var page = null;
                var requestedPage = req.originalUrl;
                page = requestedPage.replace("/", "");
                var loggedIn = (req.session.loggedIn);
                console.log("requested page: " + requestedPage);
                console.log("page: " + page);
                if (page === "") {
                    page = "index"
                }
                if (!refreshCache && cashedPages[page] !== undefined && cashedPages[page] !== null) {
                    res.render("templates/" + template.name + "/" + page, {content: cashedPages[page], loggedIn: loggedIn});
                } else {
                    if (refreshCache) {
                        cashedPages = [];
                    }
                    console.log("cachedPages: " + JSON.stringify(cashedPages[page]));
                    refreshCache = false;
                    fs.readFile(__dirname + "/public/templates/" + template.name + "/json/" + page + ".json", function (err, data) {
                        if (!err) {
                            var filter = JSON.parse(data);
                            console.log("filter data: " + JSON.stringify(filter));
                            console.log("filter data frontpage: " + filter.frontPage);
                            contentController.getContentList(req, filter, loggedIn, function (results) {
                                cashedPages["index"] = results;
                                console.log("content results: " + JSON.stringify(results));
                                console.log("page: " + page);
                                res.render("templates/" + template.name + "/"+ page, {content: results, loggedIn: loggedIn});
                            });
                        }// else {
                        //res.render("public/templates/" + template.name + "/index." + templateEngine.ext, {});
                        // }

                    });
                }
            }
        });
    });
};