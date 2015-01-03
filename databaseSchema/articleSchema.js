//articleSchema
var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true},
    alias: String,
    createdDate: {type: Date, default: Date.now},
    hits: {type: Number, default: 0},
    metaAuthorName: String,
    metaDesc: String,
    metaKeyWords: String,
    metaRobotKeyWords: String,
    modifiedDate: {type: Date},
    published: {type: Boolean, default: false},
    showAuthor: {type: Boolean, default: false},
    showCategoryName: {type: Boolean, default: false},
    showCreateDate: {type: Boolean, default: false},
    showIntroText: {type: Boolean, default: false},
    showModifyDate: {type: Boolean, default: false},
    showSectionName: {type: Boolean, default: false},
    showTitle: {type: Boolean, default: false},
    fullPage: {type: Boolean, default: false},
    allowComments: {type: Boolean, default: false},
    commentsStartDate: {type: Date},
    commentsEndDate: {type: Date},
    commentsRequireLogin: {type: Boolean, default: true},
    accessLevel: {type: mongoose.Schema.ObjectId, required: true, ref: "AccessLevel"},
    category: {type: mongoose.Schema.ObjectId, required: true, ref: "Category"},
    section: {type: mongoose.Schema.ObjectId, required: true, ref: "Section"},
    language: {type: mongoose.Schema.ObjectId, required: true, ref: "Language"},
    user: {type: mongoose.Schema.ObjectId, required: true, ref: "User"},
    menuIndex: {type: Number, default: 0}

});
module.exports = articleSchema;


