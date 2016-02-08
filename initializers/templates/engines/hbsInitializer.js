// initialize hbs template engine
exports.initialize = function (__dirname, self, templateEngine) {
    if (templateEngine.engine === 'hbs') {
        self.app.set('view engine', 'hbs');
        self.app.set("views", __dirname + "/public");
        console.log("Template Engine is: " + templateEngine.engine);
    }
};