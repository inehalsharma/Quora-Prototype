const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fname: String,
    lname: String,
    email: String,
    image: String,
    about:String,
    city:String,
    country:String,
    companyname:String,
    companyposition:String,
    companystart:Date,
    companyend:Date,
    profilecredential:String,
    educationschool :String,
    educationstart:String,
    educationend:String,
    educationdegree:String,
    state:String,
    zipcode:String,
    education:Array,
    company:Array,
    views:{
        type: Number, 
        default: 0
    },
    active:{
        type: Number, 
        default: 1
    }
  
   });

module.exports = mongoose.model('Profile', profileSchema);