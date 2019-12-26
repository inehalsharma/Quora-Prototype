const mongoose = require('mongoose');

const notificationsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    question: String,
    questionID: String,
    answer: String,
    follower: String,
    seen: {type: Boolean, default: false},
    view: {type: Boolean, default: false}
})

module.exports = mongoose.model('Notifications', notificationsSchema);