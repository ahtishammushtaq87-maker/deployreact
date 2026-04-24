const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  balances: [
    {
      currency: {
        type: String,
        required: true,
        default: 'PKR',
      },
      amount: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
        default: 0,
      },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);
