//databaseVerionSchema
var mongoose = require('mongoose');

var databaseVersionSchema = new mongoose.Schema({
    version: {type: String, required: true, trim: true}
});
module.exports = databaseVersionSchema;
