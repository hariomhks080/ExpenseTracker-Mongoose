const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Expense = sequelize.define('expense', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  
  sellingprice: Sequelize.STRING,
  productname: Sequelize.STRING,
  items:Sequelize.STRING,
  name:Sequelize.STRING,
  date:Sequelize.STRING
  
});

module.exports = Expense;
