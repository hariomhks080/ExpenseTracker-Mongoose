const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Signup = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name:Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull:false,
    unique:true

  },
  password:{
    type: Sequelize.TEXT,
        allowNull:false 
  },
  ispremiumuser:Sequelize.STRING,
  totalExpenses:{
    type:Sequelize.INTEGER,
    defaultValue:0
  }
  
});

module.exports = Signup;
 