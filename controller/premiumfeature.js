
const User = require("../model/signup");
const Expense=require("../model/expense")

// const userservices=require("../services/userservices")
const S3services=require("../services/S3services")





  exports.getAllexpense = async (req, res) => {
    try {
        const leaderbordofuser=await User.find().select('name totalExpenses')
        .sort({ totalExpenses: -1 })
        .limit(15);
    
      res.status(200).json(leaderbordofuser)
    } catch (err) {
     
      res.status(500).json({ msg: "Something Went Wrong" });
    }
  };
  exports.downloadexpense=async (req,res)=>{
    try{
      const user=req.user;
// const expenses=await userservices.getExpenses(req)
//console.log(expenses)
const expenses=await Expense.find({userId:user})

const stringfiedExpenses=JSON.stringify(expenses)
const filename=`Expense${user.id}/${new Date().toString()}.txt`
const fileURL=await S3services.uploadToS3(stringfiedExpenses,filename)
user.downloadUrl.push({
  downloadUrl:fileURL,
  createdAt:new Date()
})
await user.save();
res.status(200).json({fileURL,sucess:true,err:null})
    }catch(err){
      res.status(500).json({fileURL:"",sucess:false,err:err})
    }
  }
  exports.getDownloadhistory = async(request,response,next) =>{
    try {
      const user = request.user;
      const history = user.downloadUrl;
      console.log("history",history)
      response.status(200).json(history);
      
    } catch (error) {
      console.log(error);
      return response.status(401).json({ message: 'Unable to fetch history' });
    }
  }
  
   