let replyBtnForm = document.getElementById('reply-btn-form')
let uploadBtn = document.getElementById('upload-btn') 
let uploadANewPhoto = document.getElementById('upload-a-new-photo')
let fileUpload = document.getElementById('file')
let removeBtn = document.getElementById('remove-btn')
let uploadImage = document.getElementById('upload-img')
let formUpload = document.getElementById('upload-form')
let updateBtn = document.getElementById('update-btn')
let image_status = 'empty'
let allFriendTab = document.getElementById('friends-tab')
let suggestionTab = document.getElementById('friend-suggestions')
let requestsSection = document.getElementById('request-section')
let suggestionsSection = document.getElementById('suggestion-section')
let imageIcon = document.getElementById('image-section')
let textAreaPost = document.getElementById('text-area') 
let postBtn = document.getElementById('post-btn')
let uploadIcon = document.getElementById('upload-icon')
let photoSelect = document.getElementById('select-photo')
let uploadPostForm = document.getElementById('upload-post')
let closeBtn = document.getElementById('close-btn')
let commentForms = document.querySelectorAll('.comment-form')
let postPhotos = document.querySelectorAll('.post-images')
let seeMore = document.querySelectorAll('.see-more')
let commentText = document.querySelectorAll('.comment-text')
let commentBtn = document.querySelectorAll('.comment-btn')
let commentIconBtns = document.querySelectorAll('.comment-icon')
let commentLikeBtn = document.querySelectorAll('.comment-like-btn')
let commentReplyBtn = document.querySelectorAll('.reply-btn')
let replyBtnComment = document.querySelectorAll('.reply-btn-comment')
let commentDiv = document.querySelectorAll('comment-div')
let viewMoreBtn = document.querySelectorAll('.view-more-btn')
let multiplePostFiles = document.querySelector('#select-photo')
let textPhotoPost = document.getElementById('text-photo-post')
let notificationBtn = document.getElementById('notification-btn')
let totalNotification = document.getElementById('total-notification')
let getUserId = document.getElementById('take-detail')
let user_id = getUserId.dataset.user_id
let deletePosts = document.querySelectorAll('.delete-post')
let taggedPeoples = document.querySelectorAll('.tagged-people')
let socket = io()
let data = io('/online',{
    auth : {
        user_id : user_id
    }
})
let notification = io('/notification')

notification.emit('notification',{user_id:user_id})

socket.on('notification',(notify)=>{
    console.log(notify.notifications.length);
    let count = 0
    
    if(notify.status == true && user_id == notify.friend_id){
        if(notify.notifications.length>0){
            count = notify.notifications.length
            totalNotification.style.display = 'block'
            totalNotification.innerHTML = Number(count) 
        }else{
            totalNotification.style.display = 'block'
            totalNotification.innerHTML = count+1
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



postPhotos.forEach((image)=>{
    image.onclick=()=>{
        let postId = image.id.split('-')[3]
        const xhr = new XMLHttpRequest();
    xhr.open("POST", '', true);
    
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
           const res = JSON.parse(xhr.response)
           let photosSection = document.getElementById('photos-section')
           photosSection.innerHTML = ''
           
           console.log(res.post);
           for(let i=0;i<res.post.post_pics.length;i++){
               let photoDiv = document.createElement('div')
                photoDiv.id = `photo-${i}`
                photoDiv.innerHTML=`
                        <img id="post-image-${i}" class="post-images mt-2" src="${ res.post.post_pics[i] }" height="80%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
               `
               photosSection.appendChild(photoDiv)
           }
        }
    }

    let json = JSON.stringify({
       postId : postId,
       type : 'post-images'
   });
  
    xhr.send(json);
    }
})


allFriendTab.onclick=()=>{
    const xhr = new XMLHttpRequest();
    xhr.open("POST", '', true);
    
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
           const res = JSON.parse(xhr.response)
           if(res.status){
                let friendSection = document.getElementById('friend-section-tab')

                
                let friends = res.friends
                 
                friendSection.innerHTML = ''
              
                if(friends.length>0){
                    for(let i=0;i<friends.length;i++){
                        let friendDiv = document.createElement('div')
                        friendDiv.classList.add('col-md-6','d-flex','justify-content-between','p-3','rounded','border-design')
                        friendDiv.style.border = '1px solid rgb(246, 244, 244)'
                        friendDiv.innerHTML = `
                        
                        <div>
                            <img src="${friends[i].image ? friends[i].image : '/images/profile-pic.png' }" width="100px" height="90px" alt="" style="border-radius: 5px;object-fit: cover;">
                            <span class="mx-2" style="font-size: 20px; font-weight: 500;"> ${ friends[i].name }</span>
                        </div>
                        <div class="dropdown d-flex align-items-center">
                                                        
                                                        <i class="d-flex align-items-center justify-content-end bi bi-three-dots " data-bs-toggle="dropdown" aria-expanded="false"></i>     
                                                        <ul class="dropdown-menu">
                                                        <li><a class="dropdown-item" href="#"><i class="bi bi-star me-2"></i>Favourites</a></li>
                                                        <li><a class="dropdown-item" href="#"> <i class="bi bi-person-fill-gear me-2"></i>Edit Friend List</a></li>
                                                        <li><a class="dropdown-item" href="#"><i class="bi bi-file-x-fill me-2"></i>Unfollow</a></li>
                                                        <li><a class="dropdown-item" href="#"><i class="bi bi-person-x me-2"></i>Unfriend</a></li>
                                                        </ul>
                                                    </div>
                        `
                      
                        
                              friendSection.appendChild(friendDiv)
                    }
                    
                
                }
           }
        }
    }

    let json = JSON.stringify({
        type : 'all-friend-tab'
   });
  
    xhr.send(json);
}





