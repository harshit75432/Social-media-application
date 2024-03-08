let socket = io()
let getUserId = document.getElementById('userId')
let notificationBtn = document.getElementById('notification-btn')
let notification = io('/notification')
let totalNotification = document.getElementById('total-notification')
let user_id = getUserId.dataset.user_id
console.log(user_id);
notification.emit('notification',{user_id:user_id})
notification.on('notification',function(notifications){
    if(notifications.length>0){
        console.log('asvhsa');
        totalNotification.innerHTML = notifications.length
    }else{
        console.log('asvhsa');
        totalNotification.style.display = 'none'
    }
})
let unseenMessage = document.getElementById('unseen')
let data = io('/online',{
    auth : {
        user_id : user_id
    }
})

socket.on('unseen-message',data=>{
    for(let i=0;i<data.friends_details.length;i++){
        for(let j=0;j<data.chats.length;j++){
            if(data.chats[j].reply_id == data.friends_details[i].friend_id){
                unseenMessage.innerText = chats.length
            }
        }
    }
})