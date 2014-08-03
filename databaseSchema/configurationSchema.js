//configurationSchema
var mongoose = require('mongoose');

var configurationSchema = new mongoose.Schema({
    siteName: {type: String, required: true, trim: true},
    siteDesc: {type: String, required: true, trim: true},
    language: {type: mongoose.Schema.ObjectId, required: true, ref: "Language"}
});
module.exports = configurationSchema;