viewMoreBtn.forEach((btn)=>{
    btn.onclick=()=>{
        
        let postId = btn.id.split('-')[2]
        console.log(btn.id.split('-')[2]);
        
    const xhr = new XMLHttpRequest();
    xhr.open("POST", '', true);

    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let res = JSON.parse(xhr.response)
            console.log(res);
            if(res.post){
                console.log('recived');
                let post = res.post
                console.log(post.id);
                let user_details = res.user_details
                let postImage1 = ''
                let postImage2 = ''
                let postImage3 = ''
                let postImage4 = ''
                let replyDiv = ''
                let commentDiv = ''
                let extra = ''
                let users_details = res.users_details

                let postSection = document.getElementById('modal-post-section')
                postSection.innerHTML = ""
                let postDiv = document.createElement('div')
                postDiv.classList.add('d-flex','flex-column','rounded')
                postDiv.style.backgroundColor = 'white'

                console.log(post);
               
                let modalHeader = `
                <div class="d-flex align-items-center justify-content-between border-bottom py-2" >
                    <h2 class="mx-5"></h2>
                    <h5 class="modal-title">${ user_details.first_name + ' ' + user_details.last_name+"'s" } post</h5>
                    <button type="button" class="btn-close d-flex justify-content-end" data-bs-dismiss="modal" aria-label="Close" style="margin-left: 120px;"></button>
                </div>`

                let postHeader = `
                <div  class="d-flex flex-column rounded p-2" style="background-color: white;">
                                        
                    <div class="d-flex justify-content-between">
                        <div>
                            <img src="/images/person_pic.jpg" alt="" width="35px" height="35px" style="border-radius: 50%; margin-right: 8px;">
                            <span  style="font-weight: 500; font-size: 14px;">Harshit Saxena</span>
                        </div>
                        <i class="bi bi-three-dots"></i>
                    </div>
                    <div class='title'>
                        <p id="paragraph-${postId}" class="title mt-3">
                            ${post.title}
                        </p>
                    </div>        
                    `

                     if(post.post_pics.length-1 == 0){ 
                 postImage1 =`
            <div class="row">
            <img id="post-image-${0}-${post._id}" class="post-images" src="${post.post_pics[0]}" alt="" height="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
         `           }

                    if(post.post_pics.length-1 == 1){
                        postImage2 = ` <div  class="row gx-2" style="height: 300px;">
                           <div class="col-sm-6 ">
                               <img id="post-image-${ 0 }-${post._id}" class="post-images" src="${ post.post_pics[0] }" height="100%" width="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
                           </div>
                           <div class="col-md-6">
                               <img id="post-image-${ 1 }-${post._id}" class="post-images" src="${ post.post_pics[1] }" height="100%" alt="" width="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
                           </div>
                       </div>
                       `
                     } 

                    
                    if(post.post_pics.length-1 == 2){
                        postImage3 = `
                         <div class="row g-2">
                            <div class="col-md-6">
                                <img id="post-image-${ 0 }-${post._id}" class="post-images" src="${ post.post_pics[0] }" height="100%" width="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
                            </div>
                            <div class="col-md-6">
                                <div class="d-flex flex-column">
                                    <div class="mb-2">
                                        <img id="post-image-${ 0 }-${post._id}" class="post-images" src="${ post.post_pics[1] }" height="50%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                    </div>
                                    <div>
                                        <img id="post-image-${ 1 }-${post._id}" class="post-images" src="${ post.post_pics[2] }" height="50%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                    </div>
                                </div>
                            </div>
                        </div>
`
                        }

                   if(post.post_pics.length-1 > 2){
                    postImage4 = `
                    <div class="row g-2">
                        <div class="col-md-6">
                            <img id="post-image-${ 0 }-${post._id}" class="post-images" src="${ post.post_pics[0] }" height="100%" width="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex flex-column">
                                <div class="mb-2">
                                    <img id="post-image-${ 1 }-${post._id}" class="post-images" src="${ post.post_pics[1] }" height="50%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                </div>
                                <div style="position: relative;">
                                    <img id="post-image-${ 2 }-${post._id}" class="post-images" src="${ post.post_pics[2] }" height="50%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                    <div id="post-image-${ 3 }-${post._id}" class="d-flex justify-content-center align-items-center post-images" style="position : absolute; background:rgba(0, 0, 0, 0.4); bottom: 0px; right: 2px; height: 100%; width: 100%; cursor: pointer;" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                        <div class="d-flex justify-content-center align-items-center">
                                            <div class="d-flex align-items-end">
                                                <i class="bi bi-plus-lg fs-6 " style="z-index: 1; -webkit-text-stroke: 1px; color: white; margin-bottom: 7px;"></i>
                                                <span style="font-size: 30px; font-weight: 600; color: white; ">${ post.post_pics.length-3 }</span>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                    }
                  let extraPostHeader = `
                  
                  <div class="mt-3" style="border-bottom: 1px solid lightgray;"></div>                  
                  <div class="d-flex align-items-center">
      
                      <span id="like-${postId}" class="btn w-100 d-flex align-items-center justify-content-center like-btn" data-like-status="${post.likes.includes(user_details.user_id)}">
                          <i id="remove-like-${postId}" class="bi bi-hand-thumbs-up me-2 fs-5 " style="display:${post.likes.includes(user_details.user_id) ? 'none' : 'block'  };"></i>
                          <i id="liked-${postId}" class="bi bi-hand-thumbs-up-fill me-2 fs-5 text-primary" style="display:${post.likes.includes(user_details.user_id) ? 'block' : 'none'};"></i>Like</span>

                  
                      <span id="comment-btn-${postId}" class="btn w-100 d-flex align-items-center justify-content-center comment-icon"><i class="bi bi-chat me-2 fs-5"></i>Comment</span>
                      <span class="btn w-100 d-flex align-items-center justify-content-center share-icon"><i class="bi bi-share-fill me-2 fs-5"></i>Share</span>
                  </div> 
                  <div style="border-bottom: 1px solid lightgray;"></div>
                  <div id="comment-section-${postId}" class="mt-2 d-flex flex-column">
                  `               
    
                for(let j=0;j<post.comments.length;j++){
                    
                    let commentItem = ` 
                       <div class='d-flex mt-2'>
                        <img class="p-2" src="${users_details[post.comments[j].user_id].profile_pic ? users_details[post.comments[j].user_id].profile_pic : '/images/profile-pic.png'}" alt="" width="42px" height="42px" style="border-radius: 50%;">
                        <div class="d-flex flex-column">   
                            <div class="d-flex flex-column p-3" style="background-color: #edf2f4; border-radius: 15px;">
                                <span style="font-weight: 500; font-size:13px;">${users_details[post.comments[j].user_id].name} </span>
                                <span class="comment-text">${post.comments[j].comment}</span>    
                            </div>
                            <div class="d-flex p-1 mx-2">
                                <span id="comment-like-${j}" class="btn comment-like-btn" style="font-size: 10px; font-weight: bold;">Like</span>
                                <span id="reply-${postId}-${post.comments[j].id}" class="btn reply-btn" style="font-size: 10px; font-weight: bold;">Reply</span>
                            </div>
                        </div>
                        <div id="reply-div-${post.comments[j].id}" class="mx-3 mb-3" style="display:none">
                            <form id="reply-form-${ post.comments[j].id }" class="reply-form" action="" method="post">
                                <div class="d-flex align-items-center mt-2">
                                    <img src="${ user_details.profile_pic ? user_details.profile_pic :  '/images/profile-pic.png' }" alt="" width="25px" height="25px" style="border-radius: 50%; ">
                                    <input id="reply-input-${post.comments[j].id}" class="form-control mx-2 comment-text p-3" placeholder="Write a comment..."  type="text" required style="border-radius: 20px; background-color: #e9ecef; height: 50px;">
                                    <button id="reply-btn-${post.comments[j].id}" class="btn" type="submit"><i class="bi bi-send"></i></button>
                                </div>
                            </form>
                        </div>
                    </div>
                    
`   
    replyDiv = ''
        if(post.comments[j].replies.length>0){
            
            for(let k=0;k<post.comments[j].replies.length;k++){
                console.log(k);
                let replyItem = `
                <div class="d-flex mx-5">
                    <img class="p-2" src="${users_details[post.comments[j].replies[k].user_id].profile_pic ? users_details[post.comments[j].replies[k].user_id].profile_pic : '/images/profile-pic.png'}" alt="" width="42px" height="42px" style="border-radius: 50%;">
                    <div class="d-flex flex-column">   
                        <div class="d-flex flex-column p-3" style="background-color: #edf2f4; border-radius: 15px;">
                            <span style="font-weight: 500; font-size:13px;">${users_details[post.comments[j].replies[k].user_id].name} </span>
                            <span class="comment-text">${post.comments[j].replies[k].comment}</span>    
                        </div>
                        <div class="d-flex p-1 mx-2">
                            <span id="comment-like-${j}" class="btn comment-like-btn" style="font-size: 10px; font-weight: bold;">Like</span>
                            <span id="reply-${postId}-${post.comments[j].replies[k].id}" class="btn reply-btn" style="font-size: 10px; font-weight: bold;">Reply</span>
                        </div>
                  </div>
                 </div>
                `
                
                replyDiv = replyItem + replyDiv
           
            }       
        }
        
                    let commentPlusReply = commentItem + replyDiv
                    commentDiv += commentPlusReply      
                }
                let footer = `
                
                </div>
                      </div>  
                        </div>
                        </div>
                            <form id="reply-form-${ postId }" method="post">
                                <div class="d-flex align-items-center mt-2">
                                    <img src="${ user_details.profile_pic ? user_details.profile_pic :  '/images/profile-pic.png' }" alt="" width="25px" height="25px" style="border-radius: 50%; ">
                                    <input id="reply-input-${postId}" class="form-control mx-2 comment-text p-3" placeholder="Write a comment..."  type="text" required style="border-radius: 20px; background-color: #e9ecef; height: 26px;">
                                    <button id="reply-btn-${postId}" class="btn" type="submit"><i class="bi bi-send"></i></button>
                                </div>
                            </form>
                        </div>
                </div
               
                `

                postDiv.innerHTML = modalHeader + postHeader + postImage1 + postImage2 + postImage3 + postImage4 + extraPostHeader  + commentDiv + footer

                postSection.appendChild(postDiv)


                let replyBtns = document.querySelectorAll('.reply-btn')
                replyBtns.forEach((btn)=>{
                    btn.onclick=()=>{
                        let id = btn.id.split('-')[2]
                        let replyDiv = document.getElementById('reply-div-'+id)
                        let replyInput = document.getElementById('reply-input-'+id)
                        replyDiv.style.display = 'block'
                        replyInput.focus()
                    }
                })

                let replyForms = document.getElementById(`reply-form-${postId}`)
                replyForms.onsubmit=(e)=>{
                    e.preventDefault()
                   
                    let replyInput = document.getElementById(`reply-input-${postId}`).value
                   
                        console.log('reply form come');
                            console.log(replyInput);
                           
                            console.log('ajsdvbs');
                          
                   
                            console.log(replyInput,'sucygasvuy');
                            const xhr = new XMLHttpRequest();
                            xhr.open("POST", '', true);
                            
                            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                            
                            xhr.onreadystatechange = () => {
                                if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                                    let res = JSON.parse(xhr.response)
                                  if(res.added){
                                    console.log('reply recived');
                                    document.getElementById(`view-more-${postId}`).click()
                                    document.getElementById(`reply-input-${postId}`).value = ''
                                  }
                                }
                            }
                        
                            let json = JSON.stringify({
                               type : "comment-reply",
                               comment :  replyInput,
                               postId : postId
                           });
                          
                            xhr.send(json);

                    
                    
                    }
              
              

                postPhotos = document.querySelectorAll('.post-images')
                postPhotos.forEach((image)=>{
                    image.onclick=()=>{
                        let postId = image.id.split('-')[3]
                        const xhr = new XMLHttpRequest();
                    xhr.open("POST", '', true);
                    
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    
                    xhr.onreadystatechange = () => {
                        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                           const res = JSON.parse(xhr.response)
                           let photosSection = document.getElementById('photos-section')
                           photosSection.innerHTML = ''
                           
                           console.log(res.post);
                           for(let i=0;i<res.post.post_pics.length;i++){
                               let photoDiv = document.createElement('div')
                                photoDiv.id = `photo-${i}`
                                photoDiv.innerHTML=`
                                        <img id="post-image-${i}" class="post-images mt-2" src="${ res.post.post_pics[i] }" height="80%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                               `
                               photosSection.appendChild(photoDiv)
                           }
                        }
                    }
                
                    let json = JSON.stringify({
                       postId : postId,
                       type : 'post-images'
                   });
                  
                    xhr.send(json);
                    }
                })
                commentIconBtns = document.querySelectorAll('.comment-icon')

                commentIconBtns.forEach((btn)=>{
                    btn.onclick=()=>{
                        console.log('comment');
                        let id = btn.id.split('-')[2]
                        console.log(id);
                        let commentInput = document.getElementById('comment-input-'+id)
                        
                        commentInput.focus()
                    }
                })

          
            }
        }
    }

    let json = JSON.stringify({
        type : 'view-more',
        postId : postId
    });

    xhr.send(json);
    }
})
    replyBtnComment.forEach((btn)=>{
        btn.onclick=()=>{
            let postId = btn.id.split('-')[2]
            let commentId = btn.id.split('-')[3]
    
            let reply = document.getElementById('reply-text-'+ postId + '-' + commentId).value
            
            const xhr = new XMLHttpRequest();
            xhr.open("POST", '', true);
    
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    
            xhr.onreadystatechange = () => {
                if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    let res = JSON.parse(xhr.response)
                    if(res.replied){
    
                    }
                }
            }
    
            let json = JSON.stringify({
                type : 'reply-comment',
                reply : reply,
                postId : postId,
                commentId : commentId
            });
    
            xhr.send(json);
                    }
    
    })

   


    commentReplyBtn.forEach((btn)=>{
        btn.onclick=()=>{
            let post_id = btn.id.split('-')[1]
            let comment_id = btn.id.split('-')[2]
            console.log(post_id);
            console.log(comment_id);
            document.getElementById('comment-reply-'+ post_id + '-' + comment_id).style.display = 'block'
            
        }
    })
  
    commentIconBtns.forEach((btn)=>{

        btn.onclick=()=>{
            console.log('comment');
            let id = btn.id.split('-')[2]
            console.log(id);
            let commentInput = document.getElementById('comment-input-'+id)
            
            commentInput.focus()
        }
    })

    seeMore.forEach((btn)=>{
        btn.onclick=()=>{
            id = btn.id.split('-')[2]
            document.getElementById('paragraph-'+id).className = ' asca'
            document.getElementById('see-more-'+id).style.display = 'none'
            document.getElementById('paragraph-'+id).style.marginTop = '18px'
            document.getElementById('paragraph-'+id).style.lineHeight = '1.4'
            let titleHeight = document.getElementById('paragraph-'+id).offsetHeight
        let lineHeight = parseFloat(document.getElementById('paragraph-'+id).style.lineHeight)
        let lines = titleHeight / lineHeight
        console.log(lines,titleHeight,lineHeight);
        console.log(titleHeight,document.getElementById('paragraph-'+id).style,lines)
        if(lines >= 3){
            btn.style.display = 'block'
        }
            
        }
    })
    uploadANewPhoto.onclick = ()=>{   
        file.click()   
    }


    let requestsTab = document.getElementById('request-tab')

