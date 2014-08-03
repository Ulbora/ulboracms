//productLocationSchema
var mongoose = require('mongoose');

var productLocationSchema = new mongoose.Schema({
    product: {type: mongoose.Schema.ObjectId, required: true, ref: "Product"},
    location: {type: mongoose.Schema.ObjectId, required: true, ref: "Location"}
});
module.exports = productLocationSchema;


