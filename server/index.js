const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Log environment variables for debugging
console.log('🔧 Environment Variables:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   PORT (from env):', process.env.PORT);
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
console.log('   CLIENT_URL:', process.env.CLIENT_URL || 'Not set (defaulting to localhost)');

const PORT = process.env.PORT || 3000; // Railway provides PORT, default 3000 for safety

console.log(`🚀 Starting server on port ${PORT}...`);

// Middleware
app.use(express.json());

// CORS Configuration - Allow Vercel frontend and localhost
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5174',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'x-platform', 'Cookie'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware (handles preflight automatically)
app.use(cors(corsOptions));

// Middleware to parse cookies
app.use(cookieParser());

// Database Connection - with timeout and detailed logging
console.log('📦 Connecting to MongoDB...');
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not set!');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000, // 30 seconds timeout
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('   Full error:', err);
    process.exit(1); // Exit if DB fails - Railway will restart
  });

// Import Routes (do this AFTER DB connection to ensure models are registered)
const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const cardRoutes = require('./routes/cardRoutes');

console.log('🔌 Routes loaded: auth, wallet, transactions, cards');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/cards', cardRoutes);

// Health check endpoint (for Railway)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Root route - confirm API is running
app.get('/', (req, res) => {
  res.json({ 
    message: 'Novapay API Server Running',
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler (must be AFTER all routes)
app.use((err, req, res, next) => {
  console.error('❌ Backend Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

// Start Server
// Start Server with error handling and delayed start to ensure DB is ready
const startServer = () => {
  try {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
      console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
      console.log('✅ Server is ready to accept connections');
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

// Start after DB connection is confirmed
mongoose.connection.once('open', () => {
  console.log('✅ MongoDB connection is open - starting server...');
  startServer();
});

// Fallback: if mongoose already connected quickly
mongoose.connection.on('connected', () => {
  console.log('📦 MongoDB connected');
});

// Handle connection errors
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Start server even if DB connection takes a while (but log when ready)
setTimeout(() => {
  if (!mongoose.connection.readyState) {
    console.warn('⚠️ MongoDB connection taking long, starting server anyway...');
    startServer();
  }
}, 5000); // Wait max 5 seconds for DB
