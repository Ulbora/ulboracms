var webTemplateUtility = require('../utils/webTemplateUtility');
exports.partials = function(self){
    self.app.get('/partials/*.html', function (req, res) { 
        console.log("in partials");
         webTemplateUtility.getDefaultTemplate(function (template) {
            console.log("in partials url: " + '/templates/' + template.name + req.originalUrl);
            res.redirect('/templates/' + template.name + req.originalUrl);            
        });
    });
};