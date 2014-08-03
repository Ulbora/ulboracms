//addonsSchema
var mongoose = require('mongoose');
var addonsSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    url: {type: String, required: true, trim: true},
    basicAuth: {type: Boolean, default: false},
    username: {type: String, required: false, trim: true},
    password: {type: String, required: false}
});
module.exports = addonsSchema;
    