const { findById } = require('../models/Post');
let User = require('../models/User')

async function getFriendsArray(user_id){
    let friends_details = {}
    let all_friends_details = []
   let user = await User.findById(user_id)
        for(let i=0;i<user.friends.length;i++){
            console.log(i);
         let friend = await User.findById(user.friends[i])
                let name = friend.first_name +" "+ friend.last_name
                friends_details = {
                    friend_id : friend._id,
                    name : name,
                    image : friend.profile_pic,
                    status : friend.status
                }
                console.log(friends_details);
            all_friends_details.push(friends_details)
        }

        return all_friends_details
} 





let getFriendsDetials={
    getFriendsArray
}

module.exports = getFriendsDetials