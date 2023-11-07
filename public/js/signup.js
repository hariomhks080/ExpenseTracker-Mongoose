const emailexist=document.getElementById("exampleInputEmail1")

emailexist.addEventListener("input",emailmatching)
async function emailmatching(event){
event.preventDefault()
 const value=document.getElementById("exampleInputEmail1").value
    
    try{
        const get=await axios.get("signup/add-user")  
        for (var i = 0; i < get.data.length; i++) {
            checkvalidemail(get.data[i],value)
        }
       
      }catch(err){
  console.log(err)
      }
}
async function checkvalidemail(obj,value){
    if(obj.email==value ){

        const email=document.getElementById("already")
        email.style.backgroundColor="red" 
        email.style.display="block"
        setTimeout(() => {
            email.style.display="none"  
        },6000);
        
        } 
       
       

    
        
   
}


async function forminput(event){
    event.preventDefault()
   const email=event.target.email.value;
   const password1=event.target.password1.value;
   const password2=event.target.password2.value;
   const name=event.target.name.value;
   
   if(password1===password2){
    postdata(email,password2)
   }
   async function postdata(email,password){
    const obj={
        email,
        password,
        name
    }
    console.log(obj)

    try{
      const post=await axios.post("signup/add-user",obj)  
      console.log(post)
      alert(post.data.message)
      window.location.href="/"
     
    }catch(err){
        console.log(err.response.data.message)
alert(err.response.data.message);

    }
    

   }
  
}

