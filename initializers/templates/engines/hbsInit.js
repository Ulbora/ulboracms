// initialize hbs template engine
var tmplEngUtil = require('../../../utils/tmplEngUtil');
exports.initialize = function (__dirname, self, templateEngine) {
    if (templateEngine.engine === 'hbs') {
        self.app.set('view engine', 'hbs');
        self.app.set("views", __dirname + "/");
        console.log("Template Engine is: " + templateEngine.engine);
    }
};