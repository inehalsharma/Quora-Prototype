const mongoose = require('mongoose');

const messagesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    to:{
        type:String,
        required:true
    }, 
    from:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    date: {
        type: Date, 
        default: Date.now}

    
})

module.exports = mongoose.model('Messages', messagesSchema);

