const User = require("../model/signup");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function isstringisvalid(string) {
  if (string === undefined || string.length === 0) {
    return true;
  } else {
    return false;
  }
}
function generateacesstoken(id, name, ispremiumuser, email) {
  return jwt.sign(
    { userId: id, name: name, ispremiumuser, email },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
}

exports.getsignin = (req, res, next) => {
  res.sendFile("signin.html", { root: "views" });
};
exports.postsignin = async (req, res, next) => {
 
  try {
    const password = req.body.password;
    const email = req.body.email;
    if (isstringisvalid(email) && isstringisvalid(password)) {
      return res.status(400).json("Email Or Id missing");
    }
    const user = await User.findOne({ email: email });

    if (!user) {
     
      res.status(404).json({ message: "User Does Not Exists" });
    } else {
      const isPasswordvalid =await bcrypt.compare(password, user.password);
     
      if(isPasswordvalid){
        res
              .status(200)
              .json({
                message: "User Logged Sucessfully",
                token: generateacesstoken(
                  user._id,
                  user.name,
                  user.ispremiumuser,
                  user.email
                ),
              });
      }else{
        return res.status(401).json({message:"Invalid Password"})
      }
   
    }
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
};
