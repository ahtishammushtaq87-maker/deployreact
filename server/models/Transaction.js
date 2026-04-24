const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() { return this.type !== 'Deposit'; }
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() { return this.type !== 'Withdraw'; }
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'PKR',
  },
  type: {
    type: String,
    enum: ['Transfer', 'Deposit', 'Withdraw', 'BillPayment', 'Exchange'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending',
  },
  referenceId: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  metadata: {
    exchangeRate: Number,
    fromCurrency: String,
    toCurrency: String,
    fee: Number,
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
