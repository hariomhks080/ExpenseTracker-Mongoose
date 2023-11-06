const jwt = require('jsonwebtoken');
const User = require('../model/signup');
 

exports.authorization = async(req,res,next)=>{
    try {
        const token = req.header("Authorization");
        //console.log(token)
        const user = jwt.verify(token,process.env.SECRET_KEY);
       // console.log(user)
      // console.log("userid----",user.userId)
       User.findByPk(user.userId).then(user=>{
        req.user=user
        //console.log(user)
        next()
       })
        
    } catch (error) {
       console.log(error)
       return res.status(400).json({sucess:false,message:"authentician failed"})
    }
}