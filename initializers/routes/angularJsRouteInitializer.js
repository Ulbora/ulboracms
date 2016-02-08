var webTemplateUtility = require('../../utils/webTemplateUtility');
exports.initializePartials = function(self){
    self.app.get('/partials/*.html', function (req, res) { 
        console.log("in partials");
         webTemplateUtility.getDefaultTemplate(function (template) {
            console.log("in partials url: " + '/templates/' + template.name + req.originalUrl);
            res.redirect('/templates/' + template.name + req.originalUrl);            
        });
    });
};

exports.redirectAngularRequest = function(templateName, req, res){
    res.redirect('templates/' + templateName + req.originalUrl);
};

exports.sendAngularRequestFile = function(__dirname, templateName, res){
    res.sendFile(__dirname + "/public/templates/" + templateName + "/index.html");
};