// suggestionTab.onclick

    requestsTab.onclick = () =>{
        console.log('request');
    const xhr = new XMLHttpRequest();
    xhr.open("POST",'', true);

    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        const res = JSON.parse(xhr.response)
            console.log(res.friend_requests);
            let requests = res.friend_requests

            requestsSection.innerHTML = ''
            for(i=0; i<requests.length; i++){
                let requestsDiv = document.createElement('div')
                requestsDiv.id = 'request-'+ requests[i]
                requestsDiv.classList.add('col-lg-3','col-md-4','col-sm-6','card')
                requestsDiv.style.boxShadow = '2px 4px lightgray'
                requestsDiv.innerHTML = `
                <img src="${requests[i].profile_pic ? requests[i].profile_pic : '/images/profile-pic.png'}" class="card-img-top" alt="..." style="object-fit : cover; height:150px;">
                <div class="card-body">
                    <h5 class="card-title" style="font-size:14px;">${res.names[i]}</h5>
                
                    <button id="accept-${requests[i]}" class="btn btn-primary btn-sm w-100 mb-2 confirm-btn" >Confirm</button>
                    <button id="decline-${requests[i]}" class="btn btn-secondary btn-sm w-100 decline-btn">Decline</button>
                </div>
    `

                requestsSection.appendChild(requestsDiv)

        }
            let acceptBtn = document.querySelectorAll('.confirm-btn')
            acceptBtn.forEach((btn)=>{
                btn.addEventListener('click',()=>{
                    console.log('confirm');
                    let id = btn.id.split('-')[1]
                    console.log(id)
                        const xhr = new XMLHttpRequest();
        xhr.open("POST", '', true);
        
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        
        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let res = JSON.parse(xhr.response)
            if(res.accepted){
                console.log('hello')
                let requestInformation = {
                    status : true,
                    user_id : user_id,
                    friend_id : id,
                    date : Date.now,
                }
                socket.emit('accept-request-notification',requestInformation)
                    document.getElementById('request-' + id).remove()
            
                }
            }
        }

        let json = JSON.stringify({
        type : 'accept',
        id
    });
    
        xhr.send(json);
                
                })
            })
            
            let declineBtn = document.querySelectorAll('.decline-btn')
            declineBtn.forEach((btn)=>{
                btn.addEventListener('click',()=>{
                 
                    let id = btn.id.split('-')[1]
                    console.log(id);
                    const xhr = new XMLHttpRequest();
            xhr.open("POST", '', true);
            
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            
            xhr.onreadystatechange = () => {
                if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                const res = JSON.parse(xhr.response)
                if(res.declined){
                        document.getElementById('request-' + id).remove()
                }
                }
            }

            let json = JSON.stringify({
            type : 'decline',
            id
            });
        
            xhr.send(json);
                    })
                })
            
            }
        }

        let json = JSON.stringify({
        type : 'requests'
        });

        xhr.send(json);
    }

    suggestionTab.onclick=()=>{
        
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '', true);
        
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        
        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            const res = JSON.parse(xhr.response)
            suggestionsSection.innerHTML = ''
         
                let users = res.users
                for(let i=0;i<users.length;i++){

                    let suggestionDiv = document.createElement('div')
                    suggestionDiv.classList.add('col-lg-3','col-md-4','col-sm-6','item')
                console.log(users[i]._id);
                    suggestionDiv.id = 'suggestion-'+ users[i]._id
                    suggestionDiv.innerHTML = ` 
                    <div class="card-body mb-3 w-100">
                    <div class="d-flex justify-content-start align-items-center w-100">
                    <div class=" mx-3" style="width: 4rem;">
                    <img src="${users[i].profile_pic ? users[i].profile_pic :'/images/profile-pic.png'}" class="card-img-top" alt="..."  style="border-radius:50%; height:60px; width:60px; object-fit:cover">
                    
                </div>
                <div class="d-flex flex-column">

                    <div class="flex-column mb-2">
                    <small class="card-title mx-2 fw-bold">${ users[i].first_name } ${ users[i].last_name }</small>
                    </div>
                    <div class="d-flex justify-content-center align-items-center">
                    <button id="send-${ users[i]._id }" type="submit"  class="btn btn-primary btn-sm ms-2 mx-2 add-btn" style="display: block; min-width:70px; font-size:11px">Add friend</button>
                    <button id="request-${ users[i]._id }" class="btn btn-secondary btn-sm ms-2 mx-2 request-send-btn" style="display: none; min-width: none;">Request Sent</button>
                    <button id="remove-${ users[i]._id }"  class="btn btn-sm remove-btn" style="background-color: #D3D3D3;display:block;">Remove</a>
                    <button id="cancel-${ users[i]._id }" class="btn btn-sm cancel-btn" style="background-color: #D3D3D3; display: none; ">Cancel</button>
                    </div>
                    
                    </div>
                    </div>
                
                </div>
                `
                suggestionsSection.appendChild(suggestionDiv)
                }

                requestbtns = document.querySelectorAll('.add-btn')
                requestbtns.forEach((btn)=>{
                    console.log('hello');
                    btn.addEventListener('click',()=>{  
                        let id = btn.id.split('-')[1]
                        let requestNotification = {
                            user_id : user_id,
                            friend_id : id,
                            status : true,
                            date : Date.now()
                        }
                        socket.emit('request notification',requestNotification)
                        sendRequest(id)
                    })
                })

                cancelBtns = document.querySelectorAll('.cancel-btn')
                cancelBtns.forEach((btn)=>{
                    btn.addEventListener('click',()=>{
                        let id = btn.id.split('-')[1]
                        cancelRequest(id)
                    })
                })

                removeBtns = document.querySelectorAll('.remove-btn')
                removeBtns.forEach((button)=>{
                button.addEventListener('click',()=>{
                let id = button.id.split('-')[1]
                document.getElementById('suggestion-'+id).remove()
                    })    
                }) 
                
        }
    }

    let json = JSON.stringify({
        type : 'suggestion'
    });

    xhr.send(json);
    }

    fileUpload.onchange = ()=>{
        let fr = new FileReader()
        fr.onload = function(){
            uploadImage.src = fr.result
        }
        fr.readAsDataURL(event.target.files[0])
        image_status = 'changed'
        uploadImage.style.display = 'block'
        uploadANewPhoto.style.display = 'block'  
        updateBtn.style.display = 'block'
        removeBtn.style.display = 'block'
    
    }

    removeBtn.onclick = ()=>{
        fileUpload.value = null
        image_status = 'delete'
        uploadImage.src = '/images/profile-pic.png'
        updateBtn.style.display = 'block'
        image_status = 'delete'
    }

    formUpload.onsubmit = (e)=>{
        e.preventDefault()

        
        if(image_status == 'empty'){
            uploadPhotosInProfile('','empty')
        }
    
        if(image_status == 'delete'){
            console.log('delete')
            uploadPhotosInProfile('','delete')   
        }

        if(image_status == 'changed'){
            console.log('changed')
            const xhr = new XMLHttpRequest();
            xhr.open("POST", '/upload', true);
            xhr.onreadystatechange = () => {
                if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    const res = JSON.parse(xhr.response)
                    if(res.url){
                        uploadPhotosInProfile(res.url,'changed')
                    }
                }
            }

        let data = new FormData()
            data.append('file',file.files[0])
            xhr.send(data);

        }
    }

    function uploadPhotosInProfile(url,type){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '', true);
        
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        
        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            const res = JSON.parse(xhr.response)
            if(res.updated){
                window.location.href = window.location.href
            }
            }
        }

        let json = JSON.stringify({
        profile_pic : url,
        type : type
    });
    
        xhr.send(json);
    }

    let likeBtn = document.querySelectorAll('.like-btn');

    likeBtn.forEach((btn) => {
        btn.onclick = () => {
            let id = btn.id.split('-')[1];
            let likeStatus = btn.dataset.likeStatus;
            console.log(likeStatus);
            
            const xhr = new XMLHttpRequest();
            xhr.open("POST", '', true);

            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        const res = JSON.parse(xhr.response);
                        if (res.liked) {
                            console.log('liked');
                           
                            
                            document.getElementById('remove-like-' + id).style.display = 'none';
                            document.getElementById('liked-' + id).style.display = 'block';
                            likeStatus = 'true'; 
                            btn.dataset.likeStatus = 'true';
                        } else if (res.unliked) {
                            console.log('unliked');
                            
                            
                            document.getElementById('remove-like-' + id).style.display = 'block';
                        
                            document.getElementById('liked-' + id).style.display = 'none';
                            likeStatus = 'false';
                            btn.dataset.likeStatus = 'false'; 
                        }
                    }
                }
            };

            let json = JSON.stringify({
                type: likeStatus === 'false' ? 'like' : 'unlike',
                postId: id,
            });

            xhr.send(json);
        }
    });


    let commentsDiv = document.querySelectorAll('comment-div')
    commentsDiv.forEach((item)=>{
        commentId = item.id.split('-')[1]
    })

          commentForms.forEach((form)=>{
                let postId = form.id.split('-')[2]
                form.onsubmit=(e)=>{
                  e.preventDefault()
                  let comment = document.getElementById('comment-input-'+postId).value 
                  const xhr = new XMLHttpRequest();
                  xhr.open("POST", '', true);
                  
                  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                  
                  xhr.onreadystatechange = () => {
                      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                          const res = JSON.parse(xhr.response)
                          if(res.added){
                               console.log('response come');
                              document.getElementById(`view-more-${postId}`).click()
                              document.getElementById('comment-input-'+postId).value = ''
                          }
                      }
                  }
              
                  let json = JSON.stringify({
                      type : 'comment',       
                      comment : comment,
                      postId : postId,
                  });
                  
                  xhr.send(json);
              }
          })
            
     
    let postStatus = 'only-text'
    textAreaPost.onchange = ()=>{     
        
          console.log('JAVCHJA');  
            console.log(textAreaPost.value);
            if(textAreaPost.value.length > 0){
                postBtn.disabled = false
                postBtn.style.cursor = 'pointer'
                postBtn.style.backgroundColor = '#0000FF'
                postBtn.style.color = 'white'
                
            }else{
                postBtn.style.backgroundColor = 'blue' 
                postBtn.disabled = true 
                postBtn.style.backgroundColor = "#e9ecef"
                postBtn.style.color = 'black'
            }
    }

    imageIcon.onclick=()=>{
        console.log('hasdgjch');
        postStatus = 'photos-text'
        
      
        document.getElementById('text-area').style.fontSize = '16px'
        document.getElementById('photo-section').style.display = 'block'
        photoSelect.required = true
        let postImagesDiv = document.getElementById('photo-sections')
        photoSelect.onchange=()=>{
            if(postStatus == 'photos-text'){
                for(let i=0;i<photoSelect.files.length;i++){
                    let fr = new FileReader()
                    fr.onload = function(){
                            let imagesDiv = document.createElement('div')
                            imagesDiv.id = `image-${i}`
                            imagesDiv.style.position = 'relative'
                            imagesDiv.innerHTML=`    
                            <img id="post-upload-image-${i}" width="100%" height="100%" src="${fr.result}" alt="" style=" object-fit: fill;">
                            <span id="remove-btn-post-${i}" class="btn btn-sm btn-light remove-btn-post" style="position:absolute; right:5px;"><i class="bi bi-x fs-3"></i></span>
                            `
                            postImagesDiv.appendChild(imagesDiv)
                            let removeImagePosts = document.querySelectorAll('.remove-btn-post')
                             removeImagePosts.forEach((btn)=>{
                                 let id = btn.id.split('-')[3]
                                 btn.onclick=()=>{
                                     
                                     document.getElementById('photo-section').style.display = 'block'
                                     document.getElementById('span-text').style.display = 'block'
                                     document.getElementById('upload-icon-div').style.display = 'block'
                                     document.getElementById('cross-icon').style.display = 'block'
                                     document.getElementById('post-image').style.display = 'block'
                                     document.getElementById('photo-section').style.height = '200px'
                                    
                                     document.getElementById('image-'+id).remove()
                                     postBtn.disabled = true
                                 }
                             
                             })
                        }
                        fr.readAsDataURL(event.target.files[i])
                    }
                    postBtn.disabled = false
                    postBtn.style.cursor = 'pointer'
                    postBtn.style.background = 'blue'
                    postBtn.style.color = 'white'
    
                    
                 
                    
                    textAreaPost.required = false
                    
                    document.getElementById('span-text').style.display = 'none'
                    document.getElementById('upload-icon-div').style.display = 'none'
                    document.getElementById('cross-icon').style.display = 'none'
                    document.getElementById('post-image').style.display = 'none'
                             
            }else{
                
                textAreaPost.onchange = ()=>{     
                    if(postStatus == 'only-text'){
                        if(textAreaPost.value.length > 0){
                            postBtn.disabled = false
                            postBtn.style.cursor = 'pointer'
                            postBtn.style.backgroundColor = '#0000FF'
                            postBtn.style.color = 'white'
                        }else{
                            postBtn.style.backgroundColor = 'blue' 
                            postBtn.disabled = true 
                            postBtn.style.backgroundColor = "#e9ecef"
                            postBtn.style.color = 'black'
                        }
                    }
                }
            }  
        }
        
    }
        

    document.getElementById('cross').onclick=()=>{
        document.getElementById('photo-section').style.display = 'none'
        document.getElementById('text-area').style.display = 'block'
       
        document.getElementById('select-photo').required = false
        console.log(postStatus);
        postStatus = ''
        console.log(postStatus);
    }
  

    uploadIcon.onclick=()=>{
        photoSelect.value = null
        photoSelect.click()
    }
        
    uploadPostForm.onsubmit = (e)=>{
        e.preventDefault()
        console.log(postStatus);      
        if(postStatus == 'only-text'){
            console.log('acacasa');
            console.log(textAreaPost.value);
            let postTitleTest = textAreaPost.value
            postTitle('only-text',postTitleTest)
            
            textAreaPost.value = ''

        }else{
            console.log('hello');
            
            
            let postPics = []
            // let pics = new Promise((resolve,reject)=> {
            //     if(photoSelect.value.length > 0){
            //         resolve(postPics.push(photoSelect.value))
            //     }else{
            //         reject('err')
            //     }
            // }) 
            // console.log(postPics);
            // for(let i=0;i<postPics.length;i++){
            //     Promise.all([postPics[i]]).then((value)=>{
            //         data.append('postFiles',value)
                    
            //     })
            // }

            if(photoSelect.files.length > 0){
                let promisesArray = []
                for(let i = 0; i < photoSelect.files.length; i++){
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
                        data.append('file',photoSelect.files[i])
                        xhr.send(data)

                    })
                        promisesArray.push(promise)   
                    }
                    Promise.all(promisesArray).then((values)=>{
                        postPic('text-photos',values,textAreaPost.value)
                    })
                }
            

            // let pics = 
        }
    }
    
    
  

    function postPic(type,urls,title){
        console.log('post');
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '', true);
        
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        
        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
               const res = JSON.parse(xhr.response)
               if(res.received){
                console.log(res.post);
                    console.log('posted');
                    closeBtn.click()
                    document.getElementById('photo-section').style.display = 'none'
                    document.getElementById('text-area').style.fontSize = '20px'
                    document.getElementById('text-area').value = ''
                    let postSection = document.getElementById('post-section')
                    let i = postSection.children.length +1
                    let postDiv = document.createElement('div')
                    postDiv.id = `post-div-${res.post._id}` 
                    postDiv.classList.add('d-flex','flex-column','mt-3','rounded','p-3')
                    postDiv.style.backgroundColor ='white'
                    postDiv.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.10)'
                    let totalItems = ''
                    let postHeader = `
                      
                                    
                    <div class="d-flex justify-content-between">
                        <div class="d-flex align-items-center">
                            <img src="${ res.user.profile_pic ? res.user.profile_pic : '/images/profile-pic.png' }" alt="" width="35px" height="35px" style="border-radius: 50%; margin-right: 8px; object-fit: cover;">
                            <div class="d-flex flex-column">
                                <span  style="font-weight: 500; font-size: 14px;">${ res.user.first_name} ${ res.user.last_name }</span>
                                <span style="font-size: 12px;">${res.date}</span>
                            </div>
                        </div>
                        <div class="dropdown">
                        <i class="bi bi-three-dots" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" style="cursor: pointer;"></i>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                          <li><a id="delete-${ res.post._id }" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#delete-post-${ res.post._id }">Delete</a></li>
                        </ul>
                      </div>
                    </div>
                      
                                          
                      

                          <p id="paragraph-${i}" class=" mt-3 title">
                              ${title}
                              <span id="see-more-${ i }" class="see-more" style="border: none; font-weight: 600; cursor: pointer; display: none;">See more</span>
                          </p>
                      

                      <div class="row">`
                      let postPhotoItem = ''
                          if(urls.length-1 == 0){ 
                            postPhotoItem =   `<img id="post-image-${ 0 }-${res.post._id}" class="post-images" src="${ urls[0] }" alt="" height="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">`
                           } 

                         if(urls.length-1 == 1){ 
                            postPhotoItem =    `<div  class="row gx-2" style="height: 300px;">
                                  <div class="col-sm-6 ">
                                      <img id="post-image-${ 0 }-${res.post._id}" class="post-images" src="${ urls[0] }" height="100%" width="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                  </div>
                                  <div class="col-sm-6">
                                      <img id="post-image-${ 1 }-${res.post._id}" class="post-images" src="${ urls[1] }" height="100%" alt="" width="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                  </div>
                              </div> `
                          } 

                          
                          if(urls.length-1 == 2){
                            postPhotoItem =  `<div class="row g-2">
                                  <div class="col-sm-6">
                                      <img id="post-image-${ 0 }-${res.post._id}" class="post-images" src="${ urls[0] }" height="100%" width="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                  </div>
                                  <div class="col-sm-6">
                                      <div class="d-flex flex-column">
                                          <div class="mb-2">
                                              <img id="post-image-${ 0 }-${res.post._id}" class="post-images" src="${ urls[1] }" height="50%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                          </div>
                                          <div>
                                              <img id="post-image-${ 1 }-${res.post._id}" class="post-images" src="${ urls[2] }" height="50%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                          </div>
                                      </div>
                                  </div>
                              </div>`
                              
                          }

                         if(urls.length-1 > 2){ 
                            postPhotoItem =  `<div class="row g-2">
                              <div class="col-sm-6">
                                  <img id="post-image-${ 0 }-${res.post._id}" class="post-images" src="${ urls[0] }" height="100%" width="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
                              </div>
                              <div class="col-sm-6">
                                  <div class="d-flex flex-column">
                                      <div class="mb-2">
                                          <img id="post-image-${ 1 }-${res.post._id}" class="post-images" src="${ urls[1] }" height="50%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                      </div>
                                      <div style="position: relative;">
                                          <img id="post-image-${ 2 }-${res.post._id}" class="post-images" src="${urls[2] }" height="50%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                          <div id="post-image-${ 3 }-${res.post._id}" class="d-flex justify-content-center align-items-center post-images" style="position : absolute; background:rgba(0, 0, 0, 0.4); bottom: 0px; right: 2px; height: 100%; width: 100%; cursor: pointer;" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                              <div class="d-flex justify-content-center align-items-center">
                                                  <div class="d-flex align-items-end">
                                                      <i class="bi bi-plus-lg fs-6 " style="z-index: 1; -webkit-text-stroke: 1px; color: white; margin-bottom: 7px;"></i>
                                                      <span style="font-size: 30px; font-weight: 600; color: white; ">${ urls.length-3 }</span>
                                                  </div>

                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>`
                          }
    let bootomIcons = `               
                      </div>
                      


                          
                          
              <div class="mt-3" style="border-bottom: 1px solid lightgray;"></div>                  
                  <div class="d-flex align-items-center">
          
                          <span id="like-${ res.post._id }" class="btn w-100 d-flex align-items-center justify-content-center like-btn" data-like-status="${ res.post.likes.includes(res.user._id) }">
                          <i id="remove-like-${res.post._id}" class="bi bi-hand-thumbs-up me-2 fs-5 " style="display:${res.post.likes.includes(res.user._id) ? 'none' : 'block'  };"></i>
                          <i id="liked-${res.post._id}" class="bi bi-hand-thumbs-up-fill me-2 fs-5 text-primary" style="display:${res.post.likes.includes(res.user._id) ? 'block' : 'none'}"></i>Like</span>

                      
                      <span id="comment-btn-${res.post._id}" class="btn w-100 d-flex align-items-center justify-content-center comment-icon"><i class="bi bi-chat me-2 fs-5"></i>Comment</span>
                      <span class="btn w-100 d-flex align-items-center justify-content-center share-icon"><i class="bi bi-share-fill me-2 fs-5"></i>Share</span>
                  </div> 
              
              
                                  
              

              <div style="border-bottom: 1px solid lightgray;"></div>
             `  
             
             let commentSection = ''        
             if(res.post.comments.length > 2){ 
                 for(let h=res.post.comments.length-1;h>res.post.comments.length-3;h--){ 
                commentSection = `    <div class="mt-4 d-flex align-items-center">
                <img src="/images/person_pic.jpg" width="25px" height="25px" alt="" style=" border-radius: 50%; object-fit:cover">
                <span id="view-mores-${res.post._id}" class="p-2 text-start mx-2 rounded-4" style="color: black; font-weight: 400; background-color: #e9ecef;">${res.post.comments[h].comment}</span>
            </div>`
                 }
                 let spanBtn = `<span id="view-more-${res.post._id}" class="veiw-comments btn view-more-btn" style="color: gray; font-weight: 400;" data-bs-toggle="modal" data-bs-target="#view-more">View more comments</span>`
                 commentSection = commentSection + spanBtn
                   }else if(res.post.comments.length-1 < 2 && res.post.comments.length-1 > 0 ){ 
                     for(let h=res.post.comments.length-1;h>res.post.comments.length-3;h--){
                    commentSection = `<span id="view-more-${res.post._id}" class="veiw-comments btn view-more-btn" style="color: gray; font-weight: 400;" data-bs-toggle="modal" data-bs-target="#view-more"></span>
                    <div class="mt-4 d-flex align-items-center">
                         <img src="/images/person_pic.jpg" width="25px" height="25px" alt="" style=" border-radius: 50%; object-fit:cover">
                         <span id="view-mores-${res.post._id}" class="p-2 text-start mx-2 rounded-2" style="color: black; font-weight: 400; background-color: #e9ecef;">${res.post.comments[h].comment}</span>
                     </div>`
                     }
                 }else{
                    commentSection = `<span id="view-more-${res.post._id}" class="veiw-comments btn view-more-btn" style="color: gray; font-weight: 400;" data-bs-toggle="modal" data-bs-target="#view-more"></span>`
                 } 
         let CommentFormItem = `             
              <form id="comment-form-${ res.post._id }" class="comment-form" action="" method="post">
              <div class="d-flex align-items-center mt-2">
                      <img src="${ res.user.profile_pic ? res.user.profile_pic :  '/images/profile-pic.png' }" alt="" width="25px" height="25px" style="border-radius: 50%; object-fit: cover;8">
                      <input id="comment-input-${res.post._id}" class="form-control mx-2 comment-text p-3" placeholder="Write a comment..."  type="text" required style="border-radius: 20px; background-color: #e9ecef; height: 26px;">
                      <button id="comment-btn-${res.post._id }" class="btn" type="submit"><i class="bi bi-send"></i></button>
                  </div>
              </form>
  
            
                      `
             let modal = `
             <div id="delete-post-${ res.post._id }" class="modal" tabindex="-1">
             <div class="modal-dialog modal-dialog-centered">
               <div class="modal-content">
                 <div class="modal-header">
                   <h5 class="modal-title">Delete Post</h5>
                   <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                 </div>
                 <div class="modal-body">
                   <p>Are you sure you want to delete this post?</p>
                 </div>
                 <div class="modal-footer">
                   <button id="delete-post-close-${ res.post._id }" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                   <button id="delete-post-${ res.post._id }" type="button" class="btn btn-danger delete-post">Delete</button>
                 </div>
               </div>
             </div>
           </div>
             
             `         
                      postDiv.innerHTML = postHeader + postPhotoItem + bootomIcons + commentSection + CommentFormItem + modal
                      postSection.prepend(postDiv) 
                      
                  let deletePosts = document.getElementById(`delete-post-${ res.post._id}`)
                  deletePosts.onclick=()=>{
                    let post_id = res.post._id
                    
                const xhr = new XMLHttpRequest();
                xhr.open("DELETE", `postdelete/${post_id}`, true);
            
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            
                xhr.onreadystatechange = () => {
                    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                        const res = JSON.parse(xhr.response)
                        if(res.status){
                            document.getElementById(`delete-post-close-${post_id}`).click()
                            document.getElementById(`post-div-${post_id}`).remove()
                        }
                    }
                }
            
                xhr.send();
                } 

                let commentForms = document.getElementById(`comment-form-${res.post._id}`)
                commentForms.onsubmit=(e)=>{
                    e.preventDefault()
                    let post_id = res.post._id
                    let comment = document.getElementById('comment-input-'+post_id).value 
                    const xhr = new XMLHttpRequest();
                    xhr.open("POST", '', true);
                    
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    
                    xhr.onreadystatechange = () => {
                        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                            const res = JSON.parse(xhr.response)
                            if(res.added){
                                 console.log('response come');
                                document.getElementById(`view-more-${post_id}`).click()
                                document.getElementById('comment-input-'+post_id).value = ''
                            }
                        }
                    }
                
                    let json = JSON.stringify({
                        type : 'comment',       
                        comment : comment,
                        postId : post_id,
                    });
                    
                    xhr.send(json);
                }

                let viewMoreBtn = document.getElementById(`view-more-${res.post._id}`)
                viewMoreBtn.onclick=()=>{
        
                    let postId = res.post._id
                    
                    
                const xhr = new XMLHttpRequest();
                xhr.open("POST", '', true);
            
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            
                xhr.onreadystatechange = () => {
                    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                        let res = JSON.parse(xhr.response)
                        console.log(res);
                        if(res.post){
                            console.log('recived');
                            let post = res.post
                            console.log(post.id);
                            let user_details = res.user_details
                            let postImage1 = ''
                            let postImage2 = ''
                            let postImage3 = ''
                            let postImage4 = ''
                            let replyDiv = ''
                            let commentDiv = ''
                            let extra = ''
                            let users_details = res.users_details
            
                            let postSection = document.getElementById('modal-post-section')
                            postSection.innerHTML = ""
                            let postDiv = document.createElement('div')
                            postDiv.classList.add('d-flex','flex-column','rounded')
                            postDiv.style.backgroundColor = 'white'
            
                            console.log(post);
                           
                            let modalHeader = `
                            <div class="d-flex align-items-center justify-content-between border-bottom py-2" >
                                <h2 class="mx-5"></h2>
                                <h5 class="modal-title">${ user_details.first_name + ' ' + user_details.last_name+"'s" } post</h5>
                                <button type="button" class="btn-close d-flex justify-content-end" data-bs-dismiss="modal" aria-label="Close" style="margin-left: 120px;"></button>
                            </div>`
            
                            let postHeader = `
                            <div  class="d-flex flex-column rounded p-2" style="background-color: white;">
                                                    
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <img src="/images/person_pic.jpg" alt="" width="35px" height="35px" style="border-radius: 50%; margin-right: 8px;">
                                        <span  style="font-weight: 500; font-size: 14px;">Harshit Saxena</span>
                                    </div>
                                    <i class="bi bi-three-dots"></i>
                                </div>
                                <div class='title'>
                                    <p id="paragraph-${postId}" class="title mt-3">
                                        ${post.title}
                                    </p>
                                </div>        
                                `
            
                                 if(post.post_pics.length-1 == 0){ 
                             postImage1 =`
                        <div class="row">
                        <img id="post-image-${0}-${post._id}" class="post-images" src="${post.post_pics[0]}" alt="" height="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
                     `           }
            
                                if(post.post_pics.length-1 == 1){
                                    postImage2 = ` <div  class="row gx-2" style="height: 300px;">
                                       <div class="col-sm-6 ">
                                           <img id="post-image-${ 0 }-${post._id}" class="post-images" src="${ post.post_pics[0] }" height="100%" width="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                       </div>
                                       <div class="col-md-6">
                                           <img id="post-image-${ 1 }-${post._id}" class="post-images" src="${ post.post_pics[1] }" height="100%" alt="" width="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                       </div>
                                   </div>
                                   `
                                 } 
            
                                
                                if(post.post_pics.length-1 == 2){
                                    postImage3 = `
                                     <div class="row g-2">
                                        <div class="col-md-6">
                                            <img id="post-image-${ 0 }-${post._id}" class="post-images" src="${ post.post_pics[0] }" height="100%" width="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                        </div>
                                        <div class="col-md-6">
                                            <div class="d-flex flex-column">
                                                <div class="mb-2">
                                                    <img id="post-image-${ 0 }-${post._id}" class="post-images" src="${ post.post_pics[1] }" height="50%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                                </div>
                                                <div>
                                                    <img id="post-image-${ 1 }-${post._id}" class="post-images" src="${ post.post_pics[2] }" height="50%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
            `
                                    }
            
                               if(post.post_pics.length-1 > 2){
                                postImage4 = `
                                <div class="row g-2">
                                    <div class="col-md-6">
                                        <img id="post-image-${ 0 }-${post._id}" class="post-images" src="${ post.post_pics[0] }" height="100%" width="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                    </div>
                                    <div class="col-md-6">
                                        <div class="d-flex flex-column">
                                            <div class="mb-2">
                                                <img id="post-image-${ 1 }-${post._id}" class="post-images" src="${ post.post_pics[1] }" height="50%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                            </div>
                                            <div style="position: relative;">
                                                <img id="post-image-${ 2 }-${post._id}" class="post-images" src="${ post.post_pics[2] }" height="50%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                                <div id="post-image-${ 3 }-${post._id}" class="d-flex justify-content-center align-items-center post-images" style="position : absolute; background:rgba(0, 0, 0, 0.4); bottom: 0px; right: 2px; height: 100%; width: 100%; cursor: pointer;" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                                    <div class="d-flex justify-content-center align-items-center">
                                                        <div class="d-flex align-items-end">
                                                            <i class="bi bi-plus-lg fs-6 " style="z-index: 1; -webkit-text-stroke: 1px; color: white; margin-bottom: 7px;"></i>
                                                            <span style="font-size: 30px; font-weight: 600; color: white; ">${ post.post_pics.length-3 }</span>
                                                        </div>
            
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                `
                                }
                              let extraPostHeader = `
                              
                              <div class="mt-3" style="border-bottom: 1px solid lightgray;"></div>                  
                              <div class="d-flex align-items-center">
                  
                                  <span id="like-${postId}" class="btn w-100 d-flex align-items-center justify-content-center like-btn" data-like-status="${post.likes.includes(user_details.user_id)}">
                                      <i id="remove-like-${postId}" class="bi bi-hand-thumbs-up me-2 fs-5 " style="display:${post.likes.includes(user_details.user_id) ? 'none' : 'block'  };"></i>
                                      <i id="liked-${postId}" class="bi bi-hand-thumbs-up-fill me-2 fs-5 text-primary" style="display:${post.likes.includes(user_details.user_id) ? 'block' : 'none'};"></i>Like</span>
            
                              
                                  <span id="comment-btn-${postId}" class="btn w-100 d-flex align-items-center justify-content-center comment-icon"><i class="bi bi-chat me-2 fs-5"></i>Comment</span>
                                  <span class="btn w-100 d-flex align-items-center justify-content-center share-icon"><i class="bi bi-share-fill me-2 fs-5"></i>Share</span>
                              </div> 
                              <div style="border-bottom: 1px solid lightgray;"></div>
                              <div id="comment-section-${postId}" class="mt-2 d-flex flex-column">
                              `               
                
                            for(let j=0;j<post.comments.length;j++){
                                
                                let commentItem = ` 
                                   <div class='d-flex mt-2'>
                                    <img class="p-2" src="${users_details[post.comments[j].user_id].profile_pic ? users_details[post.comments[j].user_id].profile_pic : '/images/profile-pic.png'}" alt="" width="42px" height="42px" style="border-radius: 50%;">
                                    <div class="d-flex flex-column">   
                                        <div class="d-flex flex-column p-3" style="background-color: #edf2f4; border-radius: 15px;">
                                            <span style="font-weight: 500; font-size:13px;">${users_details[post.comments[j].user_id].name} </span>
                                            <span class="comment-text">${post.comments[j].comment}</span>    
                                        </div>
                                        <div class="d-flex p-1 mx-2">
                                            <span id="comment-like-${j}" class="btn comment-like-btn" style="font-size: 10px; font-weight: bold;">Like</span>
                                            <span id="reply-${postId}-${post.comments[j].id}" class="btn reply-btn" style="font-size: 10px; font-weight: bold;">Reply</span>
                                        </div>
                                    </div>
                                    <div id="reply-div-${post.comments[j].id}" class="mx-3 mb-3" style="display:none">
                                        <form id="reply-form-${ post.comments[j].id }" class="reply-form" action="" method="post">
                                            <div class="d-flex align-items-center mt-2">
                                                <img src="${ user_details.profile_pic ? user_details.profile_pic :  '/images/profile-pic.png' }" alt="" width="25px" height="25px" style="border-radius: 50%; ">
                                                <input id="reply-input-${post.comments[j].id}" class="form-control mx-2 comment-text p-3" placeholder="Write a comment..."  type="text" required style="border-radius: 20px; background-color: #e9ecef; height: 50px;">
                                                <button id="reply-btn-${post.comments[j].id}" class="btn" type="submit"><i class="bi bi-send"></i></button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                
            `   
                replyDiv = ''
                    if(post.comments[j].replies.length>0){
                        
                        for(let k=0;k<post.comments[j].replies.length;k++){
                            console.log(k);
                            let replyItem = `
                            <div class="d-flex mx-5">
                                <img class="p-2" src="${users_details[post.comments[j].replies[k].user_id].profile_pic ? users_details[post.comments[j].replies[k].user_id].profile_pic : '/images/profile-pic.png'}" alt="" width="42px" height="42px" style="border-radius: 50%;">
                                <div class="d-flex flex-column">   
                                    <div class="d-flex flex-column p-3" style="background-color: #edf2f4; border-radius: 15px;">
                                        <span style="font-weight: 500; font-size:13px;">${users_details[post.comments[j].replies[k].user_id].name} </span>
                                        <span class="comment-text">${post.comments[j].replies[k].comment}</span>    
                                    </div>
                                    <div class="d-flex p-1 mx-2">
                                        <span id="comment-like-${j}" class="btn comment-like-btn" style="font-size: 10px; font-weight: bold;">Like</span>
                                        <span id="reply-${postId}-${post.comments[j].replies[k].id}" class="btn reply-btn" style="font-size: 10px; font-weight: bold;">Reply</span>
                                    </div>
                              </div>
                             </div>
                            `
                            
                            replyDiv = replyItem + replyDiv
                       
                        }       
                    }
                    
                                let commentPlusReply = commentItem + replyDiv
                                commentDiv += commentPlusReply      
                            }
                            let footer = `
                            
                            </div>
                                  </div>  
                                    </div>
                                    </div>
                                        <form id="reply-form-${ postId }" method="post">
                                            <div class="d-flex align-items-center mt-2">
                                                <img src="${ user_details.profile_pic ? user_details.profile_pic :  '/images/profile-pic.png' }" alt="" width="25px" height="25px" style="border-radius: 50%; ">
                                                <input id="reply-input-${postId}" class="form-control mx-2 comment-text p-3" placeholder="Write a comment..."  type="text" required style="border-radius: 20px; background-color: #e9ecef; height: 26px;">
                                                <button id="reply-btn-${postId}" class="btn" type="submit"><i class="bi bi-send"></i></button>
                                            </div>
                                        </form>
                                    </div>
                            </div
                           
                            `
            
                            postDiv.innerHTML = modalHeader + postHeader + postImage1 + postImage2 + postImage3 + postImage4 + extraPostHeader  + commentDiv + footer
            
                            postSection.appendChild(postDiv)
            
            
                            let replyBtns = document.querySelectorAll('.reply-btn')
                            replyBtns.forEach((btn)=>{
                                btn.onclick=()=>{
                                    let id = btn.id.split('-')[2]
                                    let replyDiv = document.getElementById('reply-div-'+id)
                                    let replyInput = document.getElementById('reply-input-'+id)
                                    replyDiv.style.display = 'block'
                                    replyInput.focus()
                                }
                            })
            
                            let replyForms = document.getElementById(`reply-form-${postId}`)
                            replyForms.onsubmit=(e)=>{
                                e.preventDefault()
                               
                                let replyInput = document.getElementById(`reply-input-${postId}`).value
                               
                                    console.log('reply form come');
                                        console.log(replyInput);
                                       
                                        console.log('ajsdvbs');
                                      
                               
                                        console.log(replyInput,'sucygasvuy');
                                        const xhr = new XMLHttpRequest();
                                        xhr.open("POST", '', true);
                                        
                                        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                                        
                                        xhr.onreadystatechange = () => {
                                            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                                                let res = JSON.parse(xhr.response)
                                              if(res.added){
                                                console.log('reply recived');
                                                document.getElementById(`view-more-${postId}`).click()
                                                document.getElementById(`reply-input-${postId}`).value = ''
                                              }
                                            }
                                        }
                                    
                                        let json = JSON.stringify({
                                           type : "comment-reply",
                                           comment :  replyInput,
                                           postId : postId
                                       });
                                      
                                        xhr.send(json);
            
                                
                                
                                }
                          
                          
            
                            postPhotos = document.querySelectorAll('.post-images')
                            postPhotos.forEach((image)=>{
                                image.onclick=()=>{
                                    let postId = image.id.split('-')[3]
                                    const xhr = new XMLHttpRequest();
                                xhr.open("POST", '', true);
                                
                                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                                
                                xhr.onreadystatechange = () => {
                                    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                                       const res = JSON.parse(xhr.response)
                                       let photosSection = document.getElementById('photos-section')
                                       photosSection.innerHTML = ''
                                       
                                       console.log(res.post);
                                       for(let i=0;i<res.post.post_pics.length;i++){
                                           let photoDiv = document.createElement('div')
                                            photoDiv.id = `photo-${i}`
                                            photoDiv.innerHTML=`
                                                    <img id="post-image-${i}" class="post-images mt-2" src="${ res.post.post_pics[i] }" height="80%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                           `
                                           photosSection.appendChild(photoDiv)
                                       }
                                    }
                                }
                            
                                let json = JSON.stringify({
                                   postId : postId,
                                   type : 'post-images'
                               });
                              
                                xhr.send(json);
                                }
                            })
                            commentIconBtns = document.querySelectorAll('.comment-icon')
            
                            commentIconBtns.forEach((btn)=>{
                                btn.onclick=()=>{
                                    console.log('comment');
                                    let id = btn.id.split('-')[2]
                                    console.log(id);
                                    let commentInput = document.getElementById('comment-input-'+id)
                                    
                                    commentInput.focus()
                                }
                            })
            
                      
                        }
                    }
                }
            
                let json = JSON.stringify({
                    type : 'view-more',
                    postId : postId
                });
            
                xhr.send(json);
                }

                let likeBtn = document.getElementById(`like-${res.post._id}`)
                likeBtn.onclick = () => {
                    let id = res.post._id;
                    let likeStatus = likeBtn.dataset.likeStatus;
                    console.log(likeStatus);
                    
                    const xhr = new XMLHttpRequest();
                    xhr.open("POST", '', true);
        
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status === 200) {
                                const res = JSON.parse(xhr.response);
                                if (res.liked) {
                                    console.log('liked');
                                   
                                    
                                    document.getElementById('remove-like-' + id).style.display = 'none';
                                    document.getElementById('liked-' + id).style.display = 'block';
                                    likeStatus = 'true'; 
                                    likeBtn.dataset.likeStatus = 'true';
                                } else if (res.unliked) {
                                    console.log('unliked');
                                    
                                    
                                    document.getElementById('remove-like-' + id).style.display = 'block';
                                
                                    document.getElementById('liked-' + id).style.display = 'none';
                                    likeStatus = 'false';
                                    likeBtn.dataset.likeStatus = 'false'; 
                                }
                            }
                        }
                    };
        
                    let json = JSON.stringify({
                        type: likeStatus === 'false' ? 'like' : 'unlike',
                        postId: id,
                    });
        
                    xhr.send(json);
                }
               }
            }
        }
    
        let json = JSON.stringify({
            type : type,
            title: title,
            urls : urls,
            date : Date.now()
       });
      
        xhr.send(json);
    }

    function postTitle(type,text){
       console.log(type);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '', true);
        
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        
        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
               const res = JSON.parse(xhr.response)
               if(res.testPosted){
                    console.log(res.post);
                    console.log('request come');
                    console.log('posted');
                    closeBtn.click()
                    let postSection = document.getElementById('post-section')
                    let i = postSection.children.length +1
                    let postDiv = document.createElement('div')
                    postDiv.classList.add('d-flex','flex-column','mt-3','rounded','p-3')
                    postDiv.style.backgroundColor ='white'
                    postDiv.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.10)'
                    let totalItems = ''
                    let postHeader = `
                      
                                    
                      <div class="d-flex justify-content-between">
                         
                        <div class="d-flex align-items-center">
                            <img src="${ res.user.profile_pic ? res.user.profile_pic : '/images/profile-pic.png' }" alt="" width="35px" height="35px" style="border-radius: 50%; margin-right: 8px;">
                            <div class="d-flex flex-column">
                            <span  style="font-weight: 500; font-size: 14px;">${ res.user.first_name} ${ res.user.last_name }</span>
                                <span style="font-size: 12px;">${res.date}</span>
                            </div>
                        </div>
                            
                        <i class="bi bi-three-dots"></i>
                      </div>
                      
                                          
                           

                          <p id="paragraph-${i}" class=" mt-3 title">
                              ${text}
                              <span id="see-more-${ i }" class="see-more" style="border: none; font-weight: 600; cursor: pointer; display: none;">See more</span>
                          </p>
                      

                      `
                     
    let bootomIcons = `               
                      
                      


                          
                          
              <div class="mt-3" style="border-bottom: 1px solid lightgray;"></div>                  
                  <div class="d-flex align-items-center">
          
                          <span id="like-${ res.post._id }" class="btn w-100 d-flex align-items-center justify-content-center like-btn" data-like-status="${ res.post.likes.includes(res.user._id) }">
                          <i id="remove-like-${res.post._id}" class="bi bi-hand-thumbs-up me-2 fs-5 " style="display:${res.post.likes.includes(res.user._id) ? 'none' : 'block'  };"></i>
                          <i id="liked-${res.post._id}" class="bi bi-hand-thumbs-up-fill me-2 fs-5 text-primary" style="display:${res.post.likes.includes(res.user._id) ? 'block' : 'none'}"></i>Like</span>

                      
                      <span id="comment-btn-${res.post._id}" class="btn w-100 d-flex align-items-center justify-content-center comment-icon"><i class="bi bi-chat me-2 fs-5"></i>Comment</span>
                      <span class="btn w-100 d-flex align-items-center justify-content-center share-icon"><i class="bi bi-share-fill me-2 fs-5"></i>Share</span>
                  </div> 
              
              
                                  
              

              <div style="border-bottom: 1px solid lightgray;"></div>
             `  
             
             let commentSection = ''        
             if(res.post.comments.length > 0){ 
                commentSection = ` <span id="view-more-${res.post._id}" class="veiw-comments btn view-more-btn" style="color: gray; font-weight: 400;" data-bs-toggle="modal" data-bs-target="#view-more">View more comments</span>`
                   }else{ 
                    commentSection = `<span id="view-more-${res.post._id}" class="veiw-comments btn view-more-btn" style="color: gray; font-weight: 400;" data-bs-toggle="modal" data-bs-target="#view-more"></span>`
                 } 
         let CommentFormItem = `             
              <form id="comment-form-${ res.post._id }" class="comment-form" action="" method="post">
              <div class="d-flex align-items-center mt-2">
                      <img src="${ res.user.profile_pic ? res.user.profile_pic :  '/images/profile-pic.png' }" alt="" width="25px" height="25px" style="border-radius: 50%; ">
                      <input id="comment-input-${res.post._id}" class="form-control mx-2 comment-text p-3" placeholder="Write a comment..."  type="text" required style="border-radius: 20px; background-color: #e9ecef; height: 26px;">
                      <button id="comment-btn-${res.post._id }" class="btn" type="submit"><i class="bi bi-send"></i></button>
                  </div>
              </form>
  
            
                      `
                      
                      postDiv.innerHTML = postHeader + bootomIcons + commentSection + CommentFormItem
                      postSection.prepend(postDiv)

                      let deletePosts = document.getElementById(`delete-post-${ res.post._id}`)
                      deletePosts.onclick=()=>{
                        let post_id = res.post._id
                        
                    const xhr = new XMLHttpRequest();
                    xhr.open("DELETE", `postdelete/${post_id}`, true);
                
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                
                    xhr.onreadystatechange = () => {
                        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                            const res = JSON.parse(xhr.response)
                            if(res.status){
                                document.getElementById(`delete-post-close-${post_id}`).click()
                                document.getElementById(`post-div-${post_id}`).remove()
                            }
                        }
                    }
                
                    xhr.send();
                    } 
                    let commentForms = document.getElementById(`comment-form-${res.post._id}`)
                    commentForms.onsubmit=(e)=>{
                        e.preventDefault()
                        let post_id = res.post._id
                        let comment = document.getElementById('comment-input-'+post_id).value 
                        const xhr = new XMLHttpRequest();
                        xhr.open("POST", '', true);
                        
                        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                        
                        xhr.onreadystatechange = () => {
                            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                                const res = JSON.parse(xhr.response)
                                if(res.added){
                                     console.log('response come');
                                    document.getElementById(`view-more-${post_id}`).click()
                                    document.getElementById('comment-input-'+post_id).value = ''
                                }
                            }
                        }
                    
                        let json = JSON.stringify({
                            type : 'comment',       
                            comment : comment,
                            postId : post_id,
                        });
                        
                        xhr.send(json);
                    }
    
                    let viewMoreBtn = document.getElementById(`view-more-${res.post._id}`)
                    viewMoreBtn.onclick=()=>{
            
                        let postId = res.post._id
                        
                        
                    const xhr = new XMLHttpRequest();
                    xhr.open("POST", '', true);
                
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                
                    xhr.onreadystatechange = () => {
                        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                            let res = JSON.parse(xhr.response)
                            console.log(res);
                            if(res.post){
                                console.log('recived');
                                let post = res.post
                                console.log(post.id);
                                let user_details = res.user_details
                                let postImage1 = ''
                                let postImage2 = ''
                                let postImage3 = ''
                                let postImage4 = ''
                                let replyDiv = ''
                                let commentDiv = ''
                                let extra = ''
                                let users_details = res.users_details
                
                                let postSection = document.getElementById('modal-post-section')
                                postSection.innerHTML = ""
                                let postDiv = document.createElement('div')
                                postDiv.classList.add('d-flex','flex-column','rounded')
                                postDiv.style.backgroundColor = 'white'
                
                                console.log(post);
                               
                                let modalHeader = `
                                <div class="d-flex align-items-center justify-content-between border-bottom py-2" >
                                    <h2 class="mx-5"></h2>
                                    <h5 class="modal-title">${ user_details.first_name + ' ' + user_details.last_name+"'s" } post</h5>
                                    <button type="button" class="btn-close d-flex justify-content-end" data-bs-dismiss="modal" aria-label="Close" style="margin-left: 120px;"></button>
                                </div>`
                
                                let postHeader = `
                                <div  class="d-flex flex-column rounded p-2" style="background-color: white;">
                                                        
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <img src="/images/person_pic.jpg" alt="" width="35px" height="35px" style="border-radius: 50%; margin-right: 8px;">
                                            <span  style="font-weight: 500; font-size: 14px;">Harshit Saxena</span>
                                        </div>
                                        <i class="bi bi-three-dots"></i>
                                    </div>
                                    <div class='title'>
                                        <p id="paragraph-${postId}" class="title mt-3">
                                            ${post.title}
                                        </p>
                                    </div>        
                                    `
                
                                     if(post.post_pics.length-1 == 0){ 
                                 postImage1 =`
                            <div class="row">
                            <img id="post-image-${0}-${post._id}" class="post-images" src="${post.post_pics[0]}" alt="" height="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
                         `           }
                
                                    if(post.post_pics.length-1 == 1){
                                        postImage2 = ` <div  class="row gx-2" style="height: 300px;">
                                           <div class="col-sm-6 ">
                                               <img id="post-image-${ 0 }-${post._id}" class="post-images" src="${ post.post_pics[0] }" height="100%" width="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                           </div>
                                           <div class="col-md-6">
                                               <img id="post-image-${ 1 }-${post._id}" class="post-images" src="${ post.post_pics[1] }" height="100%" alt="" width="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                           </div>
                                       </div>
                                       `
                                     } 
                
                                    
                                    if(post.post_pics.length-1 == 2){
                                        postImage3 = `
                                         <div class="row g-2">
                                            <div class="col-md-6">
                                                <img id="post-image-${ 0 }-${post._id}" class="post-images" src="${ post.post_pics[0] }" height="100%" width="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                            </div>
                                            <div class="col-md-6">
                                                <div class="d-flex flex-column">
                                                    <div class="mb-2">
                                                        <img id="post-image-${ 0 }-${post._id}" class="post-images" src="${ post.post_pics[1] }" height="50%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                                    </div>
                                                    <div>
                                                        <img id="post-image-${ 1 }-${post._id}" class="post-images" src="${ post.post_pics[2] }" height="50%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                `
                                        }
                
                                   if(post.post_pics.length-1 > 2){
                                    postImage4 = `
                                    <div class="row g-2">
                                        <div class="col-md-6">
                                            <img id="post-image-${ 0 }-${post._id}" class="post-images" src="${ post.post_pics[0] }" height="100%" width="100%" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                        </div>
                                        <div class="col-md-6">
                                            <div class="d-flex flex-column">
                                                <div class="mb-2">
                                                    <img id="post-image-${ 1 }-${post._id}" class="post-images" src="${ post.post_pics[1] }" height="50%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                                </div>
                                                <div style="position: relative;">
                                                    <img id="post-image-${ 2 }-${post._id}" class="post-images" src="${ post.post_pics[2] }" height="50%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                                    <div id="post-image-${ 3 }-${post._id}" class="d-flex justify-content-center align-items-center post-images" style="position : absolute; background:rgba(0, 0, 0, 0.4); bottom: 0px; right: 2px; height: 100%; width: 100%; cursor: pointer;" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                                        <div class="d-flex justify-content-center align-items-center">
                                                            <div class="d-flex align-items-end">
                                                                <i class="bi bi-plus-lg fs-6 " style="z-index: 1; -webkit-text-stroke: 1px; color: white; margin-bottom: 7px;"></i>
                                                                <span style="font-size: 30px; font-weight: 600; color: white; ">${ post.post_pics.length-3 }</span>
                                                            </div>
                
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    `
                                    }
                                  let extraPostHeader = `
                                  
                                  <div class="mt-3" style="border-bottom: 1px solid lightgray;"></div>                  
                                  <div class="d-flex align-items-center">
                      
                                      <span id="like-${postId}" class="btn w-100 d-flex align-items-center justify-content-center like-btn" data-like-status="${post.likes.includes(user_details.user_id)}">
                                          <i id="remove-like-${postId}" class="bi bi-hand-thumbs-up me-2 fs-5 " style="display:${post.likes.includes(user_details.user_id) ? 'none' : 'block'  };"></i>
                                          <i id="liked-${postId}" class="bi bi-hand-thumbs-up-fill me-2 fs-5 text-primary" style="display:${post.likes.includes(user_details.user_id) ? 'block' : 'none'};"></i>Like</span>
                
                                  
                                      <span id="comment-btn-${postId}" class="btn w-100 d-flex align-items-center justify-content-center comment-icon"><i class="bi bi-chat me-2 fs-5"></i>Comment</span>
                                      <span class="btn w-100 d-flex align-items-center justify-content-center share-icon"><i class="bi bi-share-fill me-2 fs-5"></i>Share</span>
                                  </div> 
                                  <div style="border-bottom: 1px solid lightgray;"></div>
                                  <div id="comment-section-${postId}" class="mt-2 d-flex flex-column">
                                  `               
                    
                                for(let j=0;j<post.comments.length;j++){
                                    
                                    let commentItem = ` 
                                       <div class='d-flex mt-2'>
                                        <img class="p-2" src="${users_details[post.comments[j].user_id].profile_pic ? users_details[post.comments[j].user_id].profile_pic : '/images/profile-pic.png'}" alt="" width="42px" height="42px" style="border-radius: 50%;">
                                        <div class="d-flex flex-column">   
                                            <div class="d-flex flex-column p-3" style="background-color: #edf2f4; border-radius: 15px;">
                                                <span style="font-weight: 500; font-size:13px;">${users_details[post.comments[j].user_id].name} </span>
                                                <span class="comment-text">${post.comments[j].comment}</span>    
                                            </div>
                                            <div class="d-flex p-1 mx-2">
                                                <span id="comment-like-${j}" class="btn comment-like-btn" style="font-size: 10px; font-weight: bold;">Like</span>
                                                <span id="reply-${postId}-${post.comments[j].id}" class="btn reply-btn" style="font-size: 10px; font-weight: bold;">Reply</span>
                                            </div>
                                        </div>
                                        <div id="reply-div-${post.comments[j].id}" class="mx-3 mb-3" style="display:none">
                                            <form id="reply-form-${ post.comments[j].id }" class="reply-form" action="" method="post">
                                                <div class="d-flex align-items-center mt-2">
                                                    <img src="${ user_details.profile_pic ? user_details.profile_pic :  '/images/profile-pic.png' }" alt="" width="25px" height="25px" style="border-radius: 50%; ">
                                                    <input id="reply-input-${post.comments[j].id}" class="form-control mx-2 comment-text p-3" placeholder="Write a comment..."  type="text" required style="border-radius: 20px; background-color: #e9ecef; height: 50px;">
                                                    <button id="reply-btn-${post.comments[j].id}" class="btn" type="submit"><i class="bi bi-send"></i></button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    
                `   
                    replyDiv = ''
                        if(post.comments[j].replies.length>0){
                            
                            for(let k=0;k<post.comments[j].replies.length;k++){
                                console.log(k);
                                let replyItem = `
                                <div class="d-flex mx-5">
                                    <img class="p-2" src="${users_details[post.comments[j].replies[k].user_id].profile_pic ? users_details[post.comments[j].replies[k].user_id].profile_pic : '/images/profile-pic.png'}" alt="" width="42px" height="42px" style="border-radius: 50%;">
                                    <div class="d-flex flex-column">   
                                        <div class="d-flex flex-column p-3" style="background-color: #edf2f4; border-radius: 15px;">
                                            <span style="font-weight: 500; font-size:13px;">${users_details[post.comments[j].replies[k].user_id].name} </span>
                                            <span class="comment-text">${post.comments[j].replies[k].comment}</span>    
                                        </div>
                                        <div class="d-flex p-1 mx-2">
                                            <span id="comment-like-${j}" class="btn comment-like-btn" style="font-size: 10px; font-weight: bold;">Like</span>
                                            <span id="reply-${postId}-${post.comments[j].replies[k].id}" class="btn reply-btn" style="font-size: 10px; font-weight: bold;">Reply</span>
                                        </div>
                                  </div>
                                 </div>
                                `
                                
                                replyDiv = replyItem + replyDiv
                           
                            }       
                        }
                        
                                    let commentPlusReply = commentItem + replyDiv
                                    commentDiv += commentPlusReply      
                                }
                                let footer = `
                                
                                </div>
                                      </div>  
                                        </div>
                                        </div>
                                            <form id="reply-form-${ postId }" method="post">
                                                <div class="d-flex align-items-center mt-2">
                                                    <img src="${ user_details.profile_pic ? user_details.profile_pic :  '/images/profile-pic.png' }" alt="" width="25px" height="25px" style="border-radius: 50%; ">
                                                    <input id="reply-input-${postId}" class="form-control mx-2 comment-text p-3" placeholder="Write a comment..."  type="text" required style="border-radius: 20px; background-color: #e9ecef; height: 26px;">
                                                    <button id="reply-btn-${postId}" class="btn" type="submit"><i class="bi bi-send"></i></button>
                                                </div>
                                            </form>
                                        </div>
                                </div
                               
                                `
                
                                postDiv.innerHTML = modalHeader + postHeader + postImage1 + postImage2 + postImage3 + postImage4 + extraPostHeader  + commentDiv + footer
                
                                postSection.appendChild(postDiv)
                
                
                                let replyBtns = document.querySelectorAll('.reply-btn')
                                replyBtns.forEach((btn)=>{
                                    btn.onclick=()=>{
                                        let id = btn.id.split('-')[2]
                                        let replyDiv = document.getElementById('reply-div-'+id)
                                        let replyInput = document.getElementById('reply-input-'+id)
                                        replyDiv.style.display = 'block'
                                        replyInput.focus()
                                    }
                                })
                
                                let replyForms = document.getElementById(`reply-form-${postId}`)
                                replyForms.onsubmit=(e)=>{
                                    e.preventDefault()
                                   
                                    let replyInput = document.getElementById(`reply-input-${postId}`).value
                                   
                                        console.log('reply form come');
                                            console.log(replyInput);
                                           
                                            console.log('ajsdvbs');
                                          
                                   
                                            console.log(replyInput,'sucygasvuy');
                                            const xhr = new XMLHttpRequest();
                                            xhr.open("POST", '', true);
                                            
                                            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                                            
                                            xhr.onreadystatechange = () => {
                                                if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                                                    let res = JSON.parse(xhr.response)
                                                  if(res.added){
                                                    console.log('reply recived');
                                                    document.getElementById(`view-more-${postId}`).click()
                                                    document.getElementById(`reply-input-${postId}`).value = ''
                                                  }
                                                }
                                            }
                                        
                                            let json = JSON.stringify({
                                               type : "comment-reply",
                                               comment :  replyInput,
                                               postId : postId
                                           });
                                          
                                            xhr.send(json);
                
                                    
                                    
                                    }
                              
                              
                
                                postPhotos = document.querySelectorAll('.post-images')
                                postPhotos.forEach((image)=>{
                                    image.onclick=()=>{
                                        let postId = image.id.split('-')[3]
                                        const xhr = new XMLHttpRequest();
                                    xhr.open("POST", '', true);
                                    
                                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                                    
                                    xhr.onreadystatechange = () => {
                                        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                                           const res = JSON.parse(xhr.response)
                                           let photosSection = document.getElementById('photos-section')
                                           photosSection.innerHTML = ''
                                           
                                           console.log(res.post);
                                           for(let i=0;i<res.post.post_pics.length;i++){
                                               let photoDiv = document.createElement('div')
                                                photoDiv.id = `photo-${i}`
                                                photoDiv.innerHTML=`
                                                        <img id="post-image-${i}" class="post-images mt-2" src="${ res.post.post_pics[i] }" height="80%" width="100%" alt="" data-bs-toggle="modal" data-bs-target="#photos-modal">
                                               `
                                               photosSection.appendChild(photoDiv)
                                           }
                                        }
                                    }
                                
                                    let json = JSON.stringify({
                                       postId : postId,
                                       type : 'post-images'
                                   });
                                  
                                    xhr.send(json);
                                    }
                                })
                                commentIconBtns = document.querySelectorAll('.comment-icon')
                
                                commentIconBtns.forEach((btn)=>{
                                    btn.onclick=()=>{
                                        console.log('comment');
                                        let id = btn.id.split('-')[2]
                                        console.log(id);
                                        let commentInput = document.getElementById('comment-input-'+id)
                                        
                                        commentInput.focus()
                                    }
                                })
                
                          
                            }
                        }
                    }
                
                    let json = JSON.stringify({
                        type : 'view-more',
                        postId : postId
                    });
                
                    xhr.send(json);
                    }
                    let likeBtn = document.getElementById(`like-${res.post._id}`)
                    likeBtn.onclick = () => {
                        let id = res.post._id;
                        let likeStatus = likeBtn.dataset.likeStatus;
                        console.log(likeStatus);
                        
                        const xhr = new XMLHttpRequest();
                        xhr.open("POST", '', true);
            
                        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            
                        xhr.onreadystatechange = () => {
                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                if (xhr.status === 200) {
                                    const res = JSON.parse(xhr.response);
                                    if (res.liked) {
                                        console.log('liked');
                                       
                                        
                                        document.getElementById('remove-like-' + id).style.display = 'none';
                                        document.getElementById('liked-' + id).style.display = 'block';
                                        likeStatus = 'true'; 
                                        likeBtn.dataset.likeStatus = 'true';
                                    } else if (res.unliked) {
                                        console.log('unliked');
                                        
                                        
                                        document.getElementById('remove-like-' + id).style.display = 'block';
                                    
                                        document.getElementById('liked-' + id).style.display = 'none';
                                        likeStatus = 'false';
                                        likeBtn.dataset.likeStatus = 'false'; 
                                    }
                                }
                            }
                        };
            
                        let json = JSON.stringify({
                            type: likeStatus === 'false' ? 'like' : 'unlike',
                            postId: id,
                        });
            
                        xhr.send(json);
                    }
                    }else{
                    console.log('false');
               }
            }
        }
    
        let json = JSON.stringify({
            type : type,
            title: text,
       });
      console.log(json);
        xhr.send(json);
    }


