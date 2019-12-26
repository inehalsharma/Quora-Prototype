const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    questionID: String,
    answer: String,
    owner: {
        type: String,
        required: true
    },
    fname: String,
    lname: String,
    image: String,
    isAnonymous: Boolean,
    isCommentable: Boolean,
    isVotable: Boolean,
    upVote: Number,
    downVote: Number,
    views: Number,
    posted: {type: Date, default: Date.now},
    question: String,
})

module.exports = mongoose.model('Answers', answerSchema);