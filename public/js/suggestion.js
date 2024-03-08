let requestBtns = document.querySelectorAll('.add-btn')
let requestSentBtns = document.querySelectorAll('.request-send-btn')
let cancelBtn = document.querySelectorAll('.cancel-btn')
let removeBtns = document.querySelectorAll('.remove-btn')
let requestSentBtn = document.getElementById('request-send')
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





let btnId = ''

removeBtns.forEach((button)=>{
    button.addEventListener('click',()=>{
        let id = button.id.split('-')[1]
        suggestionsSection('send-' + id).remove()
    })    
})

cancelBtn.forEach((button)=>{
    button.addEventListener('click',()=>{
        
        console.log('hello');
        const id = button.id.split('-')[1]
        cancelRequest(id)
    })
})

requestBtns.forEach((button) => {
    button.addEventListener('click', () => {  
       
        
        const id = button.id.split('-')[1]
        sendRequest(id)
    })

})


function sendRequest(id){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", '', true);
    
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            const res = JSON.parse(xhr.response)
            if(res.sent){
                let addBtn = document.getElementById('send-' + id)
                addBtn.style.display = 'none'
                let cancel = document.getElementById('cancel-' + id)
                cancel.style.display = 'block'
                let request = document.getElementById('request-' + id)
                request.style.display = 'block'
                let remove = document.getElementById('remove-' + id)
                remove.style.display = 'none'
            }
        }
    }
    
    let json = JSON.stringify({
        id,
        type : "send" 
    });
    
    xhr.send(json);
}


function cancelRequest(id){
    const xhr = new XMLHttpRequest()
    xhr.open("POST", '', true)
    xhr.setRequestHeader('Content-type', 'application/json ; charset=utf-8')
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            const res = JSON.parse(xhr.response)
            if(res.cancel){
                let cancelBtn = document.getElementById('cancel-'+id)
                cancelBtn.style.display = 'none'
                let add_friend = document.getElementById('send-' + id)
                add_friend.style.display = 'block'
                let remove = document.getElementById('remove-' + id)
                remove.style.display = 'block'
                let request = document.getElementById('request-' + id)
                request.style.display = 'none'
                console.log('Delete');
            }
        }            
    }
    let json = JSON.stringify({
        id,
        type : "cancel"
    })

    xhr.send(json)
}

