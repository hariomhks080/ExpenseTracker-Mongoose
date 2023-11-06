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
            "http://localhost:3000/forget/password",
            obj,
            { headers: { Authorization: token } }
          );
          console.log(post)
    }catch(err){
        console.log(err)
    }
    
}