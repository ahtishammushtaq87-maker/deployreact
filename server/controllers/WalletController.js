const mongoose = require('mongoose');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { getExchangeRate } = require('../utils/forex');
const crypto = require('crypto');

// @desc    Get user wallet and balances
// @route   GET /api/wallet
// @access  Private
exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Exchange currency (Atomic Transaction)
// @route   POST /api/wallet/exchange
// @access  Private
exports.exchangeCurrency = async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;
    const userId = req.user._id;

    if (!fromCurrency || !toCurrency || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid exchange details' });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) throw new Error('Wallet not found');

    // Find the source balance
    const sourceBalance = wallet.balances.find(b => b.currency === fromCurrency);
    if (!sourceBalance || parseFloat(sourceBalance.amount.toString()) < amount) {
      throw new Error('Insufficient balance in source currency');
    }

    // Get live exchange rate
    const rate = await getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = amount * rate;

    // Deduct from source
    sourceBalance.amount = mongoose.Types.Decimal128.fromString(
      (parseFloat(sourceBalance.amount.toString()) - amount).toFixed(8)
    );

    // Add to target
    let targetBalance = wallet.balances.find(b => b.currency === toCurrency);
    if (!targetBalance) {
      wallet.balances.push({
        currency: toCurrency,
        amount: mongoose.Types.Decimal128.fromString(convertedAmount.toFixed(8))
      });
    } else {
      targetBalance.amount = mongoose.Types.Decimal128.fromString(
        (parseFloat(targetBalance.amount.toString()) + convertedAmount).toFixed(8)
      );
    }

    await wallet.save();

    // Create Transaction Record
    const referenceId = `EXC-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    await Transaction.create({
      senderId: userId,
      receiverId: userId,
      amount: mongoose.Types.Decimal128.fromString(amount.toString()),
      currency: fromCurrency,
      type: 'Exchange',
      status: 'Completed',
      referenceId,
      description: `Exchanged ${amount} ${fromCurrency} to ${convertedAmount.toFixed(2)} ${toCurrency}`,
      metadata: {
        exchangeRate: rate,
        fromCurrency,
        toCurrency,
      }
    });

    res.json({
      message: 'Exchange successful',
      rate,
      convertedAmount,
      wallet
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add demo funds to wallet (University Project)
// @route   POST /api/wallet/demo-topup
// @access  Private
exports.demoTopUp = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    const demoFunds = [
      { currency: 'PKR', amount: 50000 },
      { currency: 'USD', amount: 500 },
      { currency: 'EUR', amount: 400 },
      { currency: 'GBP', amount: 300 },
    ];

    for (const fund of demoFunds) {
      const bal = wallet.balances.find(b => b.currency === fund.currency);
      if (bal) {
        bal.amount = mongoose.Types.Decimal128.fromString(
          (parseFloat(bal.amount.toString()) + fund.amount).toFixed(2)
        );
      } else {
        wallet.balances.push({
          currency: fund.currency,
          amount: mongoose.Types.Decimal128.fromString(fund.amount.toFixed(2)),
        });
      }
    }
    await wallet.save();
    res.json({ message: 'Demo funds added!', wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Transfer money to another user (Atomic)
// @route   POST /api/wallet/transfer
// @access  Private
exports.transferMoney = async (req, res) => {
  console.log(`[TRACER] Processing Transfer Request at ${new Date().toISOString()}`);
  try {
    const { recipientPhone: rawRecipientPhone, amount, currency, description } = req.body;
    const recipientPhone = rawRecipientPhone?.replace(/\D/g, '') || '';
    const senderId = req.user._id;

    if (!recipientPhone || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid transfer details: Missing phone or invalid amount' });
    }

    // 1. Find Sender & Recipient
    const senderWallet = await Wallet.findOne({ userId: senderId });
    const recipientUser = await User.findOne({ phone: recipientPhone });
    
    if (!recipientUser) throw new Error('Recipient not found');
    if (recipientUser._id.toString() === senderId.toString()) throw new Error('Cannot send to yourself');

    const recipientWallet = await Wallet.findOne({ userId: recipientUser._id });
    if (!recipientWallet) throw new Error('Recipient wallet not found');

    // 2. Validate Sender Balance
    const senderBalance = senderWallet.balances.find(b => b.currency === currency);
    if (!senderBalance || parseFloat(senderBalance.amount.toString()) < amount) {
      throw new Error(`Insufficient ${currency} balance`);
    }

    // 3. Sequential update balances
    senderBalance.amount = mongoose.Types.Decimal128.fromString(
      (parseFloat(senderBalance.amount.toString()) - amount).toFixed(8)
    );
    
    let recipientBalance = recipientWallet.balances.find(b => b.currency === currency);
    if (!recipientBalance) {
      recipientWallet.balances.push({ 
        currency, 
        amount: mongoose.Types.Decimal128.fromString(amount.toFixed(8)) 
      });
    } else {
      recipientBalance.amount = mongoose.Types.Decimal128.fromString(
        (parseFloat(recipientBalance.amount.toString()) + amount).toFixed(8)
      );
    }

    // Save both (sequential)
    await senderWallet.save();
    await recipientWallet.save();

    // 4. Create Ledger Entry
    const referenceId = `TRA-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    await Transaction.create({
      senderId,
      receiverId: recipientUser._id,
      amount: mongoose.Types.Decimal128.fromString(amount.toString()),
      currency,
      type: 'Transfer',
      status: 'Completed',
      referenceId,
      description: description || `Transfer to ${recipientPhone}`
    });

    res.json({ message: 'Transfer successful', referenceId, wallet: senderWallet });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
