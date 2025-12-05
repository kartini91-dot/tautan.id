const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const {
  authenticate,
  authorize,
  checkMembership,
  verifySupplier
} = require('../middleware/auth');
const { validateCreateProduct } = require('../middleware/validation');

/**
 * @route   GET /api/suppliers
 * @desc    Get suppliers dengan filter berdasarkan membership user
 * @access  Public/Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Tentukan jumlah data berdasarkan membership
    let dataLimit = 10; // Basic
    if (user.membership === 'Premium') {
      dataLimit = 50;
    } else if (user.membership === 'Premium+') {
      dataLimit = Infinity;
    }

    // Tentukan filter query
    let filter = {
      role: 'supplier',
      isActive: true
    };

    // Jika ada pencarian kategori
    if (req.query.category) {
      // Filter produk berdasarkan kategori
      filter = { ...filter };
    }

    // Hitung total suppliers
    const total = await User.countDocuments(filter);

    // Get suppliers dengan pagination
    const suppliers = await User.find(filter)
      .select('fullName businessName businessType businessCity email averageRating totalReviews profileImage')
      .limit(Math.min(dataLimit, limit))
      .skip(skip)
      .sort('-totalReviews');

    res.status(200).json({
      success: true,
      message: 'Suppliers berhasil diambil',
      data: {
        suppliers,
        pagination: {
          currentPage: page,
          totalSuppliers: Math.min(dataLimit, total),
          maxDataAvailable: dataLimit,
          membershipData: {
            'Basic': 10,
            'Premium': 50,
            'Premium+': 'Unlimited'
          },
          userMembership: user.membership
        }
      }
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil suppliers'
    });
  }
});

/**
 * @route   GET /api/suppliers/:supplierId
 * @desc    Get detail supplier dengan produk mereka
 * @access  Private
 */
router.get('/:supplierId', authenticate, async (req, res) => {
  try {
    const { supplierId } = req.params;
    const user = req.user;

    // Get supplier detail
    const supplier = await User.findById(supplierId)
      .select('-password -passwordResetToken -twoFASecret');

    if (!supplier || supplier.role !== 'supplier') {
      return res.status(404).json({
        success: false,
        message: 'Supplier tidak ditemukan'
      });
    }

    // Get supplier products
    let productsQuery = Product.find({
      supplierId,
      isVisible: true,
      status: 'active'
    });

    // Filter berdasarkan visibility dan membership
    if (user.membership === 'Basic') {
      productsQuery = productsQuery.where('visibility').in(['public']);
    } else if (user.membership === 'Premium') {
      productsQuery = productsQuery.where('visibility').in(['public', 'premium']);
    }

    const products = await productsQuery.select('-platformCommissionRate -supplierCommissionRate');

    res.status(200).json({
      success: true,
      data: {
        supplier: {
          id: supplier._id,
          fullName: supplier.fullName,
          businessName: supplier.businessName,
          businessType: supplier.businessType,
          businessCity: supplier.businessCity,
          profileImage: supplier.profileImage,
          profileDescription: supplier.profileDescription,
          averageRating: supplier.averageRating,
          totalReviews: supplier.totalReviews,
          totalSales: supplier.totalSales,
          isBusinessVerified: supplier.isBusinessVerified
        },
        products,
        productCount: products.length
      }
    });
  } catch (error) {
    console.error('Get supplier detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil detail supplier'
    });
  }
});

/**
 * @route   POST /api/suppliers/profile
 * @desc    Update supplier profile
 * @access  Private - Supplier only
 */
