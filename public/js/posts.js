
let replyBtnForm = document.getElementById('reply-btn-form')
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
let commentBtn = document.querySelectorAll('.comment-btn')
let commentIconBtns = document.querySelectorAll('.comment-icon')
let commentLikeBtn = document.querySelectorAll('.comment-like-btn')
let commentReplyBtn = document.querySelectorAll('.reply-btn')
let replyBtnComment = document.querySelectorAll('.reply-btn-comment')
let commentDiv = document.querySelectorAll('comment-div')
let viewMoreBtn = document.querySelectorAll('.view-more-btn')
let multiplePostFiles = document.querySelector('#select-photo')
let tagIcon = document.getElementById('tag-icon')
let tagDiv = document.getElementById('tag-friend')
let iconDiv = document.getElementById('icons-div')
let profilePersonImage = document.getElementById('user-image')
let backBtn = document.getElementById('back-btn')
let tagFriends = []

new MultiSelectTag('friends',{
    rounded: true,    
    placeholder: 'Please select your friends......',
    onChange: function(values) {
        tagFriends = values.map(item => item.value)
    }
})

backBtn.onclick=()=>{
    tagDiv.style.display = 'none'
    iconDiv.style.display = 'block'
    textAreaPost.style.display = 'block'
    postBtn.style.display = 'block'
    profilePersonImage.style.display = 'block'
}

tagIcon.onclick=()=>{
    tagDiv.style.display = 'block'
    iconDiv.style.display = 'none'
    textAreaPost.style.display = 'none'
    postBtn.style.display = 'none'
    profilePersonImage.style.display = 'none'
}
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


viewMoreBtn.forEach((btn)=>{
    btn.onclick=()=>{
        let scrollToBottom = true
        
        let postId = btn.id.split('-')[2]
        
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '', true);

        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                let res = JSON.parse(xhr.response)
                if(res.post){
                   
                    let post = res.post
                  
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
                
                    let modalHeader = `
                    <div class="d-flex align-items-center justify-content-between border-bottom py-2" >
                        <h2 class="mx-5"></h2>
                        <h5 class="modal-title" >${ user_details.first_name + ' ' + user_details.last_name + "'s" } post</h5>
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
            `       }

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
        if(post.comments.length == 0){
             scrollToBottom = false
        }
                    for(let j=0;j<post.comments.length;j++){
                        
                        let commentItem = ` 
                        <div id="comment-${j}" class='d-flex mt-2'>
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
                                <form id="reply-form-${ postId }"  method="post">
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

                    if(scrollToBottom){
                        const commentItem = document.getElementById('comment-'+ (post.comments.length - 1))
                        console.log('comment-'+ (post.comments.length - 1));
                        commentItem.scrollIntoView()
                    }

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
                    
                            let id = btn.id.split('-')[2]
                            
                            let commentInput = document.getElementById('comment-input-'+id)
                            
                            commentInput.focus()
                        }
                    })

                    commentForms = document.querySelectorAll('.comment-form')
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
                                    document.getElementById(`view-more-${postId}`).click()
                                    document.getElementById(`comment-input-${postId}`).value = ''
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
         
            document.getElementById('comment-reply-'+ post_id + '-' + comment_id).style.display = 'block'
            
        }
    })
  
    commentIconBtns.forEach((btn)=>{

        btn.onclick=()=>{
            let id = btn.id.split('-')[2]
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
        if(lines >= 3){
            btn.style.display = 'block'
        }
            
        }
    })
   


    

// suggestionTab.onclick

  

 




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
            let friend_id = btn.id.split('-')[2]
            let likeStatus = btn.dataset.likeStatus;
            
            const xhr = new XMLHttpRequest();
            xhr.open("POST", '', true);

            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        const res = JSON.parse(xhr.response);
                        if (res.liked) {
                            let likeStatus = {
                                status : true,
                                user_id : user_id,
                                friend_id : friend_id,
                                time : Date.now()
                            }                           
                            socket.emit('like-notification',likeStatus)
                            document.getElementById('remove-like-' + id).style.display = 'none';
                            document.getElementById('liked-' + id).style.display = 'block';
                            likeStatus = 'true'; 
                            btn.dataset.likeStatus = 'true';
                            
                        } else if (res.unliked) {                            
                            
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
                                document.getElementById(`view-more-${postId}`).click()
                                document.getElementById('comment-input-'+postId).value = ''
                               let modalBody = document.getElementById('view-more-modal')
                               modalBody.scrollTop = modalBody.scrollHeight; 
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
            
     
    let postStatus = ''
    textAreaPost.onchange = ()=>{     
        postStatus = 'only-text'
            
            if(textAreaPost.value.length > 0 && postStatus == 'only-text'){
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
        if(postStatus == 'only-text'){
            let postTitleText = textAreaPost.value
            console.log(postTitleText);
            postTitle('only-text',postTitleText)
            
            textAreaPost.value = ''

        }else{
            
            let postPics = []

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
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '', true);
        
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        
        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
               const res = JSON.parse(xhr.response)
               if(res.received){
                    closeBtn.click() 
                    document.getElementById('photo-section').style.display = 'none'
                    document.getElementById('text-area').style.fontSize = '20px'
                    document.getElementById('text-area').value = ''
                    if(tagFriends.length > 0){
                        tagData = {
                            user_id : user_id,
                            tagFriends : tagFriends,
                            date : Date.now()
                        }
                        socket.emit('tag-notification',tagData)
                    }         
               }
            }
        }
    
        let json = JSON.stringify({
            type : type,
            title: title,
            urls : urls,
            tag_friends : tagFriends,
            date : Date.now()
       });
      
        xhr.send(json);
    }

    function postTitle(type,title){
        
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '', true);
        
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        
        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
               const res = JSON.parse(xhr.response)
               if(res.testPosted){
                console.log('request come');
                console.log('posted');
                closeBtn.click()
                if(tagFriends.length > 0){
                    tagData = {
                        user_id : user_id,
                        tagFriends : tagFriends,
                        date : Date.now()
                    }
                    socket.emit('tag-notification',tagData)
                }
                }else{
                
               }
            }
        }
    
        let json = JSON.stringify({
            type : type,
            title: title,
            date : Date.now(),
            tag_friends : tagFriends
       });
        xhr.send(json);
    }


    socket.on('like-notification',data=>{
        notificationCount(data)        
    })
    socket.on('tag-notification',data =>{
        notificationCount(data)
    })
    function notificationCount(data){
        if(data.status && user_id == data.friend_id ){
       
            console.log('aschjsdv');
            console.log(totalNotification);
            console.log(data.notilength);
            if(data.notilength > 0){
                totalNotification.innerHTML = ''
                totalNotification.innerHTML = Number(data.notilength)
                totalNotification.style.display = 'block'
            }else{
                totalNotification.style.display = 'none'
                   }
            let display = {
                status : true,
                user_id : user_id
            }
            socket.emit('display-notification',display)
        }
    }