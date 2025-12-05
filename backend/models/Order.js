const mongoose = require('mongoose');

/**
 * Order Schema - Skema pesanan dengan tracking komisi dan affiliate
 */
const orderSchema = new mongoose.Schema({
  // Nomor Order
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  // Customer Information
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  buyerName: String,
  buyerEmail: String,
  buyerPhone: String,
  
  // Supplier Information
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  supplierName: String,
  
  // Items dalam Order
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      productName: String,
      category: String,
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      unitPrice: Number,
      totalPrice: Number,
      discount: {
        percentage: Number,
        amount: Number
      }
    }
  ],
  
  // Pricing Details
  subtotal: {
    type: Number,
    required: true
  },
  
  discountAmount: {
    type: Number,
    default: 0
  },
  
  shippingCost: {
    type: Number,
    default: 0
  },
  
  // Monetization & Commissions
  platformCommission: {
    rate: {
      type: Number,
      default: 0.05 // 5%
    },
    amount: {
      type: Number,
      default: 0
    }
  },
  
  affiliateData: {
    referrerId: mongoose.Schema.Types.ObjectId,
    referrerName: String,
    commission: {
      rate: {
        type: Number,
        default: 0.02 // 2%
      },
      amount: {
        type: Number,
        default: 0
      }
    },
    referralPointsAwarded: {
      type: Number,
      default: 0
    }
  },
  
  // Total
  totalAmount: {
    type: Number,
    required: true
  },
  
  tax: {
    type: Number,
    default: 0
  },
  
  // Payment Information
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'bank_transfer', 'e_wallet', 'cash_on_delivery'],
    required: true
  },
  
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  paymentDetails: {
    transactionId: String,
    gateway: String,
    paidAt: Date,
    receiptUrl: String
  },
  
  // Shipping Information
  shippingAddress: {
    fullName: String,
    phoneNumber: String,
    street: String,
    city: String,
    province: String,
    postalCode: String,
    country: String,
    notes: String
  },
  
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'same_day'],
    default: 'standard'
  },
  
  trackingNumber: String,
  
  estimatedDeliveryDate: Date,
  
  actualDeliveryDate: Date,
  
  // Order Status
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'completed',
      'cancelled',
      'refunded'
    ],
    default: 'pending'
  },
  
  statusHistory: [
    {
      status: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      notes: String
    }
  ],
  
  // Returns & Refunds
  returnRequested: Boolean,
  returnReason: String,
  returnRequestedAt: Date,
  
  refundStatus: {
    type: String,
    enum: ['none', 'pending', 'approved', 'rejected', 'completed'],
    default: 'none'
  },
  
  refundAmount: Number,
  refundReason: String,
  
  // Communications
  buyerNotes: String,
  supplierNotes: String,
  
  // Customer Feedback
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    reviewedAt: Date
  },
  
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
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ buyerId: 1, createdAt: -1 });
orderSchema.index({ supplierId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Generate order number sebelum save
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    const timestamp = Date.now().toString().slice(-6);
    this.orderNumber = `ORD-${timestamp}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Pre-save: Calculate commissions
orderSchema.pre('save', function(next) {
  if (this.subtotal && this.isModified('subtotal')) {
    // Platform commission
    this.platformCommission.amount = this.subtotal * this.platformCommission.rate;
    
    // Affiliate commission jika ada
    if (this.affiliateData && this.affiliateData.referrerId) {
      this.affiliateData.commission.amount = this.subtotal * this.affiliateData.commission.rate;
      this.affiliateData.referralPointsAwarded = 100; // Points untuk referral
    }
  }
  next();
});

// Method: Update order status
orderSchema.methods.updateStatus = function(newStatus, notes = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    notes: notes,
    timestamp: new Date()
  });
  return this.save();
};

// Method: Process refund
orderSchema.methods.processRefund = async function(amount, reason) {
  this.refundStatus = 'approved';
  this.refundAmount = amount || this.totalAmount;
  this.refundReason = reason;
  this.paymentStatus = 'refunded';
  return this.save();
};

// Method: Get commission details
orderSchema.methods.getCommissionDetails = function() {
  const platformCommission = this.platformCommission.amount || 0;
  const affiliateCommission = this.affiliateData?.commission?.amount || 0;
  const supplierEarnings = this.totalAmount - platformCommission - affiliateCommission;
  
  return {
    totalAmount: this.totalAmount,
    platformCommission: platformCommission,
    affiliateCommission: affiliateCommission,
    supplierEarnings: supplierEarnings
  };
};

module.exports = mongoose.model('Order', orderSchema);
