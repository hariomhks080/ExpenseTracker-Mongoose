
const parts = window.location.href.split('/'); 
const lastPart = parts[parts.length - 1];
async function resetpassword(event){
    event.preventDefault();
    const password1=event.target.password.value;
    const confirmpassword=event.target.confirmpassword.value;
    let password
    if(password1==confirmpassword){
     password=confirmpassword
    }
    const obj={
       newpassword:password,
       resetid:lastPart
    }
    try{
        const response =  await axios.post(`password/reset`,obj);
       
        alert(response.data.message)
    }catch(err){
        
alert(err.response.data.message)
    }
    
    

}