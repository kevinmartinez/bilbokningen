var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: String,
    phone: Number, // this is kinda uneccessary but he wanted some contact info :p

});

module.exports = mongoose.model('User', userSchema);