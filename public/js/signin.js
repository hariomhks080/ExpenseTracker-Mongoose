const emailexist = document.getElementById("exampleInputEmail1");

emailexist.addEventListener("input", emailmatching);
async function emailmatching(event) {
  event.preventDefault();
  const value = document.getElementById("exampleInputEmail1").value;

  try {
    const get = await axios.get("http://localhost:3000/signup/add-user");
    for (var i = 0; i < get.data.length; i++) {
      checkvalidemail(get.data[i], value);
    }
  } catch (err) {
    console.log(err);
  }
}
async function checkvalidemail(obj, value) {
  if (obj.email == value) {
    const email = document.getElementById("already");

    email.style.display = "block";
    setTimeout(() => {
      email.style.display = "none";
    }, 6000);
  }
}

async function signin(event) {
  event.preventDefault();
  const email = event.target.email.value;
  const password = event.target.password.value;
  localStorage.setItem("noitempage",5)
  localStorage.setItem("currentPage",1)
  const obj = {
    email,
    password,
  };

  try {
    const post = await axios.post("http://localhost:3000/signin/add-user", obj);
    console.log(post.data);
   alert(post.data.message)
    window.location.href="/expense"
    localStorage.setItem("token",post.data.token)
  } catch (err) {
   alert(err.response.data.message)
   
    
  }
}
