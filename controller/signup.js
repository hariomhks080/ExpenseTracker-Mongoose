const User = require("../model/signup");
const bcrypt = require("bcrypt");

exports.getsignup = (req, res, next) => {
  res.sendFile("signup.html", { root: "views" });
};
exports.postsignup = async (req, res) => {
   
  try {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    const user = await User.findOne({ email:email });
   
    if (user) {
      
      return res.status(404).json({ message: "User already exists" });
    } else {
      
      const response = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: response,
      });
      await user.save();
      return res.status(201).json({ message: "Signup Data Sucessfully" });
    }
  } catch (err) {
    
    return res.status(500).json({ message: "Something Went Wrong" });
  }
};

  
  exports.getpostsignup=async (req,res,)=>{
    
    try{
        const data=await User.find()
           
            let product=[]

            data.map((ele)=>{
                product.push({email:ele.email,id:ele.id})
            })
           res.status(200).json(product)
    }catch(err){
        console.log(err)
        res.status(500).json({msg:"Something Went Wrong"})
    }

}
