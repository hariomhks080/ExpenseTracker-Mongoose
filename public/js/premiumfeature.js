document.getElementById("buypremium").onclick = async function (e) {
  e.preventDefault()
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `purchase/premiummembership`,
      { headers: { Authorization: token } }
    );

    var options = {
      key: response.data.key_id,
      order_id: response.data.orderid,
      handler: async function (response) {
        console.log("6", new Date().toJSON());
        const res = await axios.post(
          `purchase/updatetransactionstatus`,
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );
        localStorage.setItem("token", res.data.token);
        alert("You are a premium user now");
        document.getElementById("leaderboard1").style.display = "block";
   document.getElementById("leadershow").className="list-group-item active"
        showpremiumusermessage();
        refresh()
      },
    };
    const rzpl = new Razorpay(options);
    console.log("3", new Date().toJSON());
    rzpl.open();
    e.preventDefault();
    console.log("4", new Date().toJSON());
    rzpl.on("payment.failed", async function (res) {
      console.log(res.error.metadata.order_id);
      const order_id = res.error.metadata.order_id;
      const payment_id = res.error.metadata.payment_id;
      await axios
        .post(
          `purchase/failedtransactionstatus`,
          {
            order_id,
            payment_id,
          },
          { headers: { Authorization: token } }
        )
        .then((response) => {})
        .catch((err) => {
          alert("Something went Wrong");
        });
    });
  };
  async function  showmonthlyreport(obj){
    const token = localStorage.getItem("token");
    const decodeToken = parseJwt(token);
   
    const ispremiumuser = decodeToken.ispremiumuser;
    if(ispremiumuser){


      const dataput2=document.getElementById("dataput2")
   const tr=document.createElement("tr")
   const td1=document.createElement("td")
   td1.append(document.createTextNode(obj.month))
   const td2=document.createElement("td")
   td2.append(document.createTextNode(obj.price))

   tr.appendChild(td1)
   tr.appendChild(td2)

   dataput2.appendChild(tr)
   const price = parseInt(obj.price);
       document.getElementById("totalyearlyexpenses").innerHTML = parseInt(document.getElementById("totalyearlyexpenses").textContent) + price;
    }

  }
  async function showpremiumusermessage() {
    const token = localStorage.getItem("token");
    const decodeToken = parseJwt(token);
    
    const ispremiumuser = decodeToken.ispremiumuser;
    if(ispremiumuser){
    document.getElementById("ul").innerHTML=""
    document.getElementById("premiumfeature").style.display = "none";
    document.getElementById("basicorpremiumuser").innerHTML="Premium User";

   
    
    try {
      const get = await axios.get(
        `expense/alladd-expense`,
        { headers: { Authorization: token } }
      );
      

      const data = get.data;

      for (var i = 0; i < data.length; i++) {
        showleaderscreen(data[i]);
      }
    } catch (err) {
      console.log(err);
    }
}
  }
  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }
  function showexpensereport(obj){
    const token = localStorage.getItem("token");
    const decodeToken = parseJwt(token);
    
    const ispremiumuser = decodeToken.ispremiumuser;
    if(ispremiumuser){
    const todaydate=new Date().toString().split(" ")
    const date1=new Date().toString().split(" ")
    document.getElementById("todaydate1").innerHTML=date1[0]+" "+date1[1]+" "+date1[2]+" "+date1[3]+" "+date1[4]
    document.getElementById("year").innerHTML=date1[3]
    document.getElementById("monthyear").innerHTML=date1[2]+" "+date1[1]+" "+date1[3]

    if(todaydate[2]==((obj.date).split(" "))[2]){

   const objdate=((obj.date).split(" "))
   const datesplit=objdate[2]+" "+objdate[1]+" "+objdate[3]+" "+objdate[4]
   const dataput=document.getElementById("dataput")
   const tr=document.createElement("tr")
   const td1=document.createElement("td")
   td1.append(document.createTextNode(datesplit))
   const td2=document.createElement("td")
   td2.append(document.createTextNode(obj.productname))
   const td3=document.createElement("td")
   td3.append(document.createTextNode(obj.items))
   const td4=document.createElement("td")
   td4.append(document.createTextNode(obj.sellingprice))
   tr.appendChild(td1)
   tr.appendChild(td2)
   tr.appendChild(td3)
   tr.appendChild(td4)
   dataput.appendChild(tr)
  const price = parseInt(obj.sellingprice);
   document.getElementById("total1").innerHTML = parseInt(document.getElementById("total1").textContent) + price;


    }
  }
  }
