const Transaction = require('../models/Transaction');

// @desc    Get user transactions
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { senderId: req.user._id },
        { receiverId: req.user._id }
      ]
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
