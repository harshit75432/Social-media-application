const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    reply_id : {
        type : String
    },
    sender_id : {
        type : String
    },
    message : {
        type : String
    },
    time : { 
        type : String 
    },
    images : {
        type : Array
    },
    status : {
        type : String
    },
})

const Chat =mongoose.model('Chat',chatSchema)
module.exports = Chat