const express = require('express');
const router = express.Router();
const { getWallet, exchangeCurrency, transferMoney, demoTopUp } = require('../controllers/WalletController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWallet);
router.post('/exchange', protect, exchangeCurrency);
router.post('/transfer', protect, transferMoney);
router.post('/demo-topup', protect, demoTopUp);

module.exports = router;