socket.on('request notification',data=>{
    console.log(data.friend_id);
    console.log(data.status);
   
    console.log('request');
    console.log('kbsvkb')
    if(data.status && user_id == notify.friend_id){  
        console.log('aschjsdv');
        console.log(totalNotification);
        totalNotification.innerHTML = Number(data.notilength) - 1
        totalNotification.style.display = 'block'
        let display = {
            status : true,
            user_id : user_id
        }
        socket.emit('display-notification',display)
    }
})

socket.on('accept-request-notification',data=>{
    console.log(data.friend_id);
    console.log(data.status);

    console.log('request');
    console.log('kbsvkb')
    if(data.status && user_id == data.friend_id ){  
        console.log('aschjsdv');
        console.log(totalNotification);
        totalNotification.innerHTML = Number(data.notilength) - 1
        totalNotification.style.display = 'block'
        let display = {
            status : true,
            user_id : user_id
        }
        socket.emit('display-notification',display)
    }
})

socket.on('notification',(notify)=>{
    console.log(notify.notifications.length);
    let count = 0
    if(notify.notifications.length>0 && user_id == notify.friend_id){
        count = notify.notifications.length
        totalNotification.innerText = Number(count) - 1 
    }else{
        if(user_id == notify.friend_id){
            totalNotification.innerHTML = count
        }
    }
})

