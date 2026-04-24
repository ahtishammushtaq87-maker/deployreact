const express = require('express');
const router = express.Router();
const { addCard, getCards, deleteCard } = require('../controllers/CardController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addCard);
router.get('/', protect, getCards);
router.delete('/:id', protect, deleteCard);

module.exports = router;
