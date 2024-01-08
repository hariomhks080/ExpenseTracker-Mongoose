const Razorpay = require("razorpay");
const User = require("../model/signup");
const jwt = require("jsonwebtoken");

function generateacesstoken(id, name, ispremiumuser, email) {
  return jwt.sign(
    { userId: id, name: name, ispremiumuser, email },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
}
exports.purchasemembership = async (req, res) => {
  console.log("dummy");

  try {
    var rzp = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });
    const amount = 2500;
    const order = await rzp.orders.create({ amount, currency: "INR" });

    await req.user.updatecreatedorder(order.id, order.status);
    return res.status(201).json({ orderid: order.id, key_id: rzp.key_id });
  } catch (err) {
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;

    await req.user.updatesucessfullorder(payment_id, order_id);
    const user = req.user;

    return res
      .status(202)
      .json({
        sucess: true,
        message: "Transaction Sucessful",
        token: generateacesstoken(
          user.id,
          user.name,
          user.ispremiumuser,
          user.email
        ),
      });
  } catch (err) {
    res.status(403).json({ errpr: err, message: "Something Went wrong" });
  }
};

exports.failedTransactionStatus = async (req, res) => {
  
  try {
    const { payment_id, order_id } = req.body;
    await req.user.updatefailedorder(payment_id, order_id);
    return res
      .status(202)
      .json({ sucess: false, message: "Transaction Failed" });
  } catch (err) {
    res.status(403).json({ errpr: err, message: "Something Went wrong" });
  }
};
