var webtpl = require('../utils/webtpl');

exports.fileInitializer = function (self) {

    self.app.get('/sitemap.xml', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            res.redirect('templates/' + template.name + req.originalUrl);
        });
    });


    self.app.get('/css/*', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            res.redirect('/templates/' + template.name + req.originalUrl);
        });

    });

    self.app.get('/font/*', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            res.redirect('/templates/' + template.name + req.originalUrl);
        });

    });

    self.app.get('/img/*', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            res.redirect('/templates/' + template.name + req.originalUrl);
        });

    });

    self.app.get('/js/*', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            res.redirect('/templates/' + template.name + req.originalUrl);
        });

    });

    self.app.get('/lib-css/*', function (req, res) {
        webtpl.getDefaultTemplate(function (template) {
            res.redirect('/templates/' + template.name + req.originalUrl);
            //es.send("hello");
        });

    });

};


