const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');

/**
 * User Schema - Skema pengguna untuk Tautan ID
 * Mendukung role supplier dan buyer dengan membership berbeda
 */
const userSchema = new mongoose.Schema({
  // Informasi Dasar
  fullName: {
    type: String,
    required: [true, 'Nama lengkap diperlukan'],
    trim: true,
    minlength: [3, 'Nama minimal 3 karakter']
  },
  
  email: {
    type: String,
    required: [true, 'Email diperlukan'],
    unique: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Format email tidak valid']
  },
  
  phoneNumber: {
    type: String,
    required: [true, 'Nomor telepon diperlukan'],
    match: [/^(\+62|0)[0-9]{9,12}$/, 'Format nomor telepon tidak valid']
  },
  
  // Password & Security
  password: {
    type: String,
    required: [true, 'Password diperlukan'],
    minlength: [8, 'Password minimal 8 karakter'],
    select: false // Tidak include saat query default
  },
  
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // 2FA Configuration
  twoFAEnabled: {
    type: Boolean,
    default: false
  },
  twoFASecret: {
    type: String,
    select: false
  },
  twoFABackupCodes: {
    type: [String],
    select: false
  },
  
  // Profil Pengguna
  role: {
    type: String,
    enum: ['buyer', 'supplier', 'admin'],
    default: 'buyer',
    required: true
  },
  
  // Membership tier
  membership: {
    type: String,
    enum: ['Basic', 'Premium', 'Premium+'],
    default: 'Basic'
  },
  
  membershipExpiresAt: Date,
  
  // Business Information (untuk supplier)
  businessName: String,
  businessType: {
    type: String,
    enum: ['Manufacturer', 'Distributor', 'Retailer', 'Service Provider', 'Other']
  },
  businessAddress: String,
  businessCity: String,
  businessProvince: String,
  businessPostalCode: String,
  businessPhone: String,
  taxId: String,
  
  // Profile Information
  profileImage: String,
  profileDescription: String,
  
  // Verification Status
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  phoneVerificationCode: String,
  phoneVerificationExpires: Date,
  
  isBusinessVerified: {
    type: Boolean,
    default: false
  },
  businessDocuments: [
    {
      documentType: String,
      documentUrl: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  
  // Affiliate & Monetization
  affiliateCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referralPoints: {
    type: Number,
    default: 0
  },
  totalReferrals: {
    type: Number,
    default: 0
  },
  commissionRate: {
    type: Number,
    default: 0.05 // 5% default
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  pendingEarnings: {
    type: Number,
    default: 0
  },
  
  // Address Information
  addresses: [
    {
      label: String,
      street: String,
      city: String,
      province: String,
      postalCode: String,
      country: String,
      isDefault: Boolean,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  
  // Preferences & Settings
  notificationPreferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: true
    },
    orderUpdates: {
      type: Boolean,
      default: true
    },
    promotionalEmails: {
      type: Boolean,
      default: false
    }
  },
  
  // Rating & Reviews
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockReason: String,
  blockedUntil: Date,
  
  // Activity Tracking
  lastLoginAt: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes untuk optimasi query
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ role: 1 });
userSchema.index({ membership: 1 });
userSchema.index({ affiliateCode: 1 });
userSchema.index({ createdAt: -1 });

// Hash password sebelum menyimpan
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    this.passwordChangedAt = Date.now() - 1000; // Untuk JWT iat check
    next();
  } catch (error) {
    next(error);
  }
});

// Generate affiliate code
userSchema.pre('save', function(next) {
  if (!this.affiliateCode && this.role === 'supplier') {
    this.affiliateCode = `AFF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

// Method: Compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

// Method: Generate password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 menit
  return resetToken;
};

// Method: Generate email verification token
userSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 jam
  return verificationToken;
};

// Method: Check account lock status
userSchema.methods.isAccountLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Method: Increment login attempts
userSchema.methods.incLoginAttempts = async function() {
  // Reset attempts jika lock sudah expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock akun setelah 5 percobaan gagal
  if (this.loginAttempts + 1 >= 5 && !this.isAccountLocked()) {
    updates.$set = { lockUntil: Date.now() + 60 * 60 * 1000 }; // 1 jam
  }
  
  return this.updateOne(updates);
};

// Method: Reset login attempts
userSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

// (Removed a conflicting virtual named 'incLoginAttempts' because a method with the same
// name is defined above. Use the 'loginAttempts' field or rename methods/virtuals if
// a different behavior is required.)

// Remove password dari response
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  delete user.twoFASecret;
  delete user.twoFABackupCodes;
  delete user.emailVerificationToken;
  delete user.phoneVerificationCode;
  return user;
};

module.exports = mongoose.model('User', userSchema);
