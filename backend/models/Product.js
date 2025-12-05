const mongoose = require('mongoose');

/**
 * Product Schema - Skema produk untuk supplier
 * Mencakup informasi produk, harga, dan tracking monetisasi
 */
const productSchema = new mongoose.Schema({
  // Informasi Produk
  name: {
    type: String,
    required: [true, 'Nama produk diperlukan'],
    trim: true
  },
  
  description: {
    type: String,
    required: [true, 'Deskripsi produk diperlukan']
  },
  
  category: {
    type: String,
    required: [true, 'Kategori produk diperlukan'],
    enum: [
      'Elektronik',
      'Fashion',
      'Makanan & Minuman',
      'Furniture',
      'Otomotif',
      'Peralatan Industri',
      'Tekstil',
      'Peralatan Rumah Tangga',
      'Lainnya'
    ]
  },
  
  tags: [String],
  
  // Harga & Biaya
  basePrice: {
    type: Number,
    required: [true, 'Harga dasar diperlukan'],
    min: [0, 'Harga tidak boleh negatif']
  },
  
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  finalPrice: {
    type: Number,
    required: true
  },
  
  // Komisi & Biaya Platform
  platformCommissionRate: {
    type: Number,
    default: 0.05 // 5%
  },
  
  platformCommissionAmount: {
    type: Number,
    default: 0
  },
  
  supplierCommissionRate: {
    type: Number,
    default: 0.95 // 95%
  },
  
  // Stok
  stock: {
    type: Number,
    required: [true, 'Stok produk diperlukan'],
    min: 0
  },
  
  minimumOrder: {
    type: Number,
    default: 1,
    min: 1
  },
  
  // Supplier Information
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Supplier ID diperlukan']
  },
  
  supplierName: String,
  
  // Media
  images: [
    {
      url: String,
      altText: String,
      isPrimary: Boolean
    }
  ],
  
  // Spesifikasi & Detail
  specifications: [
    {
      key: String,
      value: String
    }
  ],
  
  weight: {
    value: Number,
    unit: String // 'kg', 'g', etc.
  },
  
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: String // 'cm', 'inch', etc.
  },
  
  // Pengiriman
  shippingAvailable: {
    type: Boolean,
    default: true
  },
  
  shippingWeight: Number,
  
  estimatedDeliveryDays: {
    min: Number,
    max: Number
  },
  
  // SEO & Visibility
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  
  isVisible: {
    type: Boolean,
    default: true
  },
  
  visibility: {
    type: String,
    enum: ['public', 'premium', 'private'],
    default: 'public'
  },
  
  // Ad Slot Configuration (untuk monetisasi)
  adSlotEnabled: {
    type: Boolean,
    default: false
  },
  
  adSlotPosition: String, // 'top', 'bottom', 'side'
  
  adSlotPrice: Number,
  
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
  
  totalSales: {
    type: Number,
    default: 0
  },
  
  // Analytics
  viewCount: {
    type: Number,
    default: 0
  },
  
  clickCount: {
    type: Number,
    default: 0
  },
  
  addToCartCount: {
    type: Number,
    default: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active'
  },
  
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  rejectionReason: String,
  
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
productSchema.index({ name: 'text', description: 'text', category: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ supplierId: 1 });
productSchema.index({ isVisible: 1 });
productSchema.index({ status: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ totalSales: -1 });
productSchema.index({ averageRating: -1 });

// Pre-save: Calculate final price dan commission
productSchema.pre('save', function(next) {
  // Hitung final price berdasarkan diskon
  if (this.discountPercentage > 0) {
    this.finalPrice = this.basePrice - (this.basePrice * this.discountPercentage / 100);
  } else {
    this.finalPrice = this.basePrice;
  }
  
  // Hitung komisi platform
  this.platformCommissionAmount = this.finalPrice * this.platformCommissionRate;
  
  next();
});

// Method: Update stock setelah order
productSchema.methods.updateStock = async function(quantity) {
  if (this.stock < quantity) {
    throw new Error('Stok tidak cukup');
  }
  this.stock -= quantity;
  return this.save();
};

// Method: Restore stock jika order dibatalkan
productSchema.methods.restoreStock = async function(quantity) {
  this.stock += quantity;
  return this.save();
};

// Method: Get price info
productSchema.methods.getPriceInfo = function() {
  return {
    basePrice: this.basePrice,
    discountPercentage: this.discountPercentage,
    finalPrice: this.finalPrice,
    platformCommission: this.platformCommissionAmount,
    supplierEarnings: this.finalPrice - this.platformCommissionAmount
  };
};

module.exports = mongoose.model('Product', productSchema);
