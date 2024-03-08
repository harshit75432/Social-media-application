let notificationDivs = document.getElementById('notification-details') 
let notifyStatus = true


notificationBtn.onclick=()=>{

  
    console.log('Click'+ Date.now());
    console.log('display prop',notificationDivs.style.display);
    if (notificationDivs.style.display =='none'){
        console.log('show n');


        notificationStatus = 
        {
            status : true,
            user_id : user_id      
        }
    socket.emit('display-notification',notificationStatus)

    socket.on('display-notification',data=>{

        if(user_id == data.receiver_id && data.notification_length>0){
            totalNotification.style.display =='none'
            createNotificationDiv(data)
            console.log('sdigvas');
            const xhr = new XMLHttpRequest();
            xhr.open("POST", '', true);
        
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        
            xhr.onreadystatechange = () => {
                if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    const res = JSON.parse(xhr.response)
                    if(res.status){
                              
                    }
                }
            }
        
            let json = JSON.stringify({
                type : 'notification-change',
                user_id : user_id,
            });
        
            xhr.send(json);
        }else{
            console.log('jsadvbsjv');
            let notificationDiv = document.createElement('div')
            notificationDiv.classList.add('p-3','rounded-3','d-flex','flex-column')
            notificationDiv.style.backgroundColor = 'white'
            notificationDiv.style.position = 'absolute'
            notificationDiv.style.width = '300px'
            notificationDiv.style.top = '70px'
            notificationDiv.style.right = '20px'
            notificationDivs.style.display = 'block'
            notificationDiv.innerHTML = ''
            notificationDivs.innerHTML = ''
            let span = document.createElement('span')
            span.style.fontWeight = '500'
            span.innerHTML = 'No new Notification'
            notificationDiv.appendChild(span)
            notificationDivs.appendChild(notificationDiv)
            notificationDivs.style.display = 'block'
            totalNotification.style.display =='none' 
        }

    })

    // XHR to update status of notification
  
    
    }
    else{
        console.log('display is block');
        document.getElementById('total-notification').innerHTML=''
        notificationDivs.style.display =='none'
        totalNotification.style.display =='none'
    }      
      
}


function createNotificationDiv(data){
    console.log('enter in div');
    let notificationDiv = document.createElement('div')
    notificationDiv.classList.add('p-3','rounded-3','d-flex','flex-column')
    notificationDiv.style.backgroundColor = 'white'
    notificationDiv.style.position = 'absolute'
    notificationDiv.style.width = '300px'
    notificationDiv.style.top = '70px'
    notificationDiv.style.right = '20px'
    notificationDivs.style.display = 'block'
    notificationDiv.innerHTML = ''

for(let i=0; i<data.user_details.length;i++){
    if(data.user_details[i].type == 'message'){
        let detailDiv = document.createElement('div')
    
            detailDiv.classList.add('d-flex','align-items-center','mt-2')
            detailDiv.innerHTML = `
                <img src="${data.user_details[i].pic ? data.user_details[i].pic : '/images/profile-pic.png'}" width="35px" height="35px" style="border-radius: 50%; object-fit:cover;" alt="">
            
                <span class="ms-2" style="font-weight: 500;font-size: 14px;width: 180px;">${data.user_details[i].name} sent you message.</span>
                <span style="font-size: 10px ;">${data.user_details[i].time}</span>
            `
            notificationDiv.appendChild(detailDiv)
    }else if(data.user_details[i].type == 'request'){
        let detailDiv = document.createElement('div')
    
        detailDiv.classList.add('d-flex','align-items-center','mt-2')
        detailDiv.innerHTML = `
            <img src="${data.user_details[i].pic ? data.user_details[i].pic : '/images/profile-pic.png'}" width="35px" height="35px" style="border-radius: 50%; object-fit: cover;" alt="" >
        
            <span class="ms-2" style="font-weight: 500;font-size: 14px;width: 180px;">${data.user_details[i].name} send you request.</span>
            <span style="font-size: 10px ;">${data.user_details[i].time}</span>
        `
        notificationDiv.appendChild(detailDiv)
    }else if(data.user_details[i].type == 'accept'){
        let detailDiv = document.createElement('div')
    
        detailDiv.classList.add('d-flex','align-items-center','mt-2')
        detailDiv.innerHTML = `
            <img src="${data.user_details[i].pic ? data.user_details[i].pic : '/images/profile-pic.png'}" width="35px" height="35px" style="border-radius: 50%; object-fit: cover;" alt="" >
        
            <span class="ms-2" style="font-weight: 500;font-size: 14px;width: 180px;">${data.user_details[i].name} accept your request.</span>
            <span style="font-size: 10px ;">${data.user_details[i].time}</span>
        `
        notificationDiv.appendChild(detailDiv)
    }else if(data.user_details[i].type == 'like'){
        let detailDiv = document.createElement('div')
    
        detailDiv.classList.add('d-flex','align-items-center','mt-2')
        detailDiv.innerHTML = `
            <img src="${data.user_details[i].pic ? data.user_details[i].pic : '/images/profile-pic.png'}" width="35px" height="35px" style="border-radius: 50%; object-fit: cover;" alt="" >
        
            <span class="ms-2" style="font-weight: 500;font-size: 14px;width: 180px;">${data.user_details[i].name} liked your post.</span>
            <span style="font-size: 10px ;">${data.user_details[i].time}</span>
        `
        notificationDiv.appendChild(detailDiv)
    }else if(data.user_details[i].type == 'tag'){
        let detailDiv = document.createElement('div')
    
        detailDiv.classList.add('d-flex','align-items-center','mt-2')
        detailDiv.innerHTML = `
            <img src="${data.user_details[i].pic ? data.user_details[i].pic : '/images/profile-pic.png'}" width="35px" height="35px" style="border-radius: 50%; object-fit: cover;"  alt="">
        
            <span class="ms-2" style="font-weight: 500;font-size: 14px;width: 180px;">${data.user_details[i].name} tagged you in his post.</span>
            <span style="font-size: 10px ;">${data.user_details[i].time}</span>
        `
        notificationDiv.appendChild(detailDiv)
    }else{
        let detailDiv = document.createElement('div')
    
        detailDiv.classList.add('d-flex','align-items-center','mt-2')
        detailDiv.innerHTML = 'Not Found'
    }
    }
        notificationDivs.appendChild(notificationDiv)
        notificationDivs.style.display =='block'


}

function updateNotificationDiv(status){
    if(status){
        notificationDivs.style.display = 'none'
    }else{
        notificationDivs.style.display = 'block'
    }

}


document.addEventListener('click', function(event) {
    var isClickInside = notificationDivs.contains(event.target);
    if (isClickInside) {
        notificationDivs.style.display = 'block'
    }
    else {
        notificationDivs.style.display = 'none'
    }
});