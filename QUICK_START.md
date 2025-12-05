# 🚀 Tautan ID - Quick Start Guide

Mulai development Tautan ID dalam 5 menit! Panduan step-by-step untuk setup lokal dan testing.

## ⚡ 5-Minute Setup

### 1. Prerequisites (1 menit)

**Install yang diperlukan:**
- Node.js 18+ → https://nodejs.org/
- MongoDB → https://www.mongodb.com/try/download/community
- Git → https://git-scm.com/

**Verify installation:**
```bash
node --version      # v18.x.x
npm --version       # 9.x.x
git --version       # 2.x.x
```

### 2. Clone & Install (1 menit)

```bash
# Clone atau navigate ke folder project
cd c:\Users\LENOVO\OneDrive\Pictures\TAUTAN.2.9

# Install dependencies
npm install

# Tunggu... (akan menginstall 40+ packages)
```

### 3. Setup Database (1 menit)

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# Windows: Buka Services → MongoDB Server → Start
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongodb

# Verify
mongo --version
```

**Option B: MongoDB Atlas (Cloud)**
```bash
# Sign up: https://www.mongodb.com/cloud/atlas
# Create project → Create cluster
# Copy connection string
# Edit .env MONGODB_URI=mongodb+srv://...
```

### 4. Environment Setup (1 menit)

```bash
# Copy template
cp .env.example .env

# Edit .env dengan VS Code atau text editor
# MINIMAL untuk development:

NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tautan-id
JWT_SECRET=dev-secret-change-in-production
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef
```

### 5. Start & Test (1 menit)

```bash
# Seed database dengan test data
npm run seed

# Start server
npm run dev

# Output:
# ╔════════════════════════════════════════════════╗
# ║     🔗 TAUTAN ID - Marketplace API             ║
# ║     v2.9.0                                     ║
# ╚════════════════════════════════════════════════╝
# ✓ Server running di http://localhost:5000
# ✓ Database connected

# Test di terminal baru:
curl http://localhost:5000/health
# Response: {"status":"ok","uptime":5.123}
```

✅ **Done! Server berjalan!**

---

## 🧪 First Test: Login

### Test dengan Seeded Data

```bash
# Seeded user:
# Email: supplier1@example.com
# Password: TestPassword123!

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "supplier1@example.com",
    "password": "TestPassword123!"
  }'

# Success response:
# {
#   "success": true,
#   "message": "Logged in successfully",
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": {
#     "name": "Supplier One",
#     "email": "supplier1@example.com",
#     "role": "supplier"
#   }
# }
```

---

## 📱 Test Frontend

### Start Frontend

```bash
# Terminal baru:
cd frontend

# Option 1: Live Server (VS Code)
# Right-click index.html → "Open with Live Server"

# Option 2: HTTP Server
npx http-server . -p 3000

# Browser: http://localhost:3000
```

### Try Register

1. Open http://localhost:3000
2. Click "Register" button
3. Fill form:
   - Name: Test User
   - Email: testuser@example.com
   - Password: TestPassword123!
   - Role: Buyer
4. Submit
5. Check console (F12) untuk success message

---

## 📊 Explore API

### Postman Collection

Import collection untuk easy API testing:

1. Open Postman
2. Click "Import"
3. Paste JSON:

```json
{
  "info": {
    "name": "Tautan ID Quick Test"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/health"
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/auth/login",
        "body": {
          "raw": "{\"email\":\"supplier1@example.com\",\"password\":\"TestPassword123!\"}"
        }
      }
    },
    {
      "name": "Get Suppliers",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/suppliers?limit=5"
      }
    },
    {
      "name": "Get Products",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/products?limit=5"
      }
    }
  ]
}
```

4. Run requests → Lihat responses

---

## 📁 Project Structure

```
tautan-id/
├── backend/
│   ├── models/          # Database schemas
│   │   ├── User.js      # User, Buyer, Supplier, Admin
│   │   ├── Product.js   # Product listing
│   │   ├── Order.js     # Order management
│   │   └── Chat.js      # Messaging
│   ├── routes/
│   │   ├── auth.js      # Login, register, 2FA
│   │   └── suppliers.js # Supplier operations
│   ├── middleware/
│   │   ├── auth.js      # JWT, 2FA verification
│   │   └── validation.js # Input validation
│   ├── server.js        # Express app
│   └── seedDatabase.js  # Test data generator
├── frontend/
│   ├── index.html       # Homepage
│   ├── benefits.html    # Pricing page
│   ├── *-policy.html    # Legal pages
│   ├── css/
│   │   └── styles.css   # Main stylesheet
│   └── js/
│       └── app.js       # Frontend logic
├── config/
│   ├── sentry.js        # Error tracking
│   ├── analytics.js     # GA configuration
│   └── encryption.js    # Data encryption
├── tests/
│   └── user.test.js     # Unit tests
├── .github/workflows/
│   └── deploy.yml       # CI/CD
├── package.json
├── .env.example
└── README.md
```

---

## 🔑 Common Commands

```bash
# Development
npm run dev              # Start with auto-reload
npm run build            # Build frontend
npm start                # Production start

