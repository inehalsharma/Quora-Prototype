const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required : true,
        unique : true
    },
    fname: String,
    lname: String,
    password: String,
    
    
   });

module.exports = mongoose.model('User', userSchema);