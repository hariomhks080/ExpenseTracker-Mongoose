async function forget(event){
    event.preventDefault();
    const email=event.target.email.value;
    const obj={
        email
    }
    console.log(email)
    try{
        const token = localStorage.getItem("token");
        const post = await axios.post(
            `forget/password`,
            obj,
            { headers: { Authorization: token } }
          );
          alert("Forget Password Link Send To Email Sucessfully")
          window.location.href="/"
    }catch(err){
        console.log(err)
    }
    
}