# Testing
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm test -- --coverage  # Coverage report

# Database
npm run seed            # Seed with 100 test users

# Linting
npm run lint            # ESLint check
npm run format          # Prettier format

# Deployment
npm run deploy          # Deploy to Vercel
vercel --prod           # Production deploy
```

---

## 🆘 Common Issues

### Issue: MongoDB Connection Failed

**Solution:**
```bash
# Check MongoDB running
mongo --version

# Start MongoDB
# Windows: Services → MongoDB → Start
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongodb

# Verify connection
mongo
# Should show: test>
```

### Issue: Port 5000 Already in Use

**Solution:**
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 PID

# Or use different port
PORT=5001 npm run dev
```

### Issue: npm install Fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: .env File Issues

**Solution:**
```bash
# Make sure .env exists
cp .env.example .env

# Required variables minimum:
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tautan-id
JWT_SECRET=your-secret-key-here
```

---

## 📚 Next Steps

### Learn the Code

1. **Database Models** - Understand schema
   - `backend/models/User.js` - 100+ fields
   - `backend/models/Product.js` - Pricing & commission
   - `backend/models/Order.js` - Order lifecycle
   - `backend/models/Chat.js` - Messaging

2. **API Routes** - See endpoints
   - `backend/routes/auth.js` - 9 auth endpoints
   - `backend/routes/suppliers.js` - 7 supplier endpoints

3. **Middleware** - Security & validation
   - `backend/middleware/auth.js` - JWT, 2FA, roles
   - `backend/middleware/validation.js` - Input validation

4. **Frontend** - UI/UX
   - `frontend/index.html` - Homepage structure
   - `frontend/css/styles.css` - Responsive design
   - `frontend/js/app.js` - Client logic

### Try Features

```bash
# 1. Register new user
# POST /auth/register

# 2. Login
# POST /auth/login
# Copy token from response

# 3. Use token to access protected endpoints
# GET /auth/me
# Headers: Authorization: Bearer {token}

# 4. List suppliers
# GET /api/suppliers

# 5. Get supplier detail
# GET /api/suppliers/{id}

# 6. Create product (as supplier)
# POST /api/suppliers/products

# 7. Search products
# POST /api/products/search
```

### Explore Database

```bash
# Open mongo shell
mongo

# Select database
use tautan-id

# See collections
show collections

# Count users
db.users.countDocuments()

# Find suppliers
db.users.find({ role: "supplier" }).limit(3)

# Count products
db.products.countDocuments()

# See product example
db.products.findOne()
```

---

## 🎯 Development Tips

### VS Code Extensions (Recommended)

```
- REST Client (for testing API)
- MongoDB for VS Code
- Prettier - Code formatter
- ESLint
- Thunder Client (API testing)
```

### Testing API Requests

**Using REST Client extension:**

Create file `api.rest`:
```rest
### Health check
GET http://localhost:5000/health

### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "supplier1@example.com",
  "password": "TestPassword123!"
}

### Get suppliers (use token from login)
GET http://localhost:5000/api/suppliers
Authorization: Bearer YOUR_TOKEN_HERE
```

Then click "Send Request" on each request.

### Debug Mode

