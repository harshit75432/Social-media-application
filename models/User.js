const mongoose = require('mongoose')


const user =  new mongoose.Schema({
    
    profile_pic : {
        type : String
    },
    first_name : {
        type : String,
        require : true
    },
    last_name : {
        type : String,
        require : true,
    },
    email : {
        type : String,
        require : true,
        unique : true
    },
    mobile : {
        type : Number,
        require : true,
        unique : true
    },
    password : {
        type : String,
        require : true
    },
    friends : {
        type : Array,
    },
    requests : {
        type : Array,
    },
    request_sent : {
        type : Array,
    },
    status : {
        type : String,
    }


})


const User = mongoose.model('User',user)
module.exports = User