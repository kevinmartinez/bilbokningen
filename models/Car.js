var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarSchema = new Schema({
    model: { type: String, required: true },
    seats: { type: Number, required: true },
    isAuto: { type: Boolean, required: true },
    hasRoofrack: { type: Boolean, required: true },
    price: { type: Number, required: true },
    booking: [{
        email: String,
        startDate: String,
        endDate: String,
    }]
});

module.exports = mongoose.model('Car', CarSchema);