const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.Expense_Tracker, process.env.Root_ID, process.env.Password_Id, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
 
});

module.exports = sequelize;
