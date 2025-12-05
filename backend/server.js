require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import middleware
const { errorHandler } = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const suppliersRoutes = require('./routes/suppliers');

const app = express();

/**
 * Security Middleware
 */
app.use(helmet()); // Set security HTTP headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

/**
 * Rate Limiting
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Terlalu banyak request dari IP ini, coba lagi nanti.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit login attempts
  message: 'Terlalu banyak percobaan login, coba lagi dalam 15 menit'
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

/**
 * Body Parser Middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/**
 * Request Logger Middleware (development)
 */
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

/**
 * Database Connection
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.NODE_ENV === 'production'
      ? process.env.MONGODB_URI
      : process.env.MONGODB_LOCAL;

    console.log(`Menghubungkan ke MongoDB: ${mongoUri}`);

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Fail fast in development so startup shows errors quickly
      serverSelectionTimeoutMS: process.env.NODE_ENV === 'production' ? 30000 : 5000,
      connectTimeoutMS: process.env.NODE_ENV === 'production' ? 30000 : 10000
    });

    console.log('✓ MongoDB berhasil terhubung');
  } catch (error) {
    console.error('✗ Error koneksi MongoDB:', error.message);
    process.exit(1);
  }
};

connectDB();

/**
 * Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/suppliers', suppliersRoutes);

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * API Documentation Endpoint
 */
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Tautan ID API v2.9',
    endpoints: {
      auth: '/api/auth',
      suppliers: '/api/suppliers',
      products: '/api/products',
      orders: '/api/orders',
      chat: '/api/chat'
    },
    documentation: 'https://docs.tautan-id.com'
  });
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan',
    path: req.path
  });
});

/**
 * Global Error Handler
 */
app.use(errorHandler);

/**
 * Start Server
 */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║      TAUTAN ID Backend Server      ║
║          v2.9.0                    ║
╚════════════════════════════════════╝

✓ Server berjalan di port ${PORT}
✓ Environment: ${process.env.NODE_ENV || 'development'}
✓ Database: ${process.env.MONGODB_LOCAL || 'MongoDB Cloud'}

Akses API di: http://localhost:${PORT}/api
Health check: http://localhost:${PORT}/health
  `);
});

/**
 * Graceful Shutdown
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM diterima. Menutup server...');
  server.close(() => {
    console.log('Server ditutup');
    mongoose.connection.close();
    process.exit(0);
  });
});

module.exports = app;
