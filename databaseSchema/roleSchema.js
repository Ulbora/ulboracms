//rolesSchema
var mongoose = require('mongoose');

var roleSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true}
});
module.exports = roleSchema;
