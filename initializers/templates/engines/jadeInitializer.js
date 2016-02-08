// initialize jade template engine
exports.initialize = function (__dirname, self, templateEngine) {
    if (templateEngine.engine === 'jade') {
        self.app.set('view engine', 'jade');
        self.app.set("views", __dirname + "/public");
        console.log("Template Engine is: " + templateEngine.engine);
    }
};