router.post('/profile', authenticate, verifySupplier, async (req, res) => {
  try {
    const {
      businessName,
      businessType,
      businessAddress,
      businessCity,
      businessProvince,
      businessPostalCode,
      businessPhone,
      profileDescription,
      profileImage
    } = req.body;

    const supplier = req.user;

    // Update supplier data
    if (businessName) supplier.businessName = businessName;
    if (businessType) supplier.businessType = businessType;
    if (businessAddress) supplier.businessAddress = businessAddress;
    if (businessCity) supplier.businessCity = businessCity;
    if (businessProvince) supplier.businessProvince = businessProvince;
    if (businessPostalCode) supplier.businessPostalCode = businessPostalCode;
    if (businessPhone) supplier.businessPhone = businessPhone;
    if (profileDescription) supplier.profileDescription = profileDescription;
    if (profileImage) supplier.profileImage = profileImage;

    await supplier.save();

    res.status(200).json({
      success: true,
      message: 'Profile supplier berhasil diupdate',
      data: supplier
    });
  } catch (error) {
    console.error('Update supplier profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat update profile'
    });
  }
});

/**
 * @route   GET /api/suppliers/stats/revenue
 * @desc    Get revenue stats untuk supplier
 * @access  Private - Supplier only
 */
router.get('/stats/revenue', authenticate, verifySupplier, async (req, res) => {
  try {
    const supplierId = req.user._id;

    // Get dari Order model dengan aggregation
    const Order = require('../models/Order');

    const stats = await Order.aggregate([
      {
        $match: {
          supplierId: supplierId,
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          totalPlatformCommission: { $sum: '$platformCommission.amount' },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    const revenue = stats.length > 0 ? stats[0] : {
      totalRevenue: 0,
      totalOrders: 0,
      totalPlatformCommission: 0,
      averageOrderValue: 0
    };

    // Get pending earnings
    const supplier = req.user;

    res.status(200).json({
      success: true,
      data: {
        ...revenue,
        pendingEarnings: supplier.pendingEarnings,
        totalEarnings: supplier.totalEarnings,
        commissionRate: supplier.commissionRate
      }
    });
  } catch (error) {
    console.error('Get revenue stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil stats revenue'
    });
  }
});

/**
 * @route   GET /api/suppliers/products
 * @desc    Get produk supplier sendiri
 * @access  Private - Supplier only
 */
router.get('/products', authenticate, verifySupplier, async (req, res) => {
  try {
    const supplierId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const products = await Product.find({ supplierId })
      .limit(limit)
      .skip(skip)
      .sort('-createdAt');

    const total = await Product.countDocuments({ supplierId });

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalProducts: total,
          totalPages: Math.ceil(total / limit),
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get supplier products error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil produk'
    });
  }
});

/**
 * @route   POST /api/suppliers/products
 * @desc    Create produk baru (supplier only)
 * @access  Private - Supplier only
 */
router.post('/products', authenticate, verifySupplier, validateCreateProduct, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      basePrice,
      stock,
      minimumOrder,
      images,
      specifications,
      weight,
      dimensions,
      shippingWeight,
      estimatedDeliveryDays,
      seoTitle,
      seoDescription,
      seoKeywords
    } = req.body;

    const supplierId = req.user._id;
    const supplierName = req.user.businessName || req.user.fullName;

    const newProduct = new Product({
      name,
      description,
      category,
      basePrice,
      stock,
      minimumOrder: minimumOrder || 1,
      supplierId,
      supplierName,
      images,
      specifications,
      weight,
      dimensions,
      shippingWeight,
      estimatedDeliveryDays,
      seoTitle,
      seoDescription,
      seoKeywords
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Produk berhasil dibuat',
      data: newProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat produk'
    });
  }
});

/**
 * @route   PUT /api/suppliers/products/:productId
 * @desc    Update produk (supplier only)
 * @access  Private - Supplier only
 */
router.put('/products/:productId', authenticate, verifySupplier, async (req, res) => {
  try {
    const { productId } = req.params;
    const supplierId = req.user._id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }

    // Verify ownership
    if (product.supplierId.toString() !== supplierId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk update produk ini'
      });
    }

    // Update fields
    const updateFields = [
      'name',
      'description',
      'basePrice',
      'stock',
      'minimumOrder',
      'images',
      'specifications',
      'weight',
      'dimensions',
      'discountPercentage',
      'visibility',
      'status'
    ];

    updateFields.forEach(field => {
      if (req.body.hasOwnProperty(field)) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Produk berhasil diupdate',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat update produk'
    });
  }
});

module.exports = router;
