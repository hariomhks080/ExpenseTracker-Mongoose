const path=require("path")
const express=require("express");
const cors = require('cors');
require('dotenv').config();

const Expense = require('./model/expense');
const signup = require('./model/signup')
const order=require("./model/orders")
const Forgotpasswords = require('./model/forgetpassword');
const download=require("./model/download")



const signuproutes=require("./routes/signup")
const signinroutes=require("./routes/signin")
const expenseroutes=require("./routes/expense")
const purchaseroutes=require("./routes/purchase")
const premiumroutes=require("./routes/premiumfeature")
const passwordroutes=require("./routes/password")

const app=express();
app.use(cors());

const bodyParser=require("body-parser")
const sequelize = require('./util/database');



app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

app.use(signinroutes)
app.use(signuproutes)
app.use(expenseroutes)
app.use(premiumroutes)
app.use(purchaseroutes)
app.use(passwordroutes)


signup.hasMany(Expense);
Expense.belongsTo(signup,{constraints:true, onDelete:'CASCADE'}); 
signup.hasMany(order);
order.belongsTo(signup,{constraints:true, onDelete:'CASCADE'})
signup.hasMany(Forgotpasswords);
Forgotpasswords.belongsTo(signup,{constraints:true,onDelete:'CASCADE'});
signup.hasMany(download)
download.belongsTo(signup,{constraints:true,onDelete:'CASCADE'});
sequelize.sync().then(result => {

    app.listen(process.env.PORT);

}).catch(err => {
    console.log(err)
})
