//languageSchema
var mongoose = require('mongoose');

var languageSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    defaultLanguage: {type: Boolean, default: false},
    code: {type: String, required: true, trim: true}
});
module.exports = languageSchema;
    