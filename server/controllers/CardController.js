const Card = require('../models/Card');
const crypto = require('crypto');

// @desc    Add a new card (Simulated Tokenization)
// @route   POST /api/cards
// @access  Private
exports.addCard = async (req, res) => {
  try {
    const { cardNumber, cardHolderName, expiryDate, cardType } = req.body;

    if (!cardNumber || !cardHolderName || !expiryDate || !cardType) {
      return res.status(400).json({ message: 'Please provide all card details' });
    }

    // Basic validation & formatting
    const lastFour = cardNumber.slice(-4);
    
    // Create a simulated token
    const token = `tok_${crypto.randomBytes(12).toString('hex')}`;

    const card = await Card.create({
      userId: req.user._id,
      cardHolderName,
      lastFour,
      expiryDate,
      cardType,
      token,
    });

    res.status(201).json({
      message: 'Card added securely',
      card: {
        _id: card._id,
        cardHolderName: card.cardHolderName,
        lastFour: card.lastFour,
        expiryDate: card.expiryDate,
        cardType: card.cardType,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's saved cards
// @route   GET /api/cards
// @access  Private
exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({ userId: req.user._id }).select('-token');
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a card
// @route   DELETE /api/cards/:id
// @access  Private
exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findOne({ _id: req.params.id, userId: req.user._id });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    await card.deleteOne();
    res.json({ message: 'Card removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
