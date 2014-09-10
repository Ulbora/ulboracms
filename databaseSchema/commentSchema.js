//accessLevelSchema
var mongoose = require('mongoose');
var commentSchema = new mongoose.Schema({
    text: {type: String, required: true, trim: true},
    approved: {type: Boolean, default: false},
    article: {type: mongoose.Schema.ObjectId, required: true, ref: "Article"}
});
module.exports = commentSchema;

