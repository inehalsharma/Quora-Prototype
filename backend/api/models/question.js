const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    question: String,
    owner: String,
    firstname:String,
    lastname:String,
    userimage:String,
    topic:String,
    posted:{type:Date,
            default:Date.now},
    views: Number
    
   });

module.exports = mongoose.model('Question', questionSchema);