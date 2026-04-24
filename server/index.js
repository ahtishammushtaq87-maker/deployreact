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

const PORT = process.env.PORT || 3000;
console.log(`🚀 Starting server on port ${PORT}...`);

// Middleware - apply immediately
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5174',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'x-platform', 'Cookie'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(cookieParser());

// Health check endpoints - DEFINE BEFORE ANY OTHER ROUTES
// These must respond instantly for Railway health checks
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Novapay API Server Running',
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Database Connection - connect in background
console.log('📦 Connecting to MongoDB...');
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not set!');
}

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

mongoose.connection.on('connected', () => {
  console.log('📦 MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err.message);
});

// Import Routes
let authRoutes, walletRoutes, transactionRoutes, cardRoutes;

try {
  authRoutes = require('./routes/authRoutes');
  walletRoutes = require('./routes/walletRoutes');
  transactionRoutes = require('./routes/transactionRoutes');
  cardRoutes = require('./routes/cardRoutes');
  console.log('✅ Routes loaded successfully: auth, wallet, transactions, cards');
} catch (err) {
  console.error('❌ Error loading routes:', err.message);
  console.error(err.stack);
}

// API Routes (only if routes loaded successfully)
if (authRoutes) app.use('/api/auth', authRoutes);
if (walletRoutes) app.use('/api/wallet', walletRoutes);
if (transactionRoutes) app.use('/api/transactions', transactionRoutes);
if (cardRoutes) app.use('/api/cards', cardRoutes);

// Global Error Handler (must be AFTER all routes)
app.use((err, req, res, next) => {
  console.error('❌ Backend Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

// Start Server Immediately
console.log(`🔌 Attempting to bind to port ${PORT} on 0.0.0.0...`);

try {
  const server = app.listen(PORT, '0.0.0.0', () => {
    const actualPort = server.address().port;
    console.log(`✅ Server successfully listening on port ${actualPort}`);
    console.log(`✅ Health endpoint: http://0.0.0.0:${actualPort}/health`);
    console.log(`✅ Root endpoint: http://0.0.0.0:${actualPort}/`);
    console.log(`✅ Server is now ACCEPTING CONNECTIONS on 0.0.0.0:${actualPort}`);
  });

  server.on('listening', () => {
    console.log(`🎯 Server is now listening on port ${server.address().port}`);
  });

  server.on('error', (err) => {
    console.error('❌ Server error:', err.code, err.message);
    if (err.code === 'EADDRINUSE') {
      console.error(`   Port ${PORT} is already in use by another process`);
      console.error('   This means Railway provided PORT but something else is listening');
    } else if (err.code === 'EACCES') {
      console.error('   Permission denied - need higher privileges');
    }
    process.exit(1);
  });

  server.on('connection', (socket) => {
    console.log(`🔗 New connection accepted from ${socket.remoteAddress}:${socket.remotePort}`);
  });

} catch (err) {
  console.error('❌ Failed to start server:', err.code, err.message);
  console.error('   Stack:', err.stack);
  process.exit(1);
}

// Log unhandled rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});
    process.exit(1);
  });

} catch (err) {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
}
