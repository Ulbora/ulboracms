//userSchema
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true, trim: true},
    password: {type: String, required: true},
    enabled: {type: Boolean, default: false},
    activationCode: String,
    dateEntered: {type: Date, default: Date.now},
    emailAddress: {type: String, required: true, trim: true},
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    role: {type: mongoose.Schema.ObjectId, required: true, ref: "Role"}
});
module.exports = userSchema;




