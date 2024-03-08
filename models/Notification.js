let mongoose = require('mongoose')

let notificationSchema = new mongoose.Schema({
    receiver_id : {
        type : String
    },
    sender_id : {
        type : String
    },
    time : {
        type : String
    },
    seen :{
        type : String
    },
    type :{
        type : String
    }
})

let notification = mongoose.model('Notification',notificationSchema)

module.exports = notification