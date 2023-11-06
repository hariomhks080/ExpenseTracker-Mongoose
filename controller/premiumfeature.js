
const User = require("../model/signup");

const userservices=require("../services/userservices")
const S3services=require("../services/S3services")





// exports.getAllexpense = async (req, res) => {
//     try {
//       const data = await Expense.findAll();
  
//       let product = [];
//       data.map((ele) => {
//         const id = product.findIndex((id) => id.id === ele.userId);
        
//         const existingitem = product[id];
//         if (existingitem) {
//           const update = {
//             ...existingitem,
//             price: existingitem.price + Number(ele.sellingprice),
//           };
//           product[id] = update;
//         } else {
//           product.push({
//             name: ele.name,
//             id: ele.userId,
//             price: Number(ele.sellingprice),
//           });
//         }
//       });
  
//       res.status(200).json(product);
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ msg: "Something Went Wrong" });
//     }
//   };
  exports.getAllexpense = async (req, res) => {
    try {
        const leaderbordofuser=await User.findAll({
             
          attributes: ['id', 'name', 'totalExpenses'],
          order: [['totalExpenses', 'DESC']],
          limit:15,
          order:[["totalExpenses","DESC"]]
        })
    //   const userAggregatedExpenses= await Expense.findAll({ 
    //     attributes:["userId",[sequelize.fn("sum",sequelize.col("sellingprice")),"total_cost"]],
    //     group:["userId"]
    //   });
     
//   var userLeaderBoardDetails=[]
//     users.forEach((user)=>{
//         userLeaderBoardDetails.push({name:user.name,total_cost:userAggregatedExpenses[user.id] || 0})      
//     }) 
//     console.log(userLeaderBoardDetails)
//     userLeaderBoardDetails.sort((a,b)=>b.total_cost-a.total_cost)
// let product = [];
//       leaderbordofuser.map((ele) => {
//         product.push({id:ele.id,name:ele.name,totalExpenses:ele.totalExpenses})
//       })
      res.status(200).json(leaderbordofuser)
    } catch (err) {
     
      res.status(500).json({ msg: "Something Went Wrong" });
    }
  };
  exports.downloadexpense=async (req,res)=>{
    try{
      const user=req.user;
const expenses=await userservices.getExpenses(req)
//console.log(expenses)

const stringfiedExpenses=JSON.stringify(expenses)
const filename=`Expense${user.id}/${new Date().toString()}.txt`
const fileURL=await S3services.uploadToS3(stringfiedExpenses,filename)
await user.createDownload({
  downloadUrl:fileURL
})
res.status(200).json({fileURL,sucess:true,err:null})
    }catch(err){
      res.status(500).json({fileURL:"",sucess:false,err:err})
    }
  }
  exports.getDownloadhistory = async(request,response,next) =>{
    try {
      const user = request.user;
      const history = await user.getDownloads();
      response.status(200).json(history);
      
    } catch (error) {
      console.log(error);
      return response.status(401).json({ message: 'Unable to fetch history' });
    }
  }
  
   