
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    totalExpenses: {
        type: Number,
        default: 0
    },
    ispremiumuser: {
        type: Boolean,
        default: false
    },
    downloadUrl: [{
        downloadUrl:{
            type:String
        },
        createdAt:{
            type:Date,
        }
}],
    forgotPassword: [{
        isActive:{
            type : Boolean,
        },
        createdAt:{
            type : Date,
        }
    }],
    order: {
        orderid:{
            type:String
        },
        status:{
            type:String
        },
        paymentid:{
            type:String
        },
        createdAt:{
            type:Date
        }
    }
});

userSchema.methods.updateTotal = async function(totalExpenses){
    
this.totalExpenses = totalExpenses;
return this.save();
}

userSchema.methods.updatecreatedorder = async function(id,status){
    this.order.orderid = id;
    this.order.status=status;
   
    return this.save();
    }
    userSchema.methods.updatesucessfullorder = async function(paymentid,orderid){
        this.order.status="Sucessfull";
        this.order.paymentid=paymentid;
        this.ispremiumuser=true;
        this.order.orderid = orderid;
       
       
        return this.save();
        }
        userSchema.methods.updatefailedorder = async function(paymentid,orderid){
            this.order.status="failed";
            this.order.paymentid=paymentid;
           
            this.order.orderid = orderid;
           
           
            return this.save();
            }
module.exports = mongoose.model('User', userSchema);
// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Signup = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   name:Sequelize.STRING,
//   email: {
//     type: Sequelize.STRING,
//     allowNull:false,
//     unique:true

//   },
//   password:{
//     type: Sequelize.TEXT,
//         allowNull:false 
//   },
//   ispremiumuser:Sequelize.STRING,
//   totalExpenses:{
//     type:Sequelize.INTEGER,
//     defaultValue:0
//   }
  
// });

// module.exports = Signup;

 