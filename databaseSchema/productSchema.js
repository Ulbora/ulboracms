//productSchema
var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    desc: {type: String, required: true, trim: true},
    externalLink: String,
    hits: {type: Number, default: 0},
    imageLocation: String,
    metaAuthorName: String,
    metaDesc: String,
    metaKeyWords: String,
    metaRobotKeyWords: String,
    promoVideoLink: String,
    published: {type: Boolean, default: false},
    accessLevel: {type: mongoose.Schema.ObjectId, required: true, ref: "AccessLevel"},
    category: {type: mongoose.Schema.ObjectId, required: true, ref: "Category"},
    section: {type: mongoose.Schema.ObjectId, required: true, ref: "Section"},
    language: {type: mongoose.Schema.ObjectId, required: true, ref: "Language"},
    currencyCode: {type: String, required: true, trim: true},
    price: {type: Number, required: true}
});
module.exports = productSchema;

