require('dotenv').config();
const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const uri = process.env.url;

const PORT = process.env.PORT;


const signuproutes=require("./routes/signup")
const signinroutes=require("./routes/signin")
const expenseroutes=require("./routes/expense")
const purchaseroutes=require("./routes/purchase")
const premiumroutes=require("./routes/premiumfeature")
const passwordroutes=require("./routes/password")

const app=express();
app.use(cors());

const bodyParser=require("body-parser")




app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

app.use(signinroutes)
app.use(signuproutes)
app.use(expenseroutes)
app.use(premiumroutes)
app.use(purchaseroutes)
app.use(passwordroutes)



async function initiate(){
    try {
        await mongoose.connect(uri)
        app.listen(PORT,()=>{
            console.log(`Server is running at ${PORT}`);
        });       
    } catch (error) {
        console.log(error);
    }
}
initiate();