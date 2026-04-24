const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cardHolderName: {
    type: String,
    required: true,
  },
  lastFour: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 4,
  },
  expiryDate: {
    type: String, // MM/YY
    required: true,
  },
  cardType: {
    type: String, // Visa, Mastercard, etc.
    required: true,
  },
  token: {
    type: String, // Simulated PCI-compliant token
    required: true,
    unique: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);
