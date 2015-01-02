//locationSchema
var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    menu: {type: Boolean, default: false}
});
module.exports = locationSchema;
    