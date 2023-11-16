const path = require("path");
const rootdir = require("../util/path");
const User = require("../model/signup");
const ForgotPassword=require("../model/forgetpassword")
const bcrypt=require("bcrypt")
const Expense = require("../model/expense");
const sequelize = require("../util/database");
const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.API_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi();
exports.getformforgetpassword=(req,res)=>{
    res.sendFile(path.join(rootdir, "views", "forgetpassword.html"));
}
exports.forgetpassword=async (req,res)=>{
    console.log(req.body)
    try {
        const { email } = req.body;
        const user = await User.findOne({
            where: {
                email: email
            }
        });
      
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
            const resetresponse = await user.createForgotpassword({});
           console.log("123",resetresponse)
            const { id } = resetresponse;
            const mailresponse = await tranEmailApi.sendTransacEmail({
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
        const passwordreset = await ForgotPassword.findByPk(id);
        if (passwordreset.isactive) {
            passwordreset.isactive = false;
            await passwordreset.save();
            res.status(200).sendFile(path.join(rootdir, "views", "resetpassword.html"));
        } else {
           throw new Error(err)
        }

    } catch (error) {
        return res.status(401).json({ message: "Link has been expired" })
    }
}
exports.resetpassword=async (req,res)=>{
   
    try {
        const { resetid, newpassword } = req.body;
        const passwordreset = await ForgotPassword.findByPk(resetid);
        const currentTime = new Date();
        console.log(currentTime)
        const createdAtTime = new Date(passwordreset.createdAt);
        console.log(createdAtTime)
        const timeDifference = currentTime - createdAtTime;
        console.log(timeDifference)
        const timeLimit =  60 * 1000; 
        console.log(timeLimit)
        if(timeDifference <= timeLimit){
            const hashedPassword = await bcrypt.hash(newpassword, 10);
            await User.update(
                {
                    password: hashedPassword
                },
                {
                    where: { id: passwordreset.userId }
                }
            );
            res.status(200).json({ message: "Password reset successful." });
        }else{
          
           throw new Error(err)
        }



    } catch (error) {
         res.status(403).json({ message: "Link has expired"});
    }  
}
