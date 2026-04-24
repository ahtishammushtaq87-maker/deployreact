const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const User = require('./models/User');

const normalizeData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for maintenance...');

    const users = await User.find({});
    let updatedCount = 0;

    for (const user of users) {
      const normalized = user.phone.replace(/\D/g, '');
      if (normalized !== user.phone) {
        console.log(`Normalizing: ${user.phone} -> ${normalized}`);
        user.phone = normalized;
        await user.save();
        updatedCount++;
      }
    }

    console.log(`Maintenance complete. Normalized ${updatedCount} users.`);
    process.exit(0);
  } catch (err) {
    console.error('Maintenance failed:', err);
    process.exit(1);
  }
};

normalizeData();
