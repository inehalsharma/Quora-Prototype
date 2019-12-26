const mongoose = require('mongoose');

const followerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    questionid: String,
    follower:String,
    question:String,
    followed:{type:Date,
      default:Date.now}
  });

module.exports = mongoose.model('Follower', followerSchema);