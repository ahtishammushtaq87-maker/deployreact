const mongoose = require('mongoose');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { phone: rawPhone, name, password, transactionPin } = req.body;
    const phone = rawPhone.replace(/\D/g, '');

    // Validate required fields
    if (!phone || !name || !password || !transactionPin) {
      return res.status(400).json({ message: 'All fields are required (Phone, Name, Password, and PIN)' });
    }

    // Validate PIN is exactly 4 digits
    if (!/^\d{4}$/.test(transactionPin)) {
      return res.status(400).json({ message: 'Transaction PIN must be exactly 4 digits' });
    }

    // Check if user exists
    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      phone,
      name,
      password, // Hashed in model pre-save
      transactionPin, // Hashed in model pre-save
    });

    if (user) {
      // Create associated wallet with DEMO balances for university project
      await Wallet.create({
        userId: user._id,
        balances: [
          { currency: 'PKR', amount: mongoose.Types.Decimal128.fromString('50000.00') },
          { currency: 'USD', amount: mongoose.Types.Decimal128.fromString('500.00') },
          { currency: 'EUR', amount: mongoose.Types.Decimal128.fromString('400.00') },
          { currency: 'GBP', amount: mongoose.Types.Decimal128.fromString('300.00') },
        ],
      });

      const token = generateToken(user._id);

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        kycStatus: user.kycStatus,
        token: token
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { phone: rawPhone, password } = req.body;
    const phone = rawPhone?.replace(/\D/g, '') || '';

    const user = await User.findOne({ phone });

    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        kycStatus: user.kycStatus,
        token: token
      });
    } else {
      res.status(401).json({ message: 'Invalid phone or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
exports.logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -transactionPin');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
