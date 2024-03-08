let messageIcon = document.getElementById('message-icon')
let messageDiv = document.getElementById('message-div') 
let getUserId = document.getElementById('take-detail')
let messageDisplay = true
let notifications = document.getElementById('notification')
let totalNotification = document.getElementById('total-notification')
let notificationBtn = document.getElementById('notification-btn')

let user_id = getUserId.dataset.user_id
console.log(user_id);
let socket = io()

let notification = io('/notification')

notification.emit('notification',{user_id:user_id})

let data = io('/online',{
    auth : {
        user_id : user_id
    }
})


socket.on('notification',(notify)=>{
    console.log(notify.notifications.length);
    let count = 0
    
    if(notify.status == true && user_id == notify.friend_id){
        
        if(notify.notifications.length>0){
            console.log('notification come');
            count = notify.notifications.length
            totalNotification.style.display = 'block'
            totalNotification.innerHTML = Number(count)-1 
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

socket.on('accept-request-notification',data=>{
 

    console.log('request');
    console.log('kbsvkb')
    if(data.status && user_id == data.friend_id ){  
        console.log('aschjsdv');
        console.log(totalNotification);
        if(data.notilength > 0){
            totalNotification.innerHTML = ''
            totalNotification.innerHTML = Number(data.notilength)-1
            totalNotification.style.display = 'block'
        }else{
            totalNotification.style.display = 'none'
               }
        let display = {
            status : true,
            user_id : ownId
        }
        socket.emit('display-notification',display)
    }
})
socket.on('request notification',data=>{
    console.log('request');
    console.log('kbsvkb')
    if(data.status  && user_id == data.friend_id){  
        console.log('aschjsdv');
        console.log(totalNotification);
        if(data.notilength > 0){
            totalNotification.innerHTML = ''
            totalNotification.innerHTML = Number(data.notilength)-1
            totalNotification.style.display = 'block'
        }else{
            totalNotification.style.display = 'none'
               }
        let display = {
            status : true,
            user_id : ownId
        }
        socket.emit('display-notification',display)
    }
})

