const Razorpay = require("razorpay");
const Order = require("../model/orders");
const jwt=require("jsonwebtoken")
const sequelize = require("../util/database");
function generateacesstoken(id,name,ispremiumuser,email){
    return jwt.sign({userId:id,name:name,ispremiumuser,email},process.env.SECRET_KEY,{expiresIn:'1h'})
  }
exports.purchasemembership = async (req, res) => {
  console.log("dummy")

  try {
    var rzp = new Razorpay({
      key_id:process.env.KEY_ID,
      key_secret:process.env.KEY_SECRET,
    });
    const amount = 2500;
    rzp.orders.create({ amount, currency: "INR" },(err, order) => {
      if (err) {
       
        throw new Error(JSON.stringify(err));
      }
      req.user
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then( () => {
         
          return res
            .status(201)
            .json({ orderid: order.id, key_id: rzp.key_id });
        })
        .catch(async (err) => {
         
          throw new Error(err);
        });
    });
  } catch (err) {
   
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  const t=await sequelize.transaction();
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } },{transaction:t});

    const promise1 = order.update({
      paymentid: payment_id,
      status: "Sucessful",
    });
    const promise2 = req.user.update({ ispremiumuser: "true" },{transaction:t});
    const user=req.user
    
   
    Promise.all([promise1, promise2])
      .then(async () => {
       await t.commit()
        return res
          .status(202)
          .json({ sucess: true, message: "Transaction Sucessful",token:generateacesstoken(user.id,user.name,user.ispremiumuser,user.email) });
      })
      .catch(async (err) => {
       await t.rollback()
        throw new Error(err);
      });
  } catch (err) {
   await t.rollback()
    res.status(403).json({ errpr: err, message: "Something Went wrong" });
  }
};

exports.failedTransactionStatus = async (req, res) => {
  const t=await sequelize.transaction();
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } });

    console.log("8", new Date().toJSON());
    const promise1 = order.update({ paymentid: payment_id, status: "Failed" },{transaction:t});
    const promise2 = req.user.update({ ispremiumuser: "false" },{transaction:t});
    Promise.all([promise1, promise2])
      .then(() => {
        t.commit()
        return res
          .status(202)
          .json({ sucess: false, message: "Transaction Failed" });
      })
      .catch((err) => {
        t.rollback()
        throw new Error(err);
      });
  } catch (err) {
    t.rollback()
    res.status(403).json({ errpr: err, message: "Something Went wrong" });
  }
};

