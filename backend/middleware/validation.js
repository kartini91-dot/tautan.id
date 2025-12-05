const { body, validationResult } = require('express-validator');

/**
 * Validation Middleware untuk request body
 */

// Register validation
const validateRegister = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Nama lengkap diperlukan')
    .isLength({ min: 3 }).withMessage('Nama minimal 3 karakter'),
  
  body('email')
    .trim()
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),
  
  body('phoneNumber')
    .trim()
    .matches(/^(\+62|0)[0-9]{9,12}$/)
    .withMessage('Format nomor telepon tidak valid'),
  
  body('password')
    .isLength({ min: 8 }).withMessage('Password minimal 8 karakter')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password harus mengandung huruf besar, huruf kecil, angka, dan simbol'),
  
  body('passwordConfirm')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Password tidak cocok'),
  
  body('role')
    .isIn(['buyer', 'supplier'])
    .withMessage('Role harus buyer atau supplier'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi input gagal',
        errors: errors.array().map(e => ({
          field: e.param,
          message: e.msg
        }))
      });
    }
    next();
  }
];

// Login validation
const validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password diperlukan'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi input gagal',
        errors: errors.array().map(e => ({
          field: e.param,
          message: e.msg
        }))
      });
    }
    next();
  }
];

// Create Product validation
const validateCreateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nama produk diperlukan'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Deskripsi produk diperlukan')
    .isLength({ min: 20 }).withMessage('Deskripsi minimal 20 karakter'),
  
  body('category')
    .isIn([
      'Elektronik',
      'Fashion',
      'Makanan & Minuman',
      'Furniture',
      'Otomotif',
      'Peralatan Industri',
      'Tekstil',
      'Peralatan Rumah Tangga',
      'Lainnya'
    ])
    .withMessage('Kategori tidak valid'),
  
  body('basePrice')
    .isFloat({ min: 0 }).withMessage('Harga harus angka positif'),
  
  body('stock')
    .isInt({ min: 0 }).withMessage('Stok harus angka positif'),
  
  body('minimumOrder')
    .optional()
    .isInt({ min: 1 }).withMessage('Minimum order harus minimal 1'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi input gagal',
        errors: errors.array().map(e => ({
          field: e.param,
          message: e.msg
        }))
      });
    }
    next();
  }
];

// Create Order validation
const validateCreateOrder = [
  body('items')
    .isArray({ min: 1 }).withMessage('Minimal 1 item harus dipesan'),
  
  body('items.*.productId')
    .notEmpty().withMessage('Product ID diperlukan'),
  
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity harus minimal 1'),
  
  body('paymentMethod')
    .isIn(['credit_card', 'bank_transfer', 'e_wallet', 'cash_on_delivery'])
    .withMessage('Metode pembayaran tidak valid'),
  
  body('shippingAddress.fullName')
    .trim()
    .notEmpty().withMessage('Nama penerima diperlukan'),
  
  body('shippingAddress.phoneNumber')
    .matches(/^(\+62|0)[0-9]{9,12}$/)
    .withMessage('Format nomor telepon tidak valid'),
  
  body('shippingAddress.street')
    .trim()
    .notEmpty().withMessage('Alamat jalan diperlukan'),
  
  body('shippingAddress.city')
    .trim()
    .notEmpty().withMessage('Kota diperlukan'),
  
  body('shippingAddress.postalCode')
    .trim()
    .matches(/^\d{5}$/)
    .withMessage('Kode pos harus 5 angka'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi input gagal',
        errors: errors.array().map(e => ({
          field: e.param,
          message: e.msg
        }))
      });
    }
    next();
  }
];

// Send Message validation
const validateSendMessage = [
  body('content')
    .trim()
    .notEmpty().withMessage('Konten pesan diperlukan')
    .isLength({ max: 5000 }).withMessage('Pesan terlalu panjang (max 5000 karakter)'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi input gagal',
        errors: errors.array().map(e => ({
          field: e.param,
          message: e.msg
        }))
      });
    }
    next();
  }
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateProduct,
  validateCreateOrder,
  validateSendMessage
};
