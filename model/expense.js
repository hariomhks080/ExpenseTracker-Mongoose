


const mongoose = require('mongoose');
const { Schema } = mongoose;

const expensesSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellingprice: {
    type: String,
    required: true
  },
  productname: {
    type: String,
    required: true
  },
  items: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model('Expenses', expensesSchema);
