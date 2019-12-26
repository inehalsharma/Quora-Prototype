const mongoose = require('mongoose');

const topicfollowerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    follower:String,
    topic:String,
    followed:{type:Date,
      default:Date.now}
  });

module.exports = mongoose.model('Topicfollower', topicfollowerSchema);