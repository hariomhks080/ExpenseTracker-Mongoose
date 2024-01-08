const Expenses = require("../model/expense");

exports.getexpense = (req, res, next) => {
  res.sendFile("expense.html", { root: "views" });
};
exports.postexpense = async (req, res, next) => {

  const sellingprice = req.body.sellingprice;
  const fooditems = req.body.fooditems;
  const items = req.body.items;
  const edit = req.body.edit;
  const previousprice = req.body.previousprice;
  const date = req.body.date;
console.log(req.body)
  const totalExpenses1 = Number(req.user.totalExpenses) + Number(sellingprice);
  const totalExpenses2 =
    Number(req.user.totalExpenses) +
    Number(sellingprice) -
    Number(previousprice);

  const user = req.user;
  if (edit == "") {
   
    try {
      const promise1 = new Expenses({
        userId: user,
        sellingprice: sellingprice,
        productname: fooditems,
        items: items,
        name: user.name,
        date: date,
      });

      await promise1.save();
      await user.updateTotal(totalExpenses1);

      res.status(200).json({ message: "Data successfully added" });
    } catch (err) {
      res.status(404).json({ err: err });
    }
  }else {
    try {
      const promise1 = await Expenses.findByIdAndUpdate({_id:edit,userId:user},{sellingprice:sellingprice,productname:fooditems,items:items,name:user.name,date:date,})
      
      if (promise1) {
        await user.updateTotal(totalExpenses2);
        res.status(200).json({ message: "data succesfully updated" });
    } else {
        res.status(404).json({ message: "Data not found" });
    }
      
    } catch (err) {
     
      res.status(404).json({ err: err });
    }
  };
}

exports.getallexpense = async (req, res, next) => {
  try {
    const user = req.user;
    const data = await Expenses.find({userId:user});
    
    res.json(data);
  } catch (err) {
    res.json(404);
  }
};
exports.postDeleteProduct = async (req, res, next) => {
  const user = req.user;

  const totalExpenses = Number(req.user.totalExpenses) - req.body.previousprice;
 
  try {
    const prodId = req.params.productId;
    const promise1 = await Expenses.findByIdAndDelete({_id:prodId});
   
    if(promise1){
     
      await user.updateTotal(
        totalExpenses);
    }
    
    res.status(200).json(promise1)
   
  } catch (err) {
   
    res.status(404).json({ err: err });
  }
};
exports.getpagewiseexpense = async (request, response, next) => {
  try {
      const page = request.query.page;
      const user = request.user;
      const limit = Number(request.query.noitem);
      const offset = (page - 1) * 5;
      const expenses = await Expenses.find({
        userId:user   
      }).skip(offset).limit(limit);
      response.status(200).json({
          expenses: expenses,
         index:offset,
          hasMoreExpenses : expenses.length === limit,
          hasPreviousExpenses : page > 1
      });

  } catch (error) {
      console.log(error);
      return response.status(401).json({ message: 'Unauthorized relogin required' });
  }
}
