let messageIcon = document.getElementById('message-icon')
let messageDiv = document.getElementById('message-div') 
let messageDisplay = true
let notifications = document.getElementById('notification')
console.log(user_id);


socket.on('notification',(notify)=>{
    console.log(notify.notifications.length);
    let count = 0
    
    if(notify.status == true && user_id == notify.friend_id){
        if(notify.notifications.length>0){
            count = notify.notifications.length
            totalNotification.style.display = 'block'
            totalNotification.innerHTML = Number(count) 
        }else{
            totalNotification.style.display = 'none'

        }
    }else{
        console.log('error');
    }
})
notification.on('notification',function(notifications){
    if(notifications.length>0){   
        totalNotification.innerHTML = notifications.length
    }else{
        totalNotification.style.display = 'none'
    }
})




messageIcon.onclick=()=>{
    if(messageDisplay){
        messageDiv.style.display = 'block'
        messageDisplay = false
    }else{
        messageDiv.style.display = 'none'
        messageDisplay = true
    }   
}

