# 🔗 Tautan ID - Platform Marketplace Lokal Indonesia

**Tautan ID** adalah platform marketplace lokal yang menghubungkan supplier dan buyer Indonesia dengan teknologi terdepan, AI matching, sistem keamanan berlapis, dan monetisasi komprehensif.

**Tagline:** *"Buka website kami, daftar, masukkan data anda, cari keperluan anda lalu transaksi. Produk lokal mahal, disini carinya akurat dan efektif."*

## ✨ Fitur Utama

### 🔐 Security & Authentication
- ✅ JWT Token-based authentication
- ✅ 2FA (Two-Factor Authentication) dengan TOTP
- ✅ Password encryption dengan bcryptjs
- ✅ Account lockout mechanism
- ✅ reCAPTCHA pada login/register
- ✅ SSL/TLS encryption untuk data sensitif

### 💳 Monetization System
- ✅ Platform commission (5% per transaksi)
- ✅ Affiliate program dengan referral points
- ✅ Ad slots untuk supplier
- ✅ Membership tiers (Basic, Premium, Premium+)
- ✅ Revenue dashboard untuk supplier

### 🤖 AI Powered Features
- ✅ AI Expert Matching dengan Google Generative AI
- ✅ Smart product recommendations
- ✅ Intelligent search & filtering
- ✅ Chatbot customer support (optional)

### 📊 Analytics & Insights
- ✅ Google Analytics 4 integration
- ✅ E-commerce event tracking
- ✅ Admin analytics dashboard
- ✅ User behavior tracking

### 💬 Communication
- ✅ Real-time chat antara buyer & supplier
- ✅ Message history & archiving
- ✅ Typing indicators
- ✅ Read status tracking

### 🛒 E-Commerce Features
- ✅ Product catalog dengan kategorisasi
- ✅ Advanced search & filtering
- ✅ Wishlist functionality
- ✅ Order management system
- ✅ Return & refund system

### 👥 User Management
- ✅ Buyer profile
- ✅ Supplier profile dengan verification
- ✅ Membership tier system
- ✅ Rating & review system
- ✅ Address management

### ⚖️ Legal & Compliance
- ✅ Terms of Service (Indonesian)
- ✅ Privacy Policy (GDPR/Indonesia compliant)
- ✅ Refund Policy
- ✅ E-invoicing system
- ✅ Tax compliance

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT + TOTP (2FA)
- **Email**: Nodemailer
- **Security**: Helmet, bcryptjs, crypto
- **Testing**: Jest
- **Monitoring**: Sentry
- **Error Logging**: Sentry

### Frontend
- **Markup**: HTML5 semantic
- **Styling**: CSS3 + CSS Variables
- **Scripts**: Vanilla JavaScript (ES6+)
- **Analytics**: Google Analytics 4
- **HTTP**: Fetch API
- **State**: LocalStorage

### Infrastructure
- **Hosting**: Vercel (Frontend + Backend)
- **Database**: MongoDB Atlas
- **CDN**: Vercel Edge Network
- **CI/CD**: GitHub Actions
- **Error Tracking**: Sentry
- **Security**: Helmet headers

## 📦 Project Structure

```
tautan-id/
├── backend/
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Custom middleware
│   ├── server.js            # Express server
│   └── seedDatabase.js      # Database seeding
├── frontend/
│   ├── index.html           # Homepage
│   ├── benefits.html        # Membership page
│   ├── css/
│   │   └── styles.css       # Main stylesheet
│   ├── js/
│   │   └── app.js          # Frontend logic
│   └── *-policy.html        # Legal pages
├── config/
│   ├── sentry.js            # Error tracking
│   ├── analytics.js         # GA configuration
│   └── encryption.js        # Data encryption
├── tests/
│   └── user.test.js         # Unit tests
├── .github/workflows/
│   └── deploy.yml           # CI/CD pipeline
├── package.json
├── .env.example
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 4.4+ (atau MongoDB Atlas)
- npm atau yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/tautan-id.git
cd tautan-id

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Edit .env dan set variabel yang diperlukan
# - MONGODB_URI
# - JWT_SECRET
# - ENCRYPTION_KEY
# - Sentry DSN
# - Google Analytics ID
# - dll

# Seed database dengan test data
npm run seed

# Start development server
npm run dev
```

Server akan berjalan di `http://localhost:5000`

### Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tautan-id
MONGODB_LOCAL=mongodb://localhost:27017/tautan-id

# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your_very_long_secret_key_here_change_in_production
JWT_EXPIRE=7d
JWT_2FA_EXPIRE=5m

# Encryption
ENCRYPTION_KEY=your_32_character_hex_key_here
ENCRYPTION_ALGORITHM=aes-256-cbc

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# reCAPTCHA
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
RECAPTCHA_SITE_KEY=your_recaptcha_site_key

# Google
GA_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key

# Sentry
SENTRY_DSN=your_sentry_dsn_url

# Payment (Stripe/Midtrans)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=tautan-id-bucket
```

## 📊 Database Seeding

```bash
# Seed dengan 50 suppliers, 50 buyers, 150 products
npm run seed

# Output:
# • Total Users: 100
# • Suppliers: 50
# • Buyers: 50
# • Products: 150
# • Membership Distribution: Basic/Premium/Premium+ mix
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run dengan coverage report
npm test -- --coverage

