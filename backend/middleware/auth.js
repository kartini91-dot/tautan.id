const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Memverifikasi JWT token dan attach user ke request
 */
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan'
      });
    }
    
    // Verifikasi JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }
    
    // Check jika user di-block
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda telah diblokir'
      });
    }
    
    // Check jika akun terkunci
    if (user.isAccountLocked()) {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda terkunci. Coba lagi dalam 1 jam'
      });
    }
    
    // Check jika password sudah diubah setelah token dibuat
    if (user.passwordChangedAt) {
      const passwordChangedTime = Math.floor(user.passwordChangedAt.getTime() / 1000);
      if (passwordChangedTime > decoded.iat) {
        return res.status(401).json({
          success: false,
          message: 'Password sudah diubah. Silakan login kembali'
        });
      }
    }
    
    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token sudah expired'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid'
    });
  }
};

/**
 * Authorization Middleware
 * Memverifikasi role user
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke resource ini'
      });
    }
    
    next();
  };
};

/**
 * 2FA Verification Middleware
 * Memastikan 2FA sudah diverifikasi jika diaktifkan
 */
const verify2FA = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (user.twoFAEnabled) {
      // Check apakah ada 2FA verification dalam session
      const twoFAToken = req.headers['x-2fa-token'];
      
      if (!twoFAToken) {
        return res.status(401).json({
          success: false,
          message: '2FA verification diperlukan'
        });
      }
      
      // Verifikasi 2FA token
      try {
        const decoded = jwt.verify(twoFAToken, process.env.JWT_SECRET);
        if (decoded.type !== '2fa' || decoded.userId !== user._id.toString()) {
          return res.status(401).json({
            success: false,
            message: '2FA token tidak valid'
          });
        }
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: '2FA token tidak valid atau sudah expired'
        });
      }
    }
    
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat verifikasi 2FA'
    });
  }
};

/**
 * Rate Limiting Middleware
 * Membatasi jumlah request per IP
 */
const rateLimit = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 menit
  const maxRequests = 100;
  
  // Ini adalah implementasi sederhana, untuk production gunakan npm package 'express-rate-limit'
  if (!req.app.locals.requestCounts) {
    req.app.locals.requestCounts = {};
  }
  
  const requestLog = req.app.locals.requestCounts[ip] || [];
  const recentRequests = requestLog.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return res.status(429).json({
      success: false,
      message: 'Terlalu banyak request. Coba lagi nanti.'
    });
  }
  
  recentRequests.push(now);
  req.app.locals.requestCounts[ip] = recentRequests;
  
  next();
};

/**
 * Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error untuk debugging
  console.error(err);
  
  // Sentry logging bisa ditambahkan di sini
  // Sentry.captureException(err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan pada server';
  
  // Validasi error dari express-validator
  if (err.array && typeof err.array === 'function') {
    const validationErrors = err.array();
    return res.status(400).json({
      success: false,
      message: 'Validasi input gagal',
      errors: validationErrors.map(e => ({
        field: e.param,
        message: e.msg
      }))
    });
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      success: false,
      message: 'Validasi data gagal',
      errors
    });
  }
  
  // Duplicate key error (MongoDB)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} sudah terdaftar`
    });
  }
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Membership-based Access Control
 */
const checkMembership = (requiredMembership) => {
  return (req, res, next) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi'
      });
    }
    
    const membershipLevels = {
      'Basic': 1,
      'Premium': 2,
      'Premium+': 3
    };
    
    const userLevel = membershipLevels[user.membership] || 0;
    const requiredLevel = membershipLevels[requiredMembership] || 0;
    
    if (userLevel < requiredLevel) {
      return res.status(403).json({
        success: false,
        message: `Membership ${requiredMembership} diperlukan untuk akses ini`
      });
    }
    
    next();
  };
};

/**
 * Supplier Verification Middleware
 */
const verifySupplier = (req, res, next) => {
  const user = req.user;
  
  if (user.role !== 'supplier') {
    return res.status(403).json({
      success: false,
      message: 'Hanya supplier yang dapat mengakses resource ini'
    });
  }
  
  if (!user.isBusinessVerified) {
    return res.status(403).json({
      success: false,
      message: 'Business verification diperlukan'
    });
  }
  
  next();
};

module.exports = {
  authenticate,
  authorize,
  verify2FA,
  rateLimit,
  errorHandler,
  checkMembership,
  verifySupplier
};
