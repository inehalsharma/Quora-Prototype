const mongoose = require('mongoose');

const userfollowSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid: String, // mongodb id of user
    useremail:String,
    userfname:String,
    userlname:String,
    userimage:String,
    followeremail:String, //the mongodb id of followers
    followerfname:String,
    followerlname:String,
    followerimage:String,
    followerid:String,

    
   });

module.exports = mongoose.model('Userfollow', userfollowSchema);