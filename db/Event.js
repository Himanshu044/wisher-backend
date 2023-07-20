const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
    eventName: String,
    eventAuther: String,
    date: String,
    phone:String,
    message:String
});
module.exports = mongoose.model('Event',eventSchema);