const mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    answerID: String,
    comment: String,
    posted: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Comments', commentSchema);