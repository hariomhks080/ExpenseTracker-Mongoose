// const nextbutton=document.getElementById("nextpage")
// nextbutton.addEventListener("click",saveis)
// const namefetch=document.getElementById("namefetch")
// console.log(nextbutton)
// function saveis(event){
//  event.preventDefault()
//  console.log("dummy")

// window.location.href=`/demopage/${namefetch.value}`
// }
const date=new Date().toString()
async function a(event) {
  event.preventDefault();
  const sellingprice = event.target.username.value;
  const fooditems = event.target.product.value;
  const items = event.target.origin.value;
  const edit = event.target.edit.value;
  const previousprice = event.target.previousprice.value;
 
  const obj = {
    sellingprice,
    fooditems,
    items,
    edit,
    previousprice,
    date,
  };
  console.log(obj);
  const token = localStorage.getItem("token");
  const decodeToken = parseJwt(token);
  const ispremiumuser = decodeToken.ispremiumuser;

  try {
    
    console.log(token);
    const post = await axios.post(
      `expense/add-expense`,
      obj,
      { headers: { Authorization: token } }
    );
    console.log(post);
    if(edit!=""){
      document.getElementById("edititem").innerHTML="Add Item"
    }
   
    // window.location.href="demopage"
refresh()
refresh1()

if(ispremiumuser){
  document.getElementById("dataput2").innerHTML=""
  document.getElementById("dataput").innerHTML=""
 

}

    //showuseronscreen(post.data);
  } catch (err) {
    console.log(err);
  }
  event.target.username.value = "";
  event.target.product.value = "";
  event.target.edit.value = "";
  event.target.previousprice.value = "";
}

window.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");

document.getElementById("noiteminpage").value=noitem
  const decodeToken = parseJwt(token);
 
  const ispremiumuser = decodeToken.ispremiumuser;
 const email= document.getElementById("useremail").innerHTML=decodeToken.email;
 
  document.getElementById("username").innerHTML=decodeToken.name;
  if (ispremiumuser) {
    document.getElementById("leaderboard1").style.display = "block";
   document.getElementById("leadershow").className="list-group-item active"
    
    showpremiumusermessage();
    premium()
  }else{
    document.getElementById("basicorpremiumuser").innerHTML="Basic User";
  } 
  refresh1()
  refresh()
});
async function refresh(){
  document.getElementById("total").innerHTML=0
  document.getElementById("dataput2").innerHTML=""
  document.getElementById("total1").innerHTML =0
  document.getElementById("totalyearlyexpenses").innerHTML =0
  document.getElementById("dataput").innerHTML=""
  
  
 
  const token = localStorage.getItem("token");
  try {
    const get = await axios.get(`expense/report/add-expense`,{ headers: { Authorization: token } });
   
    const data=get.data;
    let monthwise=[]
    data.map((ele)=>{
      const existingindex=monthwise.findIndex((month)=>
        month.month==((ele.date).split(" "))[1]
       
      )
      
      const existingitem=monthwise[existingindex]
      if(existingitem){
       const update={
        ...existingitem,
        price:existingitem.price+Number(ele.sellingprice)
       }
       monthwise[existingindex]=update
      }else{
monthwise.push({month:((ele.date).split(" "))[1],price:Number(ele.sellingprice)})
      }
    })
    
    for(var i=0;i<monthwise.length;i++){
      showmonthlyreport(monthwise[i])
      
    }
    const data2=get.data;
    data2.sort((a,b)=>b.id-a.id)
  
    for (var i = 0; i < data2.length; i++) {
     
      showexpensereport(data2[i])
      showtotalprice(data2[i])

    }
  
  } catch (err) {
    console.log(err); 
  }
  
  showpremiumusermessage();

}
async function refresh1(){
 
  document.getElementById("userscreen").innerHTML=""
  const token = localStorage.getItem("token");
  
  

  try{
    const get = await axios.get(`expense/pagewise/alladd-expense?page=${currentPage}&noitem=${noitem}` ,{ headers: { Authorization: token } });
   
     updatePageNumber(get.data);
     const data3=get.data.expenses;
    
      index=get.data.index
     for (var i = 0; i < data3.length; i++) {
      showuseronscreen(data3[i]);
      
       
 
     }
  }catch(err){

  }
}


