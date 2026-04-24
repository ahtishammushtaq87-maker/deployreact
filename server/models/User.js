const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  transactionPin: {
    type: String,
    required: true,
    // Note: min/maxlength removed — PIN is hashed by pre-save hook (bcrypt = 60 chars)
    // Length validation is handled in the controller before saving.
  },
  kycStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending',
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  biometricEnabled: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Hash password and PIN before saving
userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified('transactionPin')) {
    this.transactionPin = await bcrypt.hash(this.transactionPin, 10);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to compare transaction PIN
userSchema.methods.comparePin = async function(candidatePin) {
  return await bcrypt.compare(candidatePin, this.transactionPin);
};

module.exports = mongoose.model('User', userSchema);
