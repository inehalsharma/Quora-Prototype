const mongoose = require('mongoose');

const bookmarksSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    question: String,
    questionID: String,
    answerID: String,
    owner: String,
    answer: String,
    questionOwner: String
});

module.exports = mongoose.model('Bookmarks', bookmarksSchema);