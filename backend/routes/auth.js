const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @route   POST /auth/register
 * @desc    Register user baru (buyer atau supplier)
 * @access  Public
 */
router.post('/register', validateRegister, async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      password,
      role,
      businessName,
      businessType
    } = req.body;

    // Cek apakah user sudah terdaftar
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email atau nomor telepon sudah terdaftar'
      });
    }

    // Buat user baru
    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      password,
      role,
      membership: 'Basic',
      ...(role === 'supplier' && {
        businessName,
        businessType
      })
    });

    // Simpan user
    await newUser.save();

    // Generate email verification token
    const verificationToken = newUser.createEmailVerificationToken();
    await newUser.save();

    // TODO: Kirim email verifikasi
    // await sendVerificationEmail(newUser.email, verificationToken);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil. Silakan verifikasi email Anda.',
      data: {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat registrasi'
    });
  }
});

/**
 * @route   POST /auth/login
 * @desc    Login user dan generate JWT token
 * @access  Public
 */
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password tidak valid'
      });
    }

    // Check jika akun terkunci
    if (user.isAccountLocked()) {
      return res.status(403).json({
        success: false,
        message: 'Akun terkunci karena terlalu banyak percobaan login gagal. Coba lagi dalam 1 jam'
      });
    }

    // Verifikasi password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Email atau password tidak valid'
      });
    }

    // Reset login attempts
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Check 2FA
    if (user.twoFAEnabled) {
      // Generate temporary token untuk 2FA verification
      const tempToken = jwt.sign(
        { userId: user._id.toString(), type: '2fa' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_2FA_EXPIRE || '5m' }
      );

      user.lastLoginAt = new Date();
      await user.save();

      return res.status(200).json({
        success: true,
        message: '2FA verification diperlukan',
        requiresTwoFA: true,
        tempToken
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        membership: user.membership
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    user.lastLoginAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          membership: user.membership
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat login'
    });
  }
});

/**
 * @route   POST /auth/setup-2fa
 * @desc    Setup 2FA untuk user
 * @access  Private
 */
router.post('/setup-2fa', authenticate, async (req, res) => {
  try {
    const user = req.user;

    // Generate secret untuk TOTP
    const secret = speakeasy.generateSecret({
      name: `Tautan ID (${user.email})`,
      issuer: 'Tautan ID'
    });

    // Generate QR code
    const qrCode = await qrcode.toDataURL(secret.otpauth_url);

    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () =>
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    res.status(200).json({
      success: true,
      message: '2FA setup siap',
      data: {
        secret: secret.base32,
        qrCode,
        backupCodes
      }
    });
  } catch (error) {
    console.error('Setup 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat setup 2FA'
    });
  }
});

/**
 * @route   POST /auth/verify-2fa
 * @desc    Verify dan enable 2FA
 * @access  Private
 */
router.post('/verify-2fa', authenticate, async (req, res) => {
  try {
    const { token, secret, backupCodes } = req.body;
    const user = req.user;

    // Verifikasi token TOTP
    const isValidToken = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (!isValidToken) {
      return res.status(400).json({
        success: false,
        message: 'Token 2FA tidak valid'
      });
    }

    // Update user 2FA
    user.twoFAEnabled = true;
    user.twoFASecret = secret;
    user.twoFABackupCodes = backupCodes;

    await user.save();

    res.status(200).json({
      success: true,
      message: '2FA berhasil diaktifkan'
    });
  } catch (error) {
    console.error('Verify 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat verifikasi 2FA'
    });
  }
});

/**
 * @route   POST /auth/verify-totp
 * @desc    Verify TOTP token saat login
 * @access  Public
 */
router.post('/verify-totp', async (req, res) => {
  try {
    const { tempToken, totpToken } = req.body;

    if (!tempToken || !totpToken) {
      return res.status(400).json({
        success: false,
        message: 'Token diperlukan'
      });
    }

    // Verifikasi temp token
    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
      if (decoded.type !== '2fa') {
        throw new Error('Invalid token type');
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Temp token tidak valid'
      });
    }

    // Cari user
    const user = await User.findById(decoded.userId).select('+twoFASecret +twoFABackupCodes');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Verifikasi TOTP token
    const isValidToken = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: 'base32',
      token: totpToken,
      window: 2
    });

    // Check backup code jika TOTP tidak valid
    let isValidBackupCode = false;
    if (!isValidToken && user.twoFABackupCodes.includes(totpToken)) {
      isValidBackupCode = true;
      // Remove used backup code
      user.twoFABackupCodes = user.twoFABackupCodes.filter(code => code !== totpToken);
      await user.save();
    }

    if (!isValidToken && !isValidBackupCode) {
      return res.status(401).json({
        success: false,
        message: 'TOTP token tidak valid'
      });
    }

    // Generate JWT token setelah 2FA verified
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        membership: user.membership
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Generate 2FA token (untuk menandai 2FA sudah verified)
    const twoFAToken = jwt.sign(
      { userId: user._id.toString(), type: '2fa-verified' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        twoFAToken,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          membership: user.membership
        }
      }
    });
  } catch (error) {
    console.error('Verify TOTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat verifikasi TOTP'
    });
  }
});

/**
 * @route   POST /auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout berhasil. Token sudah tidak valid.'
  });
});

/**
 * @route   GET /auth/me
 * @desc    Dapatkan profile user yang login
 * @access  Private
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil profile'
    });
  }
});

/**
 * @route   POST /auth/forgot-password
 * @desc    Request reset password
 * @access  Public
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email diperlukan'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Jangan reveal apakah email terdaftar atau tidak (security best practice)
      return res.status(200).json({
        success: true,
        message: 'Jika email terdaftar, Anda akan menerima instruksi reset password'
      });
    }

    // Generate password reset token
    const resetToken = user.createPasswordResetToken();
    await user.save();

    // TODO: Kirim email dengan reset token
    // const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    // await sendPasswordResetEmail(user.email, resetUrl);

    res.status(200).json({
      success: true,
      message: 'Email reset password telah dikirim'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat request reset password'
    });
  }
});

/**
 * @route   POST /auth/reset-password/:token
 * @desc    Reset password dengan token
 * @access  Public
 */
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { token } = req.params;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password baru diperlukan'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password tidak cocok'
      });
    }

    // Hash token
    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Cari user dengan token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token reset password tidak valid atau sudah expired'
      });
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password berhasil direset. Silakan login dengan password baru.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat reset password'
    });
  }
});

module.exports = router;