```bash
# Enable debug logging
DEBUG=tautan-id:* npm run dev

# Or with NODE_ENV
DEBUG=tautan-id:* NODE_ENV=development npm run dev

# See detailed logs in terminal
```

### Modify & Test Quickly

1. Make code changes
2. Save file
3. Server auto-reloads (via nodemon)
4. Test immediately with curl or Postman

---

## 🌐 Frontend Development

### Modify Styles

1. Edit `frontend/css/styles.css`
2. Browser auto-refresh (if using Live Server)
3. Changes visible immediately

### Add New Page

```bash
# 1. Create new HTML file
touch frontend/about.html

# 2. Add to styles.css if needed

# 3. Link from index.html
<a href="about.html">About</a>

# 4. Test with browser
```

### Debug JavaScript

1. Open browser DevTools (F12)
2. Console tab to see logs
3. Network tab to see API calls
4. Sources tab to set breakpoints

---

## 📈 Performance Tips

### Speed Up npm install

```bash
# Use npm ci instead of npm install
npm ci

# Or yarn if installed
yarn install
```

### Faster Development Restart

```bash
# Instead of stopping and starting, use:
npm run dev

# It auto-reloads on file changes (nodemon)
```

### Database Performance

```bash
# Check indexes
db.users.getIndexes()

# Create index
db.products.createIndex({ name: "text", category: 1 })

# Monitor queries
db.setProfilingLevel(1)
db.system.profile.find().limit(5).sort({ ts: -1 }).pretty()
```

---

## 🔐 Security Reminders

⚠️ **Never commit:**
```
- .env file (use .env.example)
- API keys or secrets
- Database credentials
- JWT secrets
```

✅ **Always use:**
```
- Environment variables for secrets
- HTTPS in production
- Rate limiting on API
- Input validation
- CORS restrictions
```

---

## 📞 Getting Help

### Check Logs

```bash
# Backend logs
npm run dev

# Check console output for errors

# MongoDB logs
tail -f /var/log/mongodb/mongod.log  # macOS/Linux

# Browser console
F12 → Console
```

### Read Documentation

- [Full Setup Guide](SETUP_GUIDE.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Backend README](BACKEND_README.md)
- [Frontend README](FRONTEND_README.md)

### Test Suite

```bash
# Run tests to verify everything works
npm test

# Should show:
# PASS  tests/user.test.js
#   ✓ Register
#   ✓ Login
#   ✓ 2FA
```

---

## 📊 Seeded Test Data

After `npm run seed`, you have:

### Users (100 total)
- **50 Suppliers**
  - Sample: `supplier1@example.com` - `supplier50@example.com`
  - Password: `TestPassword123!` (all)
  - Varied: Basic/Premium/Premium+ memberships
  
- **50 Buyers**
  - Sample: `buyer1@example.com` - `buyer50@example.com`
  - Password: `TestPassword123!` (all)

### Products (150 total)
- 3 products per supplier
- Varied: Electronics, Clothing, Food, Services
- Price range: 100K - 50M
- Realistic descriptions & tags

### Try These Logins

```bash
# Supplier
Email: supplier1@example.com
Password: TestPassword123!

# Buyer
Email: buyer1@example.com
Password: TestPassword123!

# Both can:
# - Register more users
# - Create/edit products
# - Browse products
# - Create orders
# - Chat
```

---

## ✅ Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] MongoDB running (`mongo --version`)
- [ ] Project cloned
- [ ] `npm install` completed
- [ ] `.env` file created with MONGODB_URI
- [ ] `npm run seed` successful
- [ ] `npm run dev` server running
- [ ] http://localhost:5000/health returns 200
- [ ] http://localhost:3000 loads homepage
- [ ] Login works with seeded user
- [ ] `npm test` passes

---

## 🎉 You're Ready!

You now have:
- ✅ Running backend API server
- ✅ Database with 100+ test data
- ✅ Frontend application
- ✅ Complete authentication system
- ✅ Product catalog
- ✅ Order management
- ✅ Messaging system
- ✅ Analytics ready

**Next:** Explore the code, run tests, make changes, and deploy!

---

**Questions? Check the [Full Documentation](README.md) or [Setup Guide](SETUP_GUIDE.md)**

Happy coding! 🚀