function showleaderscreen(obj) {
    var price;
    if (obj.totalExpenses) {
      price = obj.totalExpenses;
    } else {
      price = 0;
    }
    const ul = document.getElementById("ul");
    ul.style.backgroundColor="white"

    const li = document.createElement("li");
    li.style.backgroundColor="white"
    li.append(
      document.createTextNode(
        "Name : " + " " + obj.name + "  " + "Total Expense : " + " " + price
      )
    );
    const hr=document.createElement("hr")

    ul.appendChild(li);
    ul.append(hr)
  }
 
  document.getElementById("reporthide").onclick= async function(event){
    event.preventDefault()
    console.log("showor not")
  document.getElementById("reportshown").style.display="none"
  document.getElementById("expensetracker").style.display="block"
  }
  async function download(event){
    event.preventDefault()
    const token = localStorage.getItem("token");
    const decodeToken = parseJwt(token);
    const ispremiumuser = decodeToken.ispremiumuser;
    if(ispremiumuser){
    const token = localStorage.getItem("token");
    document.getElementById("statusshown").innerHTML="File downloading...."
    document.getElementById("statusshown").style.backgroundColor="green"

    await axios.get(`premium/download`, { headers: {"Authorization" : token} })
    .then((response) => {

            //the bcakend is essentially sending a download link
            //  which if we open in browser, the file would download
            // var a = document.createElement("a");
            // a.href = response.data.fileURL;
            // a.download = 'myexpense.PDF';
            // a.click();
            window.location.href = response.data.fileURL;
            premium()
            document.getElementById("statusshown").innerHTML=""





    })
    .catch((err) => {
      document.getElementById("statusshown").innerHTML="Download Failed"
            document.getElementById("statusshown").style.backgroundColor="red"
            setTimeout(() => {
              document.getElementById("statusshown").innerHTML=""
              document.getElementById("statusshown").style.backgroundColor=""
            },3000);

    });
}
  }
  async function premium() {
    try {
        const token = localStorage.getItem("token");
        const downloadhistory = await axios.get(`premium/downloadhistory`, { headers: {"Authorization" : token} });
        
        showDownloadhistory(downloadhistory.data);
    } catch (error) {
        console.log(error);
    }
}
function showDownloadhistory(data) {
    
    if(data.length>0){
        document.getElementById("history").innerHTML="";
        data.forEach((ele, index) => {
            if(index<25){
                const date = new Date(ele.createdAt).toLocaleString();
                const a = document.createElement('a');
                a.className = "list-group-item text-nowrap";
                a.href = `${ele.downloadUrl}`
                a.innerHTML = `${date}`;
                document.getElementById("history").appendChild(a);
                const hr=document.createElement("hr")
                document.getElementById("history").appendChild(hr);
            }
    
        })
    }
    }
    document.getElementById("leadershow").onclick=async ()=>{
        const token = localStorage.getItem("token");
    const decodeToken = parseJwt(token);
    const ispremiumuser = decodeToken.ispremiumuser;
    if(ispremiumuser){
        document.getElementById("leaderboard1").style.display="block"
        document.getElementById("downloadhistory").style.display="none"
        document.getElementById("leadershow").className="list-group-item active"
        document.getElementById("downloadshow").className="list-group-item"
        document.getElementById("expenseshow").className="list-group-item"
    }
    }
    document.getElementById("downloadshow").onclick=async ()=>{
        const token = localStorage.getItem("token");
    const decodeToken = parseJwt(token);
    const ispremiumuser = decodeToken.ispremiumuser;
    if(ispremiumuser){
        document.getElementById("leaderboard1").style.display="none";
        document.getElementById("downloadhistory").style.display="block"
        document.getElementById("downloadshow").className="list-group-item active"
        document.getElementById("leadershow").className="list-group-item"
        document.getElementById("expenseshow").className="list-group-item"
    }

    }
    document.getElementById("expenseshow").onclick=async ()=>{
        const token = localStorage.getItem("token");
    const decodeToken = parseJwt(token);
    const ispremiumuser = decodeToken.ispremiumuser;
    if(ispremiumuser){
        document.getElementById("expenseshow").className="list-group-item active"
        
        document.getElementById("downloadshow").className="list-group-item "
        document.getElementById("leadershow").className="list-group-item"
        document.getElementById("reportshown").style.display="block"
  document.getElementById("expensetracker").style.display="none"
    }

    }