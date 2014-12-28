#!/bin/env node
var express = require('express');
var fs = require('fs');
//var engines = require('consolidate');

var un = 'node';//change this to something private
var pw = 'password';//change this to something private

//var blogPost = require('./db/blog');
var db = require('./db/db');
var publicService = require('./services/publicService');
var accessLevelService = require('./services/accessLevelService');
var languageService = require('./services/languageService');
var categoryService = require('./services/categoryService');
var sectionService = require('./services/sectionService');
var configurationService = require('./services/configurationService');
var linksService = require('./services/linksService');
var locationService = require('./services/locationService');
var ulboraUserService = require('./services/ulboraUserService');
//var articleService = require('./services/articleService');
var mediaService = require('./services/mediaService');
var imageService = require('./services/imageService');
var articleService = require('./services/articleService');
var commentService = require('./services/commentService');
var mailServerService = require('./services/mailServerService');
var productService = require('./services/productService');
var downloadableFileService = require('./services/downloadableFileService');
var addOnService = require('./services/addOnService');
var templateService = require('./services/templateService');
var adminService = require('./services/adminService');
var contentService = require('./services/contentService');
var feedService = require('./services/feedService');

var contentController = require('./controllers/contentController');

var conf = require('./configuration');

var refreshCache = false;
var refreshRssCache = false;
var cashedPages = [];


