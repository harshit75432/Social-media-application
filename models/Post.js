const mongoose = require('mongoose')


const post =  new mongoose.Schema({
    
    type :  {
        type : String
    },
    title : {
        type : String
    },
    likes : {
        type : Array
    },
    comments : {
        type : Array
    },
    friends : {
        type : Array
    },
    post_pics : {
        type : Array
    },
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
   
    tag_friends : {
        type : Array,
    } 

},{
    timestamps : true
})


const Post = mongoose.model('Post',post)
module.exports = Post