const mongoose = require('mongoose');

const votesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    answerID: String,
    owner: String,
    upVote: Boolean,
    downVote: Boolean
});

module.exports = mongoose.model('Votes', votesSchema);