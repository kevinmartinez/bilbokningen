var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarSchema = new Schema({
    model: String,
    seats: Number,
    isAuto: Boolean,
    hasRoofrack: Boolean,
    price: Number,
    booking: [{
        email: String,
        startDate: String,
        endDate: String,
    }]
});

module.exports = mongoose.model('Car', CarSchema);