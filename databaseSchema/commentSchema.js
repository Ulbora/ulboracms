//accessLevelSchema
var mongoose = require('mongoose');
var commentSchema = new mongoose.Schema({
    text: {type: String, required: true, trim: true},
    createdDate: {type: Date, default: Date.now},
    approved: {type: Boolean, default: false},
    commenter: {type: mongoose.Schema.ObjectId, required: false, ref: "User"},
    article: {type: mongoose.Schema.ObjectId, required: true, ref: "Article"},
    otherComment: {type: mongoose.Schema.ObjectId, required: false, ref: "Comment"}
});
module.exports = commentSchema;