deletePosts.forEach((btn)=>{
    btn.onclick=()=>{
        let post_id = btn.id.split('-')[2]
        
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `postdelete/${post_id}`, true);

    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            const res = JSON.parse(xhr.response)
            if(res.status){
                document.getElementById(`delete-post-close-${post_id}`).click()
                document.getElementById(`post-div-${post_id}`).remove()
            }
        }
    }

    xhr.send();
    } 
})

taggedPeoples.forEach((btn)=>{
    btn.onclick=()=>{
        
        let postId = btn.id.split('-')[2]
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '', true);
        
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        
        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            const res = JSON.parse(xhr.response)
            if(res.status){
                console.log(res.request_sent);
                console.log('come');
                console.log(res.peoples);
                let peoplesTotal = document.getElementById('peoples-section-'+postId)
                let peoplesSection = document.createElement('div')
                peoplesTotal.innerHTML = ''
                peoplesSection.classList.add('d-flex','flex-column')
                let totalPeople = ''
                console.log(res.friends);
            
                for(let i=0;i<res.peoples.length;i++){
                    for(let j=0;j<res.friends.length;j++){
                        if(i == j){
                            let present = res.request_sent.every(item => item == res.peoples[i].user_id)
                            if(res.peoples[i].user_id == res.friends[j] || res.peoples[i].user_id == res.user_id){
                                totalPeople = `
                                <div class="d-flex align-items-center mt-2">
                                    <div d-flex align-items-center>
                
                                        <img src="${res.peoples[i].pic ? res.peoples[i].pic : '/images/profile-pic.png'}" width="30px" height="30px" style="border-radius: 50%; object-fit: cover;" alt="">
                                        <span class="mx-3" style="font-weight: 500;">${res.peoples[i].name}</span>
                                    </div>
                                </div>`
                                peoplesSection.innerHTML += totalPeople 
                            }else if(present){
                     
                                totalPeople = `
                                <div class=" mt-2 d-flex align-items-center justify-content-between">
                                    <div d-flex align-items-center>
                                        <img src="${res.peoples[i].pic ? res.peoples[i].pic : '/images/profile-pic.png'}" width="30px" height="30px" style="border-radius: 50%; object-fit: cover;" alt="">
                                        <span class="mx-3" style="font-weight: 500;">${res.peoples[i].name}</span>
                                    </div>
                                <span id="add-friend-${res.peoples[i].user_id}" class="p-2 rounded-3 add-friend" style="font-weight:500; background-color: lightgray; cursor:pointer; display:none"><i class="bi bi-person-plus-fill text-dark mx-2 fs-5"></i>Add friend</span>
                                <span id="cancel-friend-${res.peoples[i].user_id}" class="p-2 rounded-3 cancel-friend" style="font-weight:500; background-color: lightgray; cursor:pointer; display:block"><i class="bi bi-person-x-fill mx-2 fs-5"></i>Cancel Request</span>
                                
                                </div>

                                `
                                peoplesSection.innerHTML += totalPeople
                            }else{
                                totalPeople = `
                                <div class=" mt-2 d-flex align-items-center justify-content-between">
                                    <div d-flex align-items-center>
                                        <img src="${res.peoples[i].pic ? res.peoples[i].pic : '/images/profile-pic.png'}" width="30px" height="30px" style="border-radius: 50%; object-fit: cover;" alt="">
                                        <span class="mx-3" style="font-weight: 500;">${res.peoples[i].name}</span>
                                    </div>
                                <span id="add-friend-${res.peoples[i].user_id}" class="p-2 rounded-3 add-friend" style="font-weight:500; background-color: lightgray; cursor:pointer; display:block"><i class="bi bi-person-plus-fill text-dark mx-2 fs-5"></i>Add friend</span>
                                <span id="cancel-friend-${res.peoples[i].user_id}" class="p-2 rounded-3 cancel-friend" style="font-weight:500; background-color: lightgray; cursor:pointer; display:none"><i class="bi bi-person-x-fill mx-2 fs-5"></i>Cancel Request</span>
                                
                                </div>`
                                peoplesSection.innerHTML += totalPeople
                            }
                        }
                                          
                    }
                }
                peoplesTotal.append(peoplesSection)
                 console.log(peoplesTotal);

                let addBtns = document.querySelectorAll('.add-friend')
                addBtns.forEach((btn)=>{
                    btn.onclick=()=>{
                        let id = btn.id.split('-')[2]
                        const xhr = new XMLHttpRequest();
                    xhr.open("POST", '', true);
                    
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    
                    xhr.onreadystatechange = () => {
                        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                            const res = JSON.parse(xhr.response)
                            if(res.sent){
                                document.getElementById('add-friend-'+id).style.display = 'none'
                                document.getElementById('cancel-friend-'+id).style.display = 'block'
                                let requestNotification = {
                                    user_id : user_id,
                                    friend_id : id,
                                    status : true,
                                    date : Date.now()
                                }
                                socket.emit('request notification',requestNotification)
                            }
                        }
                    }

                    let json = JSON.stringify({
                        type : 'send',
                        id : id
                    });
                
                    xhr.send(json);
                    }
                })

                let cancelBtns = document.querySelectorAll('.cancel-friend')
                cancelBtns.forEach((btn)=>{
                    btn.onclick=()=>{
                        let id = btn.id.split('-')[2]
                        const xhr = new XMLHttpRequest();
                    xhr.open("POST", '', true);
                    
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    
                    xhr.onreadystatechange = () => {
                        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                            const res = JSON.parse(xhr.response)
                            if(res.cancel){
                                document.getElementById('add-friend-'+id).style.display = 'block'
                                document.getElementById('cancel-friend-'+id).style.display = 'none'
                            }
                        }
                    }

                    let json = JSON.stringify({
                        type : 'cancel',
                        id : id
                });
                
                    xhr.send(json);
                    }
                })
                
            }
            }
        }
    
        let json = JSON.stringify({
            type : 'tagged-peoples',
            post_id : postId
       });  
      
        xhr.send(json);
  
    }
})