var webTemplateUtility = require('../../utils/webTemplateUtility');

exports.fileInitializer = function (self) {

    self.app.get('/sitemap.xml', function (req, res) {
        webTemplateUtility.getDefaultTemplate(function (template) {
            res.redirect('templates/' + template.name + req.originalUrl);
        });
    });


    self.app.get('/css/*', function (req, res) {
        webTemplateUtility.getDefaultTemplate(function (template) {
            res.redirect('/templates/' + template.name + req.originalUrl);
        });

    });

    self.app.get('/font/*', function (req, res) {
        webTemplateUtility.getDefaultTemplate(function (template) {
            res.redirect('/templates/' + template.name + req.originalUrl);
        });

    });

    self.app.get('/img/*', function (req, res) {
        webTemplateUtility.getDefaultTemplate(function (template) {
            res.redirect('/templates/' + template.name + req.originalUrl);
        });

    });

    self.app.get('/js/*', function (req, res) {
        webTemplateUtility.getDefaultTemplate(function (template) {
            res.redirect('/templates/' + template.name + req.originalUrl);
        });

    });

    self.app.get('/lib-css/*', function (req, res) {
        webTemplateUtility.getDefaultTemplate(function (template) {
            res.redirect('/templates/' + template.name + req.originalUrl);
            //es.send("hello");
        });

    });

};


