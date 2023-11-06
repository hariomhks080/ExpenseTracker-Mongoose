const path=require("path")
const rootdir=require("../util/path")
const Signup=require("../model/signup")
const bcrypt=require("bcrypt")
const sequelize = require("../util/database");

exports.getsignup=(req,res,next)=>{
    res.sendFile(path.join(rootdir,"views","signup.html"))
}
exports.postsignup=async (req,res,)=>{
    const t=await sequelize.transaction();
    try{
        const email=req.body.email;
        const password=req.body.password
        const name=req.body.name
        
  
        const user=await Signup.findOne({where:{email}})
        console.log(user)
        if(user){
            return res.status(404).json({message:"User already exists"})  
        }else{
            const response=await bcrypt.hash(password,10)
            await Signup.create({
                name,
                email,
                password:response
            },{transaction:t}).then(async ()=>{
                await t.commit()
                return res.status(201).json({message:"Signup Data Sucessfully"})
            }).catch(async (err)=>{
                await t.rollback()
                throw new Error
            })
            
           
        }
       

           
          
               
    
        
        
        
    
    }catch(err){
        await t.rollback()
        return res.status(500).json({message:"1Something Went Wrong"});
       
    }
    
    
   
    
  }
  exports.getpostsignup=async (req,res,)=>{
    console.log(req.body)
    try{
        const data=await Signup.findAll()
            console.log(data)
            let product=[]
            
            data.map((ele)=>{
                product.push({email:ele.email,id:ele.id})
            })
           res.status(200).json(product)
    }catch(err){
        console.log(err)
        res.status(500).json({msg:"2Something Went Wrong"})
    }
    
}