# Tautan ID - Backend Documentation

Dokumentasi lengkap untuk Backend API Tautan ID

## 🚀 Mulai

### Prerequisites
- Node.js 18+
- MongoDB 4.4+
- npm atau yarn

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/tautan-id.git
cd tautan-id

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Seed database dengan data test
npm run seed

# Start development server
npm run dev
```

## 📁 Project Structure

```
backend/
├── models/              # MongoDB schemas
│   ├── User.js         # User model dengan 2FA, membership
│   ├── Product.js      # Product model dengan komisi tracking
│   ├── Order.js        # Order model dengan affiliate system
│   └── Chat.js         # Chat/messaging model
├── routes/             # API endpoints
│   ├── auth.js         # Authentication routes
│   └── suppliers.js    # Supplier management routes
├── middleware/         # Custom middleware
│   ├── auth.js        # JWT, 2FA, authorization
│   └── validation.js  # Input validation
├── server.js          # Main server file
└── seedDatabase.js    # Database seeding script
```

## 🔑 Key Features

### 1. Authentication & Security
- JWT token based authentication
- 2FA (Two-Factor Authentication) dengan TOTP
- Password hashing dengan bcryptjs
- Account lockout setelah 5 failed attempts
- Password reset functionality

### 2. User Management
- Buyer & Supplier roles
- Membership tiers (Basic, Premium, Premium+)
- Affiliate code generation untuk suppliers
- Verification status tracking

### 3. Product Management
- Category-based product organization
- Stock management dengan automatic updates
- Commission calculation (5% platform fee)
- SEO optimization fields
- Ad slot configuration untuk monetisasi

### 4. Monetization
- Platform commission system (5%)
- Affiliate commission tracking
- Referral points system
- Ad slot pricing untuk suppliers

### 5. Chat System
- Real-time chat antara buyer dan supplier
- Message read status tracking
- Conversation archiving
- Typing indicators

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login dengan email & password
- `POST /api/auth/setup-2fa` - Setup 2FA
- `POST /api/auth/verify-2fa` - Verify 2FA token
- `POST /api/auth/verify-totp` - Verify TOTP saat login
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get profile user yang login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Suppliers
- `GET /api/suppliers` - List suppliers dengan membership filter
- `GET /api/suppliers/:supplierId` - Get supplier detail
- `POST /api/suppliers/profile` - Update supplier profile
- `GET /api/suppliers/stats/revenue` - Get supplier revenue stats
- `GET /api/suppliers/products` - Get supplier's products
- `POST /api/suppliers/products` - Create new product
- `PUT /api/suppliers/products/:productId` - Update product

### Products
- `GET /api/products` - List all products
- `GET /api/products/:productId` - Get product detail
- `POST /api/products/search` - Search products

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List user's orders
- `GET /api/orders/:orderId` - Get order detail
- `PUT /api/orders/:orderId/status` - Update order status
- `POST /api/orders/:orderId/return` - Request return

### Chat
- `POST /api/chat/conversations` - Create conversation
- `GET /api/chat/conversations` - List conversations
- `POST /api/chat/messages` - Send message
- `GET /api/chat/messages/:conversationId` - Get chat history
- `POST /api/chat/read/:conversationId` - Mark as read

## 🔐 Security Features

### 1. Data Encryption
- Sensitive data encrypted dengan AES-256
- Passwords hashed dengan bcryptjs
- JWT tokens untuk session management

### 2. Rate Limiting
- 100 requests per IP per 15 minutes (API calls)
- 5 login attempts per 15 minutes
- Account lockout setelah 5 failed attempts

### 3. Validation
- Input validation untuk semua POST/PUT requests
- Email format validation
- Phone number format validation (Indonesia)
- Password strength requirements

### 4. Headers Security
- Helmet.js untuk security HTTP headers
- CORS enabled dengan restricted origins
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY

## 📊 Database Models

### User Schema
```javascript
{
  fullName: String,
  email: String (unique),
  phoneNumber: String (unique),
  password: String (hashed),
  role: 'buyer' | 'supplier' | 'admin',
  membership: 'Basic' | 'Premium' | 'Premium+',
  twoFAEnabled: Boolean,
  twoFASecret: String,
  affiliateCode: String (untuk supplier),
  isEmailVerified: Boolean,
  isBusinessVerified: Boolean (untuk supplier),
  totalEarnings: Number,
  pendingEarnings: Number,
  // ... lebih banyak fields
}
```

### Product Schema
```javascript
{
  name: String,
  description: String,
  category: String,
  basePrice: Number,
  discountPercentage: Number,
  finalPrice: Number (calculated),
  stock: Number,
  supplierId: ObjectId,
  platformCommissionRate: Number (default 5%),
  platformCommissionAmount: Number (calculated),
  visibility: 'public' | 'premium' | 'private',
  // ... lebih banyak fields
}
```

### Order Schema
```javascript
{
  orderNumber: String (unique),
  buyerId: ObjectId,
  supplierId: ObjectId,
  items: [{
    productId: ObjectId,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number
  }],
  totalAmount: Number,
  platformCommission: {
    rate: Number,
    amount: Number
  },
  affiliateData: {
    referrerId: ObjectId,
    commission: { rate: Number, amount: Number },
    referralPointsAwarded: Number
  },
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded',
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled',
  // ... lebih banyak fields
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests dengan coverage
npm test -- --coverage

# Run specific test file
npm test tests/user.test.js

# Run tests dalam watch mode
npm run test:watch
```

## 🚀 Deployment

### Environment Variables
```
MONGODB_URI=mongodb+srv://...
NODE_ENV=production
JWT_SECRET=your_secret_key
ENCRYPTION_KEY=your_32_char_key
SENTRY_DSN=your_sentry_dsn
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Setup environment variables di Vercel dashboard
```

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ /* validation errors */ ]
}
```

## 🔄 CI/CD Pipeline

- GitHub Actions untuk automated testing
- Jest untuk unit testing
- Vercel untuk production deployment
- Sentry untuk error tracking

## 📞 Support

Email: support@tautan-id.com
Phone: +62-812-XXXX-XXXX
