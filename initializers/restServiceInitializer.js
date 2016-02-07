//rest service initializer
var publicService = require('../services/publicService');
var accessLevelService = require('../services/accessLevelService');
var languageService = require('../services/languageService');
var categoryService = require('../services/categoryService');
var sectionService = require('../services/sectionService');
var configurationService = require('../services/configurationService');
var linksService = require('../services/linksService');
var locationService = require('../services/locationService');
var ulboraUserService = require('../services/ulboraUserService');
//var articleService = require('./services/articleService');
var mediaService = require('../services/mediaService');
var imageService = require('../services/imageService');
var articleService = require('../services/articleService');
var commentService = require('../services/commentService');
var mailServerService = require('../services/mailServerService');
var productService = require('../services/productService');
var downloadableFileService = require('../services/downloadableFileService');
var addOnService = require('../services/addOnService');
var templateService = require('../services/templateService');
var adminService = require('../services/adminService');
var contentService = require('../services/contentService');
var feedService = require('../services/feedService');
var templateEngineService = require('../services/templateEngineService');


exports.initialize = function(self, cacheControlUtility){
    var refreshRssCache = false;
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
        self.app.put('/rs/location', locationService.update);
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
            cacheControlUtility.refresh();
            refreshRssCache = true;
            articleService.create(req, res);
        });
        //self.app.put('/rs/article', articleService.update);
        self.app.put('/rs/article', function (req, res) {
            cacheControlUtility.refresh();
            refreshRssCache = true;
            articleService.update(req, res);
        });
        //self.app.delete('/rs/article/:id', articleService.delete);
        self.app.delete('/rs/article/:id', function (req, res) {
            cacheControlUtility.refresh();
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
        self.app.post('/rs/template/upload', function (req, res) {
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

        
        //templates engines        
        self.app.put('/rs/templateEngine', templateEngineService.update);
        self.app.get('/rs/templateEngine/:id', templateEngineService.get);        
        self.app.post('/rs/templateEngine/list', templateEngineService.list);
       
        //self.app.post('/rs/blogTest', function (req, res) {
            //var reqBody = req.body;
            //console.log("new Blog: " + JSON.stringify(reqBody));
            //res.json(req.body);
        //});

};