function showuseronscreen(obj) {
    index=index+1
  const objdate=((obj.date).split(" "))
   const datesplit=objdate[2]+" "+objdate[1]+" "+objdate[3]+" "+objdate[4]
   const dataput=document.getElementById("userscreen")
   const tr=document.createElement("tr")
   const td0=document.createElement("td")
   td0.append(document.createTextNode(index))
   const td1=document.createElement("td")
   td1.append(document.createTextNode(datesplit))
   const td2=document.createElement("td")
   td2.append(document.createTextNode(obj.productname))
   const td3=document.createElement("td")
   td3.append(document.createTextNode(obj.items))
   const td4=document.createElement("td")
   td4.append(document.createTextNode(obj.sellingprice))
   const td5=document.createElement("td")
  
   const button1=document.createElement("button")
   button1.append(document.createTextNode("Edit"))
   button1.style.padding="0.5vw"
   button1.style.borderBlockColor="green"
   button1.style.background="red"
   button1.style.borderRadius="1vw"
   td5.append(button1)
   const td6=document.createElement("td")
   const button2=document.createElement("button")
   
   button2.style.padding="0.5vw"
   button2.style.borderBlockColor="green"
   button2.style.background="red"
   button2.style.borderRadius="1vw"
   button2.append(document.createTextNode("Delete"))
   td6.append(button2)
   tr.appendChild(td0)
   tr.appendChild(td1)
   tr.appendChild(td2)
   tr.appendChild(td3)
   tr.appendChild(td4)
   tr.appendChild(td5)
   tr.appendChild(td6)
   dataput.appendChild(tr)


   button1.onclick = async () => {
   dataput.removeChild(tr)
  document.getElementById("usernametag").value = obj.sellingprice;
    document.getElementById("producttag").value = obj.productname;
    document.getElementById("origin").value = obj.items;
    document.getElementById("edit").value = obj._id;
    document.getElementById("previousprice").value = obj.sellingprice;
    document.getElementById("edititem").innerHTML="Edit Item"
  };
  button2.onclick = async () => {
    dataput.removeChild(tr)
    const token = localStorage.getItem("token");
 
    try {
      
      await axios.delete(
        `deleteuser/${obj._id}`,
        {
          headers: { Authorization: token },
          data: { previousprice: obj.sellingprice },
        }
      );
      refresh();
    } catch (err) {
      console.log(err);
    }
  };
  
  
}
async function showtotalprice(obj){

  const totalpriceelement=document.getElementById("total")
 
  const price = parseInt(obj.sellingprice);
    totalpriceelement.textContent = parseInt(totalpriceelement.textContent) +price;
}

let index=0
let currentPage = Number(localStorage.getItem("currentPage"));
let hasMoreExpenses;
let hasPreviousExpenses;
let noitem =Number(localStorage.getItem("noitempage"))

function updatePageNumber(response) { 
  document.getElementById("currentPage").innerHTML=currentPage;
 
  hasMoreExpenses = response.hasMoreExpenses;
    hasPreviousExpenses = response.hasPreviousExpenses;
}
document.getElementById("noiteminpage").onclick=async (event)=>{
  event.preventDefault()
  noitem =document.getElementById("noiteminpage").value
  localStorage.setItem("noitempage",noitem)
 
    refresh1();
}
document.getElementById("prevPage").onclick=async (event)=>{
  event.preventDefault()
  console.log("prev")
 if (hasPreviousExpenses) {
    currentPage--;
    
    localStorage.setItem("currentPage",currentPage)
    refresh1();
}

}
document.getElementById("nextPage").onclick=async (event)=>{
  event.preventDefault()
  console.log("next")
 if (hasMoreExpenses) { 
    currentPage++;
    
    localStorage.setItem("currentPage",currentPage)
    refresh1();
 }

}
function logout(){
  
  localStorage.removeItem("token")
  localStorage.removeItem("rzp_device_id")
  localStorage.removeItem("rzp_checkout_anon_id")
}






