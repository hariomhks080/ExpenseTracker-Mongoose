
const User = require("../model/signup");

const bcrypt=require("bcrypt")
const { ObjectId } = require('mongodb');


const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.API_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi();
exports.getformforgetpassword=(req,res)=>{
    res.sendFile("forgetpassword.html",{root:"views"} );
}
exports.forgetpassword=async (req,res)=>{
   
    try {
        const { email } = req.body;
        const user = await User.findOne({
           email:email,
        }).select("email forgotPassword");
       
      
        if (user) {
            const sender = {
                email:process.env.EMAIL_ID ,
                name:process.env.NAME_ID
            }
            const receivers = [
                {
                    email: email
                }
            ]
           user.forgotPassword.push({
                isActive: true,
                createdAt: new Date()
            });
           
          
            const{forgotPassword} =  await user.save();
            const id = forgotPassword[forgotPassword.length-1]._id.toString();
            
            await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: "Reset Your password",
                htmlContent: `
              <!DOCTYPE html>
                <html>
                <head>
                    <title>Password Reset</title>
                </head>
                <body>
                    <h1>Reset Your Password</h1>
                    <p>Click the button below to reset your password:</p>
                    <button><a href="${process.env.WEBSITE}/password/reset/{{params.role}}">Reset Password</a></button>
                </body>
                </html>`, params: {
                    role: id
                }
            })
            res.status(200).json({ message: 'Password reset email sent' });
        } else {
            throw new Error(err)
        }


    } catch (error) {
        console.log(error)
        res.status(404).json({ message: 'User not found' });
    
    }
}
exports.getresetform=async (req,res)=>{
    try {
        let id = req.params.id;
       
        const user = await User.findOne({
            "forgotPassword": {
              $elemMatch: {
                "_id": new ObjectId(id)
              }
            }
          });
          const forgotPassword= user.forgotPassword;
         
          const existing= forgotPassword.find(item => item._id==id);
          console.log("ex",existing)
        if (existing.isActive) {
            existing.isActive = false;
            await user.save();
            res.status(200).sendFile( "resetpassword.html",{root:"views"});
        } else {
           throw new Error(err)
        }

    } catch (error) {
        return res.status(401).json({ message: "Link has been expired" })
    }
}
exports.resetpassword=async (req,res)=>{
   console.log("123");
    try {
        const { resetid, newpassword } = req.body;
        const passwordreset = await User.findOne({
            "forgotPassword": {
              $elemMatch: {
                "_id": new ObjectId(resetid)
              }
            }
          });
          const forgotPassword= passwordreset.forgotPassword;
         
          const existing= forgotPassword.find(item => item._id==resetid);
        const currentTime = new Date();
        console.log(currentTime)
        const createdAtTime = new Date(existing.createdAt);
        console.log(createdAtTime)
        const timeDifference = currentTime - createdAtTime;
        console.log(timeDifference)
        const timeLimit =  60 * 1000; 
        console.log("154",timeLimit)
        if(timeDifference <= timeLimit){
            const hashedPassword = await bcrypt.hash(newpassword, 10);
            passwordreset.password = hashedPassword;
             await passwordreset.save();
            res.status(200).json({ message: "Password reset successful." });
        }else{
          
           throw new Error(err)
        }



    } catch (error) {
         res.status(403).json({ message: "Link has expired"});
    }  
}
