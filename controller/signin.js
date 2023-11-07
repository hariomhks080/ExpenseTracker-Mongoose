const path=require("path")
const rootdir=require("../util/path")
const Signup = require("../model/signup")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

function isstringisvalid(string){
  if(string===undefined || string.length===0){
    return true
  }else{
    return false
  }
}
function generateacesstoken(id,name,ispremiumuser,email){
  return jwt.sign({userId:id,name:name,ispremiumuser,email},process.env.SECRET_KEY,{expiresIn:'1h'})
}

exports.getsignin=(req,res,next)=>{
    res.sendFile(path.join(rootdir,"views","signin.html"))
}
exports.postsignin=async (req,res,next)=>{
  // try{
  //   const password=req.body.password
  //   const email=req.body.email

  // const user=await Signup.findOne({where:{password:password,email:email}})
  // console.log(user[0].password)
  // if(user){
  //   res.status(200).json(user)
  // }else{
  //   res.status(401).json("password not matching")
  // }


  // }catch(err){

//   // }
//   const password=req.body.password
//   const email=req.body.email
//   if(isstringisvalid(email) || isstringisvalid(password)){
//     return res.status(400).json("Email Or Id missing")
//   }
//   try{

//    const user=await Signup.findAll({where:{email:email}})
//    if(user.length>0){
//     if(user[0].password===password){
//       res.status(200).json("User Logged Sucessfully")
//     }else{
//       res.status(400).json("Password is incorrect")
//     }
//    }else{
//     res.status(404).json("User Does Not Exists")
//    }

//   }catch(err){
// res.status(500).json(err)
//   }
console.log(req.body)
   try{
    const password=req.body.password
    const email=req.body.email;
    if(isstringisvalid(email) || isstringisvalid(password)){
          return res.status(400).json("Email Or Id missing")
        }
        const user=await Signup.findAll({where:{email:email}})
        // console.log(user)
        // console.log(password)
        if(user.length>0){
           bcrypt.compare(password,user[0].password,(err,result)=>{
            if(err){
              res.status(500).json({message:"Something Went Wrong"}) 
            }
            if(result==true){
              res.status(200).json({message:"User Logged Sucessfully",token:generateacesstoken(user[0].id,user[0].name,user[0].ispremiumuser,user[0].email)})
            }else{
              return res.status(400).json({message:"Password is incorrect"}) 
            }
          })
        } else{
          res.status(404).json({message:"User Does Not Exists"})
        } 
   }catch(err){
    res.status(500).json(err)
   }











}
