//productPriceSchema
var mongoose = require('mongoose');

var productPriceSchema = new mongoose.Schema({
    currencyCode: {type: String, required: true, trim: true},
    price: {type: Number, required: true},
    language: {type: mongoose.Schema.ObjectId, required: true, ref: "Language"},
    product: {type: mongoose.Schema.ObjectId, required: true, ref: "Product"}
});
module.exports = productPriceSchema;


