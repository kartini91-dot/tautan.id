const mongoose = require('mongoose');

/**
 * Chat Schema - Skema untuk riwayat chat antara buyer dan supplier
 */
const chatSchema = new mongoose.Schema({
  // Identifikasi Conversation
  conversationId: {
    type: String,
    unique: true,
    required: true
  },
  
  // Participants
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  buyerName: String,
  
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  supplierName: String,
  
  // Product Reference (optional)
  productId: mongoose.Schema.Types.ObjectId,
  productName: String,
  
  // Order Reference (optional)
  orderId: mongoose.Schema.Types.ObjectId,
  
  // Messages
  messages: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      
      senderRole: {
        type: String,
        enum: ['buyer', 'supplier'],
        required: true
      },
      
      senderName: String,
      
      messageType: {
        type: String,
        enum: ['text', 'image', 'file', 'system'],
        default: 'text'
      },
      
      content: {
        type: String,
        required: true
      },
      
      attachments: [
        {
          filename: String,
          url: String,
          size: Number,
          type: String
        }
      ],
      
      isRead: {
        type: Boolean,
        default: false
      },
      
      readAt: Date,
      
      createdAt: {
        type: Date,
        default: Date.now
      },
      
      editedAt: Date,
      
      isDeleted: {
        type: Boolean,
        default: false
      }
    }
  ],
  
  // Conversation Status
  status: {
    type: String,
    enum: ['active', 'archived', 'closed'],
    default: 'active'
  },
  
  // Last Message Info (untuk quick lookup)
  lastMessage: {
    content: String,
    senderId: mongoose.Schema.Types.ObjectId,
    createdAt: Date
  },
  
  lastMessageRead: {
    byBuyer: {
      type: Boolean,
      default: false
    },
    bySupplier: {
      type: Boolean,
      default: false
    }
  },
  
  // Unread counts
  unreadCountBuyer: {
    type: Number,
    default: 0
  },
  
  unreadCountSupplier: {
    type: Number,
    default: 0
  },
  
  // Typing Indicators (untuk real-time update)
  buyerTyping: {
    type: Boolean,
    default: false
  },
  
  buyerTypingAt: Date,
  
  supplierTyping: {
    type: Boolean,
    default: false
  },
  
  supplierTypingAt: Date,
  
  // Settings
  buyerBlocked: {
    type: Boolean,
    default: false
  },
  
  supplierBlocked: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  tags: [String],
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  closedAt: Date
});

// Indexes untuk optimasi query
chatSchema.index({ buyerId: 1, createdAt: -1 });
chatSchema.index({ supplierId: 1, createdAt: -1 });
chatSchema.index({ conversationId: 1 });
chatSchema.index({ productId: 1 });
chatSchema.index({ orderId: 1 });
chatSchema.index({ status: 1 });

// Generate conversation ID sebelum save
chatSchema.pre('save', function(next) {
  if (!this.conversationId) {
    const buyerId = this.buyerId.toString().slice(-6);
    const supplierId = this.supplierId.toString().slice(-6);
    const timestamp = Date.now().toString().slice(-4);
    this.conversationId = `CONV-${buyerId}-${supplierId}-${timestamp}`;
  }
  next();
});

// Method: Add message
chatSchema.methods.addMessage = async function(
  senderId,
  senderRole,
  senderName,
  content,
  messageType = 'text',
  attachments = []
) {
  const message = {
    senderId,
    senderRole,
    senderName,
    messageType,
    content,
    attachments,
    createdAt: new Date(),
    isRead: false
  };
  
  this.messages.push(message);
  
  // Update last message info
  this.lastMessage = {
    content: content.substring(0, 100),
    senderId,
    createdAt: new Date()
  };
  
  // Update unread counts
  if (senderRole === 'buyer') {
    this.unreadCountSupplier += 1;
  } else {
    this.unreadCountBuyer += 1;
  }
  
  this.updatedAt = new Date();
  return this.save();
};

// Method: Mark messages as read
chatSchema.methods.markAsRead = async function(readBy) {
  this.messages.forEach(msg => {
    if (!msg.isRead) {
      msg.isRead = true;
      msg.readAt = new Date();
    }
  });
  
  // Update last message read status
  if (readBy === 'buyer') {
    this.lastMessageRead.byBuyer = true;
    this.unreadCountBuyer = 0;
  } else if (readBy === 'supplier') {
    this.lastMessageRead.bySupplier = true;
    this.unreadCountSupplier = 0;
  }
  
  return this.save();
};

// Method: Get unread count for specific user
chatSchema.methods.getUnreadCount = function(userId) {
  if (userId.toString() === this.buyerId.toString()) {
    return this.unreadCountBuyer;
  } else if (userId.toString() === this.supplierId.toString()) {
    return this.unreadCountSupplier;
  }
  return 0;
};

// Method: Close conversation
chatSchema.methods.closeConversation = function() {
  this.status = 'closed';
  this.closedAt = new Date();
  return this.save();
};

// Method: Archive conversation
chatSchema.methods.archiveConversation = function() {
  this.status = 'archived';
  return this.save();
};

// Method: Get message history
chatSchema.methods.getMessageHistory = function(limit = 50, skip = 0) {
  return this.messages
    .slice()
    .reverse()
    .slice(skip, skip + limit)
    .reverse();
};

module.exports = mongoose.model('Chat', chatSchema);
