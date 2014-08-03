//accessLevelSchema
var mongoose = require('mongoose');
var commentSchema = new mongoose.Schema({
    text: {type: String, required: true, trim: true},
    article: {type: mongoose.Schema.ObjectId, required: true, ref: "Article"}
});
module.exports = commentSchema;

