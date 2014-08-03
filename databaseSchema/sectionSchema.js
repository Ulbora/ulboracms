//sectionSchema
var mongoose = require('mongoose');

var sectionSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    language: {type: mongoose.Schema.ObjectId, required: true, ref: "Language"}
});
module.exports = sectionSchema;
