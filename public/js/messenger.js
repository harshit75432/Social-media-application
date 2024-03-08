const socket = io();
let form  = document.getElementById('message-form')
let input = document.getElementById('input')
let sendBtn = document.getElementById('send-message')
let messageList = document.getElementById('message-list')
let uploadImages = document.getElementById('upload')
let notificationBtn = document.getElementById('notification-btn')
let myDiv = document.getElementById("messager-list")
let typing=false
let seen = false
let  timeout=undefined
let totalNotification = document.getElementById('total-notification')
console.log(totalNotification);
myDiv.scrollIntoView(false);
let user_id = ''
let friend_id = ''
let messageStatus = 'Text'
uploadImages.onclick=()=>{
    console.log('photo');
    messageStatus = 'photo'    
}
console.log(document.getElementById('get-userId').dataset.friend_id);
let notification = io('/notification')


form.onsubmit=(e)=>{
   e.preventDefault()
   sendBtn.onclick=()=>{
     user_id = sendBtn.dataset.user_id
     friend_id = sendBtn.dataset.friend_id
    console.log(user_id);
    if(messageStatus == 'Text'){
        if(input.value){
            let msgObject = {
                user_id : user_id,
                message : input.value,
                date : Date.now(),
                friend_id : friend_id,
                images : [],
                type : 'only-text',
                status : false
            }
           let notification = {
                friend_id : friend_id,
                status : true
            }
            socket.emit('chat message',msgObject);
            socket.emit('notification',notification)
                const xhr = new XMLHttpRequest();
                xhr.open("POST", '', true);

                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

                xhr.onreadystatechange = () => {
                    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                        const res = JSON.parse(xhr.response)
                        if(res){
                           
                        }
                    }
                }

                let json = JSON.stringify({
                    type : 'text',
                    user_id : user_id,
                    friend_id : friend_id,
                    message : input.value,
                    time : Date.now(),
                    status : false
                });

                xhr.send(json);
            input.value='';
        }else{
            console.log('sdvgajv');
            console.log(uploadImages.files.length);
            if(uploadImages.files.length > 0){
                let promisesArray = []
                for(let i = 0; i < uploadImages.files.length; i++){
                    let promise = new Promise((resolve,reject)=>{
                        let xhr = new XMLHttpRequest()
                        xhr.open('POST','/upload',true)
                        xhr.onreadystatechange= () => {
                            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                                const res = JSON.parse(xhr.response)
                                if(res.url){
                                    resolve(res.url)
                                }else{
                                    reject()
                                }
                            }
                        }
    
                        let data = new FormData()
                        data.append('file',uploadImages.files[i])
                        xhr.send(data)
    
                    })
                        promisesArray.push(promise)   
                    }
                    Promise.all(promisesArray).then((values)=>{
                        messagePics(values,input.value,user_id,friend_id)
                    })
                }
            }
    }else{
        console.log('sdvgajv');
        console.log(uploadImages.files.length);
        if(uploadImages.files.length > 0){
            let promisesArray = []
            for(let i = 0; i < uploadImages.files.length; i++){
                let promise = new Promise((resolve,reject)=>{
                    let xhr = new XMLHttpRequest()
                    xhr.open('POST','/upload',true)
                    xhr.onreadystatechange= () => {
                        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                            const res = JSON.parse(xhr.response)
                            if(res.url){
                                resolve(res.url)
                            }else{
                                reject()
                            }
                        }
                    }

                    let data = new FormData()
                    data.append('file',uploadImages.files[i])
                    xhr.send(data)

                })
                    promisesArray.push(promise)   
                }
                Promise.all(promisesArray).then((values)=>{
                    messagePics(values,input.value,user_id,friend_id)
                })
            }
            messageStatus = 'Text'
            uploadImages.value = ''  
        }
    }
}
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

