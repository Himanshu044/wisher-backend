const mongoose = require('mongoose');
const Event = require('../db/Event')
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone:String,
    password: { type: String, select: false },
    events : [ Event.schema ]
});
module.exports = mongoose.model('User',userSchema);