var ulboracms = function () {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function () {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP || process.env.ULBORACMS_IP;
        self.port = process.env.OPENSHIFT_NODEJS_PORT || process.env.ULBORACMS_PORT || conf.PORT;


        if (typeof self.ipaddress === "undefined") {
            //  Log errors but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No IP address defined, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        }
        ;
    };




    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function (sig) {
        if (typeof sig === "string") {
            console.log('%s: Received %s - terminating sample app ...',
                    Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()));
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function () {
        //  Process on exit and signals.
        process.on('exit', function () {
            self.terminator();
        });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function (element, index, array) {
            process.on(element, function () {
                self.terminator(element);
            });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function () {

        self.app = express();
        self.app.use(express.logger('dev'));
        self.app.use(express.bodyParser());
        self.app.use(express.cookieParser('7320s932h79993Ah4'));
        self.app.use(express.cookieSession());
        self.app.use(express.static(__dirname + '/public'));


        //out of the box ejs---------------
        self.app.set('view engine', 'ejs');
        //--------------------------------------

        //---consolidate.js ejs implementation----
        //self.app.engine('ejs', engines.ejs);
        //self.app.set('view engine', 'ejs');
        //-----------------------------------------

        //---consolidate.js implementation----
        //self.app.engine('hbs', engines.handlebars);
        //self.app.set('view engine', 'hbs');
        //-----------------------------------------

        self.app.set("views", __dirname + "/");
        var auth = express.basicAuth(un, pw);
        db.initializeMongoDb();

        // initial web apps
        initializeWebApp(self);


        self.app.post('/rs/public/login', publicService.login);
        self.app.get('/rs/public/challenge', publicService.getMicbuttionChallenge);
        self.app.post('/rs/public/register', publicService.register);
        self.app.get('/rs/public/activate', publicService.activate);
        self.app.post('/rs/public/resetPassword', publicService.resetPassword);
        //self.app.post('/rs/accessLevel', accessLevelService.create);//just for test



        //language
        self.app.post('/rs/language', languageService.create);
        self.app.put('/rs/language', languageService.update);
        self.app.delete('/rs/language/:id', languageService.delete);
        self.app.get('/rs/language/:id', languageService.get);
        self.app.post('/rs/language/list', languageService.list);


        //category
        self.app.post('/rs/category', categoryService.create);
        self.app.put('/rs/category', categoryService.update);
        self.app.delete('/rs/category/:id', categoryService.delete);
        self.app.get('/rs/category/:id', categoryService.get);
        self.app.post('/rs/category/list', categoryService.list);


        //section
        self.app.post('/rs/section', sectionService.create);
        self.app.put('/rs/section', sectionService.update);
        self.app.delete('/rs/section/:id', sectionService.delete);
        self.app.get('/rs/section/:id', sectionService.get);
        self.app.post('/rs/section/list', sectionService.list);


        //configuration
        self.app.post('/rs/configuration', configurationService.create);
        self.app.put('/rs/configuration', configurationService.update);
        self.app.delete('/rs/configuration/:id', configurationService.delete);
        self.app.get('/rs/configuration/:id', configurationService.get);
        self.app.post('/rs/configuration/list', configurationService.list);


        //links
        self.app.post('/rs/link', linksService.create);
        self.app.put('/rs/link', linksService.update);
        self.app.delete('/rs/link/:id', linksService.delete);
        self.app.get('/rs/link/:id', linksService.get);
        self.app.post('/rs/link/list', linksService.list);


        //location
        self.app.post('/rs/location', locationService.create);
        //self.app.put('/rs/location', locationService.update);
        self.app.delete('/rs/location/:id', locationService.delete);
        self.app.get('/rs/location/:id', locationService.get);
        self.app.post('/rs/location/list', locationService.list);

        //user
        self.app.post('/rs/user', ulboraUserService.create);
        self.app.put('/rs/user', ulboraUserService.update);
        self.app.delete('/rs/user/:id', ulboraUserService.delete);
        self.app.get('/rs/user/:id', ulboraUserService.get);
        self.app.post('/rs/user/list', ulboraUserService.list);
        self.app.post('/rs/user/pw', ulboraUserService.changePassword);
        self.app.post('/rs/user/roleList', ulboraUserService.roleList);




        //media         
        self.app.post('/rs/media/upload', mediaService.create);
        self.app.get('/image/get/:id', imageService.get);
        self.app.put('/rs/media', mediaService.update);
        self.app.get('/rs/media/:id', mediaService.get);
        //self.app.get('/rs/media/:id', function (req, res) {
            //mediaService.get(req, res, self.port);
        //});
        self.app.delete('/rs/media/:id', mediaService.delete);
        self.app.post('/rs/media/list', mediaService.list);
        //self.app.post('/rs/media/list', function (req, res) {
            //mediaService.list(req, res, self.port);
        //});


        //article
        //self.app.post('/rs/article', articleService.create);
        self.app.post('/rs/article', function (req, res) {
            refreshCache = true;
            refreshRssCache = true;
            articleService.create(req, res);
        });
        //self.app.put('/rs/article', articleService.update);
        self.app.put('/rs/article', function (req, res) {
            refreshCache = true;
            refreshRssCache = true;
            articleService.update(req, res);
        });
        //self.app.delete('/rs/article/:id', articleService.delete);
        self.app.delete('/rs/article/:id', function (req, res) {
            refreshCache = true;
            refreshRssCache = true;
            articleService.delete(req, res);
        });
        self.app.get('/rs/article/:id', articleService.get);
        self.app.post('/rs/article/list', articleService.list);
        self.app.post('/rs/article/values', articleService.values);


        //comment
        self.app.post('/rs/comment', commentService.create);
        self.app.put('/rs/comment', commentService.update);
        self.app.delete('/rs/comment/:id', commentService.delete);
        self.app.get('/rs/comment/:id', commentService.get);
        self.app.post('/rs/comment/list', commentService.list);


        //mailServer        
        self.app.put('/rs/mailServer', mailServerService.update);
        self.app.get('/rs/mailServer', mailServerService.get);


        //product
        self.app.post('/rs/product', productService.create);
        self.app.put('/rs/product', productService.update);
        self.app.delete('/rs/product/:id', productService.delete);
        self.app.get('/rs/product/:id', productService.get);
        self.app.post('/rs/product/list', productService.list);


        //downloadableFile         
        self.app.post('/rs/downloadableFile/upload', downloadableFileService.create);
        self.app.get('/rs/downloadableFile/download', downloadableFileService.download);
        self.app.put('/rs/downloadableFile', downloadableFileService.update);
        //self.app.get('/rs/media/:id', mediaService.get);
        self.app.get('/rs/downloadableFile/:id', function (req, res) {
            downloadableFileService.get(req, res, self.port);
        });
        self.app.delete('/rs/downloadableFile/:id', downloadableFileService.delete);
        //self.app.post('/rs/media/list', mediaService.list);
        self.app.post('/rs/downloadableFile/list', downloadableFileService.list);



        //addons
        self.app.post('/rs/addons', addOnService.create);
        self.app.put('/rs/addons', addOnService.update);
        self.app.delete('/rs/addons/:id', addOnService.delete);
        self.app.get('/rs/addons/:id', addOnService.get);
        self.app.post('/rs/addons/list', addOnService.list);
        self.app.post('/rs/addons/call', addOnService.call);


        //templates  
        self.app.post('/rs/template', templateService.create);
        self.app.put('/rs/template', templateService.update);
        self.app.get('/rs/template/:id', templateService.get);
        self.app.delete('/rs/template/:id', templateService.delete);
        self.app.post('/rs/template/list', templateService.list);
        //self.app.post('/rs/template/upload', templateService.upload);
        self.app.post('/rs/template/upload', function (req, res){
            templateService.upload(__dirname, req, res);
        });

        //admin summary
        self.app.get('/rs/admin/summary', adminService.summary);

        //content
        self.app.post('/rs/content', contentService.getContentList);


        self.app.get('/rs/content/article/:id', contentService.getArticle);

        //self.app.get('/rss', feedService.rssFeed);
        self.app.get('/rss', function (req, res) {
            var doCache = false;
            if (refreshRssCache) {
                doCache = true;
                refreshRssCache = false;
            }
            feedService.rssFeed(req, res, doCache);
        });



        self.app.get('/rs/test', auth, function (req, res) {
            //var w = test();
            res.send([{code: 2, name: "ken"}, {name: 'wine2'}]);
        });


        /*
         self.app.post('/UlboraCms/login', function(req, res) {
         var reqBody = req.body;
         var auth = false;
         if (!req.is('application/json')) {
         res.status(415);
         } else {
         if (reqBody.username === un && reqBody.password === pw) {
         auth = true;
         }
         }
         var returnVal = {
         "authenticated": auth
         };
         res.send(returnVal);
         
         });
         */
        self.app.post('/rs/blogTest', function (req, res) {
            var reqBody = req.body;
            console.log("new Blog: " + JSON.stringify(reqBody));
            res.json(req.body);
        });

        self.app.use(errorHander);

    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function () {
        self.setupVariables();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function () {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function () {
            console.log('%s: Node server started on %s:%d ...',
                    Date(Date.now()), self.ipaddress, self.port);
        });
    };



};

var initializeWebApp = function (self) {

    self.app.get('/', function (req, res) {
        getDefaultTemplate(function (template) {
            var requestedPage = req.originalUrl;
            var loggedIn = (req.session.loggedIn);
            console.log("requested page: " + requestedPage);
            if (template.angularTemplate) {
                res.sendfile("public/templates/" + template.name + "/index.html");
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


    self.app.get('/*.html', function (req, res) {
        getDefaultTemplate(function (template) {
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
                                if(filerName !== "archive"){
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
                res.redirect('templates/' + template.name + req.originalUrl);
            }
        });
    });


    self.app.get('/article', function (req, res) {
        getDefaultTemplate(function (template) {
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
        getDefaultTemplate(function (template) {
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
        getDefaultTemplate(function (template) {
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
        getDefaultTemplate(function (template) {
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
        getDefaultTemplate(function (template) {
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
        getDefaultTemplate(function (template) {
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
        getDefaultTemplate(function (template) {
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
        getDefaultTemplate(function (template) {
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
        getDefaultTemplate(function (template) {
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
        getDefaultTemplate(function (template) {
            var requestedPage = req.originalUrl;
            console.log("requested page: " + requestedPage);
            res.sendfile("public/templates/" + template.name + "/appIndex.html");
        });

    });

    self.app.get('/css/*', function (req, res) {
        getDefaultTemplate(function (template) {
            res.redirect('templates/' + template.name + req.originalUrl);
        });

    });

    self.app.get('/font/*', function (req, res) {
        getDefaultTemplate(function (template) {
            res.redirect('templates/' + template.name + req.originalUrl);
        });

    });

    self.app.get('/img/*', function (req, res) {
        getDefaultTemplate(function (template) {
            res.redirect('templates/' + template.name + req.originalUrl);
        });

    });

    self.app.get('/js/*', function (req, res) {
        getDefaultTemplate(function (template) {
            res.redirect('templates/' + template.name + req.originalUrl);
        });

    });

    self.app.get('/lib-css/*', function (req, res) {
        getDefaultTemplate(function (template) {
            res.redirect('templates/' + template.name + req.originalUrl);
        });

    });

    self.app.get('/partials/*', function (req, res) {
        getDefaultTemplate(function (template) {
            res.redirect('templates/' + template.name + req.originalUrl);
        });

    });

};

var getDefaultTemplate = function (callback) {
    var Template = db.getTemplate();
    Template.findOne({defaultTemplate: true}, function (err, results) {
        var t = {
            name: "default",
            angularTemplate: false
        }
        console.log("found template set to default: " + JSON.stringify(results));
        if (!err && (results !== undefined && results !== null)) {
            t.name = results.name;
            t.angularTemplate = results.angularTemplate;
            callback(t);
        } else {
            callback(t);
        }
    });
};

var errorHander = function (req, res) {
    //res.status(404).send('Something broke!');
    res.status(404).sendfile("public/error.html");
};

/**
 *  main():  Main code.
 */
var zapp = new ulboracms();
zapp.initialize();
zapp.start();

