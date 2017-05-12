var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarSchema = new Schema({
    model: String,
    seats: Number,
    auto: Boolean,
    roofrack: Boolean,
    price: Number,
    booked: {
        $gte: String,
        $lt: String,
    }
})