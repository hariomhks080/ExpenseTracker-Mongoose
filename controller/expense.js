const path = require("path");
const rootdir = require("../util/path");
const Expense = require("../model/expense");
const sequelize = require("../util/database");

exports.getexpense = (req, res, next) => {
  res.sendFile(path.join(rootdir, "views", "expense.html"));
};
exports.postexpense = async (req, res, next) => {
  const sellingprice = req.body.sellingprice;
  const fooditems = req.body.fooditems;
  const items = req.body.items;
  const edit = req.body.edit;
  const previousprice = req.body.previousprice;
  const date=req.body.date;

  const totalExpenses1 = Number(req.user.totalExpenses) + Number(sellingprice);
  const totalExpenses2 =
    Number(req.user.totalExpenses) +
    Number(sellingprice) -
    Number(previousprice);
const t=await sequelize.transaction();
  const user = req.user;
  if (edit == "") {
    try {
      const promise1 = await user.createExpense({
        sellingprice: sellingprice,
        productname: fooditems,
        items: items,
        name: user.name,
        date:date
      },{transaction:t});
      const promise2 = await user.update({
        totalExpenses: totalExpenses1,
      },{transaction:t});
      Promise.all([promise1, promise2])
        .then(async () => {
          await t.commit()
          res.json(promise1);
        })
        .catch(async (err) => {
          await t.rollback()
          throw new Error(err);
        });
    } catch (err) {
      await t.rollback()
      res.status(404).json({ err: err });
    }
  } else {
    try {
      const promise1 = await Expense.findByPk(edit).then((product) => {
        product.sellingprice = sellingprice;

        product.productname = fooditems;
        product.items = items;
        product.name = user.name;
        product.date=date;
        return product.save();
      },{transaction:t});
      const promise2 = await user.update({
        totalExpenses: totalExpenses2,
      },{transaction:t});
      Promise.all([promise1, promise2])
        .then(async () => {
          await t.commit()
          res.json(promise1);
        })
        .catch(async (err) => {
          await t.rollback()
          throw new Error(err);
        });
    } catch (err) {
      await t.rollback()
      res.status(404).json({ err: err });
    }
  }
};
exports.getallexpense = async (req, res, next) => {
  try {
    const user = req.user;
    const data = await user.getExpenses();
    res.json(data);
  } catch (err) {
    res.json(404);
  }
};
exports.postDeleteProduct = async (req, res, next) => {
  const user = req.user;

  const totalExpenses = Number(req.user.totalExpenses) - req.body.previousprice;
  const t=await sequelize.transaction();
  try {
    const prodId = req.params.productId;
    const promise1 = await Expense.findByPk(prodId,{transaction:t});
    const promise2 = await user.update({
      totalExpenses: totalExpenses,
    },{transaction:t});
    Promise.all([promise1, promise2])
      .then(async () => {
        await t.commit()
        promise1.destroy();
        res.status(200).json(promise1)
      })
      .catch(async (err) => {
        await t.rollback()
        throw new Error(err);
      });
  } catch (err) {
    await t.rollback()
    res.status(404).json({ err: err });
  }
};
exports.getpagewiseexpense = async (request, response, next) => {
  try {
      const page = request.query.page;
      const user = request.user;
      const limit = Number(request.query.noitem);
      const offset = (page - 1) * 5;
      const expenses = await user.getExpenses({
          offset: offset,
          limit: limit
      });
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
