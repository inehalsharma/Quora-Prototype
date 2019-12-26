const mongoose = require('mongoose');

const topicSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    topic: String,
    picture: String
    
   });

module.exports = mongoose.model('Topic', topicSchema);