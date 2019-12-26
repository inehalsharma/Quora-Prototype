const mongoose = require('mongoose');

const profileviewSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email:{
        type:String,
        required:true
    }, 
    date: {
        type: Date, 
        default: Date.now}

    
})

module.exports = mongoose.model('ProfileView', profileviewSchema);
