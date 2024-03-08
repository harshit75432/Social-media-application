let password = document.getElementById('password')
let confirmPassword = document.getElementById('confirm-password')

password.onchange=()=>{
    if(password.value != confirmPassword.value){
        confirmPassword.setCustomValidity('Password does not match with confirm password please check')
    }else{
        confirmPassword.setCustomValidity('')
    }  
}

confirmPassword.onchange=()=>{
    if(confirmPassword.value != password.value){
        confirmPassword.setCustomValidity('confirm password does not match with password please check')
    }else{
        confirmPassword.setCustomValidity('')
    }  
    
}

