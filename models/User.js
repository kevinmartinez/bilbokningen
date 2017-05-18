var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: String,
    password: String,
    name: String,
    phone: Number, // this is kinda uneccessary but he wanted some contact info :p

});

module.exports = mongoose.model('User', userSchema);