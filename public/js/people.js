
let requestBtns = document.querySelectorAll('.add-btn')
let requestSentBtns = document.querySelectorAll('.request-send-btn')
let cancelBtn = document.querySelectorAll('.cancel-btn')
let removeBtns = document.querySelectorAll('.remove-btn')
let removeBtn = document.getElementById('remove-btn')
let requestSentBtn = document.getElementById('request-send')
let btnId = ''


removeBtns.forEach((button)=>{
    button.addEventListener('click',()=>{
        let id = button.id.split('-')[1]
        document.getElementById('item-' + id).remove()
    })    
})

cancelBtn.forEach((button)=>{
    button.addEventListener('click',()=>{
        
        console.log('hello');
        const xhr = new XMLHttpRequest()
        const id = button.id.split('-')[1]
        btnId = id
        xhr.open("POST", '', true)
        xhr.setRequestHeader('Content-type', 'application/json ; charset=utf-8')
        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
                const res = JSON.parse(xhr.response)
                if(res.cancel){
                    button.style.display = 'none'
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
            type : "delete"
        })
        xhr.send(json)
    })
})
requestBtns.forEach((button) => {
    button.addEventListener('click', () => {  
       
        
        const xhr = new XMLHttpRequest();
        const id = button.id.split('-')[1]
        xhr.open("POST", '', true);
        
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        
        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                const res = JSON.parse(xhr.response)
                if(res.sent){
                    console.log('Sent');
                    button.style.display = 'none'
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
    })
    
   
})