# Watch mode untuk development
npm run test:watch
```

## 📡 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/setup-2fa` - Setup 2FA
- `POST /api/auth/verify-totp` - Verify TOTP
- `GET /api/auth/me` - Get current user

### Supplier Endpoints
- `GET /api/suppliers` - List suppliers (membership filtered)
- `GET /api/suppliers/:id` - Get supplier detail
- `POST /api/suppliers/profile` - Update profile
- `POST /api/suppliers/products` - Create product
- `GET /api/suppliers/stats/revenue` - Revenue stats

### Product Endpoints
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product detail
- `POST /api/products/search` - Search products
- `POST /api/match` - AI matching

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order detail
- `POST /api/orders/:id/return` - Request return

### Chat Endpoints
- `POST /api/chat/conversations` - Create conversation
- `GET /api/chat/conversations` - List conversations
- `POST /api/chat/messages` - Send message
- `GET /api/chat/messages/:id` - Get chat history

## 🎨 Design System

### Colors
- **Primary (Green)**: #28a745 - Main brand color
- **Secondary (Yellow)**: #ffc107 - Accent color
- **Accent (Gold)**: #ffd700 - Highlight color
- **Dark**: #212529 - Text
- **Light**: #f8f9fa - Background

### Typography
- Font Family: System fonts (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto)
- Sizes: 12px, 14px, 16px, 18px, 20px, 24px, 32px, 40px

### Responsive Breakpoints
- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: 768px - 1024px
- Large: > 1024px

## 🔒 Security Features

1. **Encryption**
   - AES-256 untuk sensitive data
   - Bcryptjs untuk password hashing
   - JWT tokens untuk session

2. **Validation**
   - Input validation untuk semua requests
   - Email format validation
   - Phone number format validation (Indonesia)
   - Password strength requirements

3. **Rate Limiting**
   - 100 requests/IP/15 min (API)
   - 5 login attempts/15 min (Auth)
   - Account lockout setelah 5 failed attempts

4. **Security Headers**
   - HTTPS enforcement
   - X-Content-Type-Options
   - X-Frame-Options
   - Content-Security-Policy
   - CORS configuration

5. **2FA Protection**
   - TOTP-based 2FA
   - Backup codes
   - Account recovery

## 💰 Monetization Model

### Commission Structure
- Platform Fee: 5% per transaksi
- Affiliate Commission: 2% per referral
- Ad Slots: Var pricing untuk supplier

### Revenue Streams
1. **Transaction Commission** - 5% dari setiap order
2. **Affiliate Program** - 2% dari referred purchases
3. **Premium Membership** - Rp 99K/month (Premium), Rp 299K/month (Premium+)
4. **Advertising** - Ad slots untuk supplier
5. **Featured Listings** - Boost visibility untuk produk

## 📈 Analytics Integration

### Google Analytics 4 Events
- User signup/login/logout
- Product views
- Add to cart
- Purchases
- Supplier searches
- AI matching usage
- Membership upgrades
- Referral completions

### Admin Dashboard Metrics
- Total revenue
- User growth
- Product listings
- Order statistics
- Affiliate payouts
- Membership distribution

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Setup environment variables di Vercel dashboard
```

### Environment Setup di Vercel
1. Go to Project Settings → Environment Variables
2. Add semua variables dari `.env.example`
3. Deploy akan trigger otomatis dari GitHub

### GitHub Actions CI/CD
- Automated tests pada setiap push
- Deploy ke staging untuk develop branch
- Deploy ke production untuk main branch
- Slack notifications untuk deployment status

## 📝 Legal & Compliance

### Pages
- [Terms of Service](frontend/terms-of-service.html)
- [Privacy Policy](frontend/privacy-policy.html)
- [Refund Policy](frontend/refund-policy.html)

### Compliance
- ✅ GDPR compliant
- ✅ Indonesian consumer protection law
- ✅ Data protection & encryption
- ✅ Transparent pricing
- ✅ Clear refund policy

## 🆘 Troubleshooting

### MongoDB Connection Error
```
Check MONGODB_URI di .env
Pastikan MongoDB service berjalan
Verify network access di MongoDB Atlas
```

### JWT Token Expired
```
Token expired setelah 7 hari (bisa di-config)
User harus login kembali untuk mendapatkan token baru
```

### 2FA Issues
```
Pastikan time sync antara server dan device correct
Backup codes bisa digunakan jika TOTP app error
```

## 📚 Documentation

- [Backend README](BACKEND_README.md)
- [Frontend README](FRONTEND_README.md)
- API Documentation: `/api` endpoint
- Testing Guide: See `tests/` folder

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use this for your project

## 👥 Team

- Project Lead: Your Team
- Backend Developer: Your Team
- Frontend Developer: Your Team
- Product Manager: Your Team

## 📞 Contact & Support

- Email: support@tautan-id.com
- Phone: +62-812-XXXX-XXXX
- Website: https://tautan-id.com
- Documentation: https://docs.tautan-id.com

## 🙏 Acknowledgments

- MongoDB untuk database yang powerful
- Express.js untuk framework yang elegant
- Google Cloud untuk AI services
- Vercel untuk deployment platform
- GitHub untuk version control

---

**Made with ❤️ for Indonesian SMEs and Digital Economy**

Tautan ID v2.9.0 - December 2024