socket.on('chat message',(msgObject)=>{
    let item = document.createElement('li')
    if(user_id == msgObject.user_id){
        console.log('reply');
        item.classList.add('repaly')
       
      
        let imageDiv = document.createElement('div')
        let img = document.createElement('img')
        if(msgObject.type == 'Photo'){
        
            img.style.width = '200px'
            img.src = msgObject.images[0]
            if(msgObject.msg != ''){
                let paragraph = document.createElement('p')
                paragraph.innerHTML = msgObject.msg
                item.appendChild(paragraph)
            }
       
        }else{
            console.log('kjvhskvdb');
            let paragraph = document.createElement('p')
            paragraph.innerHTML = msgObject.msg
            item.appendChild(paragraph)
        }
            imageDiv.appendChild(img)
        
        let span = document.createElement('span')
        span.classList.add("time")
      
        span.innerHTML = msgObject.date + `<i id="checkid" class="bi bi-check2-all"></i>`
        
        item.appendChild(imageDiv)
        item.appendChild(span)
        messageList.appendChild(item)
        var myDiv = document.getElementById("messager-list");
        myDiv.scrollIntoView(false);
       
    }
  
    if(user_id == msgObject.friend_id || friend_id != msgObject.friend_id){
        
        console.log('sender');
        item.classList.add('sender')
        
    
        let imageDiv = document.createElement('div')
        let img = document.createElement('img')
        if(msgObject.type == 'Photo'){
            console.log('image part');
            img.src = msgObject.images[0]
            img.style.width = '200px'
            console.log(msgObject.images[0]);
            console.log(img);
            if(msgObject.msg != ''){
                let paragraph = document.createElement('p')
                paragraph.innerHTML = msgObject.msg
                item.appendChild(paragraph)
            }
           
        }else{
            let paragraph = document.createElement('p')
            paragraph.innerHTML = msgObject.msg
            item.appendChild(paragraph)
        }
            
        let span = document.createElement('span')
        span.classList.add("time")
        imageDiv.appendChild(img)
        span.innerHTML = msgObject.date 
        item.appendChild(imageDiv)
        item.appendChild(span)
        messageList.appendChild(item)
        
        myDiv.scrollIntoView(false);
        socket.emit('seen',{seen : true})
    }
})

socket.on('seen',data=>{
    if(data.seen){
        document.getElementById('checkid').style.color = 'blue'
    }
})


$(document).ready(function(){
    let getUserDetails = document.getElementById('get-userId')
    user_id = getUserDetails.dataset.user_id
    friend_id = getUserDetails.dataset.friend_id
    console.log(user_id);
    console.log(friend_id);
    $('#input').keypress((e)=>{
      if(e.which!=13){
        typing=true
        socket.emit('typing', {typing:true,user_id:user_id,friend_id:friend_id})
        timeout=setTimeout(typingTimeout, 1000)
        clearTimeout(timeout)
        
      }else{
        clearTimeout(timeout)
        typingTimeout()
        //sendMessage() function will be called once the user hits enter
        
      }
    })
    
    socket.on('notification',(notify)=>{
        console.log(notify.notifications.length);
        let count = 0
        if(notify.notifications.length>0 && user_id == notify.friend_id){
            count = Number(notify.notifications.length)-1
            totalNotification.innerText = Number(count) 
        }else{
            if(user_id == notify.friend_id){
                totalNotification.innerHTML = count-1
            }
        }
    })
    socket.on('display', (data)=>{
        console.log(data.friend_id);
        console.log(data.user_id);
        if(data.typing==true && user_id == data.friend_id){
            console.log(user_id);
                console.log('come');               
                setTimeout( $('.typing').text(` is typing...`),1000)
                typingTimeout()
            }else{
            $('.typing').text("")
        }
      })
})

function typingTimeout(){
    console.log('timeout');
    setTimeout(()=>{
        typing=false
        socket.emit('typing', {typing:false})

    },3000)
}

function messagePics(images,message,userId,friendId){
    console.log('sdchjsvb');
    let msgObject = {
        user_id : user_id,
        message : input.value,
        date : Date.now(),
        friend_id : friend_id,
        images : images,
        status : false,
        type : 'Photo',
    }
    socket.emit('chat message',msgObject);
    
    const xhr = new XMLHttpRequest();
    xhr.open("POST", '', true);

    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        
        }
    }

    let json = JSON.stringify({
        type : 'text-photo',
        user_id : userId,
        friend_id : friendId,
        message : message,
        time : Date.now(),
        images : images,
        status : false
    });

    xhr.send(json);
}

jQuery(document).ready(function() {


    $(".chat-icon").click(function() {
        $(".chatbox").removeClass('showbox');
    });


});