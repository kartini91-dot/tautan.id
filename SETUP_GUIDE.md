# 🎯 Tautan ID - Complete Setup & Deployment Guide

Panduan lengkap untuk setup lokal, testing, dan deployment production untuk Tautan ID marketplace.

## 📋 Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Database Configuration](#database-configuration)
3. [Environment Setup](#environment-setup)
4. [Running Application](#running-application)
5. [Testing & Quality Assurance](#testing--quality-assurance)
6. [Deployment Guide](#deployment-guide)
7. [Post-Deployment Checklist](#post-deployment-checklist)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Local Development Setup

### Step 1: Prerequisites Installation

**Windows:**
```bash
# Download dan install
# 1. Node.js 18+ dari https://nodejs.org/
# 2. MongoDB Community dari https://www.mongodb.com/try/download/community
# 3. Git dari https://git-scm.com/

# Verify installation
node --version          # v18.x.x
npm --version           # 9.x.x
git --version           # 2.x.x
```

**macOS:**
```bash
# Install via Homebrew
brew install node@18
brew install mongodb-community
brew install git

# Verify
node --version
npm --version
```

**Linux (Ubuntu):**
```bash
# Update package manager
sudo apt update && sudo apt upgrade

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
sudo apt install -y mongodb

# Install Git
sudo apt install -y git

# Verify
node --version
npm --version
```

### Step 2: Clone Repository

```bash
# Clone dari GitHub
git clone https://github.com/yourusername/tautan-id.git
cd tautan-id

# Atau jika development, clone dari local folder
# cd C:\Users\LENOVO\OneDrive\Pictures\TAUTAN.2.9
```

### Step 3: Install Dependencies

```bash
# Install npm packages
npm install

# Expected output: added XXX packages

# Verify installation
npm list --depth=0
```

### Step 4: Setup Environment File

```bash
# Copy template
cp .env.example .env

# Edit dengan text editor (VS Code, Notepad, dll)
# Adjust nilai untuk local development:

# .env untuk local development
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Gunakan local MongoDB
MONGODB_LOCAL=mongodb://localhost:27017/tautan-id
MONGODB_URI=mongodb://localhost:27017/tautan-id

# Simple secrets untuk development
JWT_SECRET=dev-jwt-secret-change-in-production-12345
JWT_2FA_SECRET=dev-2fa-secret-change-in-production
ENCRYPTION_KEY=1234567890123456789012345678901 # 32 hex chars
ENCRYPTION_ALGORITHM=aes-256-cbc
```

---

## 💾 Database Configuration

### Option 1: Local MongoDB (Development)

**Windows:**
```bash
# 1. Start MongoDB service
# Buka Services (Win+R → services.msc)
# Cari "MongoDB Server" dan start

# Atau via Command Prompt
"C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"

# 2. Verify connection
mongo
# Output: test>
# Ketik: exit
```

**macOS:**
```bash
# Start MongoDB
brew services start mongodb-community

# Verify
mongo --version

# Connect to database
mongo
# Output: test>
# Ketik: exit

# Stop (when done)
brew services stop mongodb-community
```

**Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongodb

# Verify running
sudo systemctl status mongodb

# Connect
mongo
```

### Option 2: MongoDB Atlas (Cloud - Recommended)

```bash
# 1. Sign up di https://www.mongodb.com/cloud/atlas
# 2. Create project "Tautan ID"
# 3. Create cluster (M0 Free Tier OK)
# 4. Wait untuk cluster ready (~5 menit)

# 5. Get connection string:
#    - Click "Connect"
#    - Select "Connect your application"
#    - Copy MongoDB+SRV connection string
#    - Replace <username> dan <password>

# 6. Di .env, set:
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/tautan-id?retryWrites=true&w=majority

# 7. Test connection
npm run seed
```

### Step: Initial Database Seeding

```bash
# Seed dengan test data (50 suppliers, 50 buyers, 150 products)
npm run seed

# Output:
# ✓ Connected to MongoDB
# ✓ Clearing existing data...
# ✓ Seeding users... (50 suppliers, 50 buyers)
# ✓ Seeding products... (150 total)
# ✓ Database seeded successfully!
# • Total Users: 100
# • Products: 150
# • Sample supplier email: supplier1@example.com
# • Default password: TestPassword123!

# Verify data di MongoDB Compass atau mongo CLI
mongo
> use tautan-id
> db.users.countDocuments()      # Should return 100
> db.products.countDocuments()   # Should return 150
```

---

## 🔑 Environment Setup

### Complete .env Configuration

```bash
# ============================================
# DATABASE CONFIGURATION
# ============================================
NODE_ENV=development
MONGODB_LOCAL=mongodb://localhost:27017/tautan-id
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tautan-id

# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
API_PREFIX=/api

# ============================================
# JWT & AUTHENTICATION
# ============================================
JWT_SECRET=your-secret-key-min-32-chars-change-in-production
JWT_EXPIRE=7d
JWT_2FA_EXPIRE=5m
SESSION_SECRET=session-secret-key-change-in-production

# ============================================
# ENCRYPTION (AES-256-CBC)
# ============================================
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef  # 32 hex chars
ENCRYPTION_ALGORITHM=aes-256-cbc

# ============================================
# EMAIL CONFIGURATION (Nodemailer)
# ============================================
# Gmail setup:
# 1. Enable 2FA di Google Account
# 2. Generate App Password: https://myaccount.google.com/apppasswords
# 3. Gunakan app password di bawah

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-from-google

# Alternative: Custom SMTP
# SMTP_HOST=smtp.mailgun.org
# SMTP_USER=postmaster@yourdomain.com
# SMTP_PASS=your-mailgun-password

SMTP_FROM=noreply@tautan-id.com
SMTP_FROM_NAME=Tautan ID

# ============================================
# RECAPTCHA (Untuk login/register protection)
# ============================================
# Get dari: https://www.google.com/recaptcha/admin/
RECAPTCHA_SITE_KEY=your-site-key-from-google
RECAPTCHA_SECRET_KEY=your-secret-key-from-google

# ============================================
# GOOGLE SERVICES
# ============================================
# Google Analytics 4
GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA_PROPERTY_ID=123456789

# Google AI (untuk AI matching)
GOOGLE_GENERATIVE_AI_API_KEY=your-api-key-from-google-ai-studio

# Google OAuth (optional, untuk social login)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ============================================
# ERROR TRACKING & MONITORING
# ============================================
# Sentry (untuk error tracking)
SENTRY_DSN=https://xxxxx@o123456.ingest.sentry.io/123456
SENTRY_ENVIRONMENT=development
SENTRY_RELEASE=1.0.0

# ============================================
# PAYMENT GATEWAY
# ============================================
# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Midtrans (Indonesia payment gateway)
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_ENVIRONMENT=sandbox  # sandbox atau production

# ============================================
# AWS S3 (untuk file upload)
# ============================================
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=tautan-id-images
AWS_S3_URL=https://tautan-id-images.s3.ap-southeast-1.amazonaws.com

# ============================================
# LOGGING & DEBUGGING
# ============================================
LOG_LEVEL=debug          # debug, info, warn, error
LOG_FILE=logs/app.log
DEBUG=tautan-id:*
```

---

## ▶️ Running Application

### Development Mode

**Terminal 1: Backend Server**
```bash
# Start backend dengan auto-reload
npm run dev

# Output:
# > nodemon server.js
# 
# ╔════════════════════════════════════════════════╗
# ║     🔗 TAUTAN ID - Marketplace API             ║
# ║     v2.9.0 (December 2024)                     ║
# ╚════════════════════════════════════════════════╝
# 
# ✓ Server berjalan di http://localhost:5000
# ✓ Environment: development
# ✓ Database: tautan-id (Connected)
# ✓ Rate limiting: Active
```

**Terminal 2: Frontend (Simple HTTP Server)**
```bash
# Install simple HTTP server (jika belum)
npm install -g http-server

# Start frontend di port 3000
http-server frontend -p 3000 -c-1

# Atau gunakan VS Code Live Server extension
# Right-click index.html > Open with Live Server
```

**Access Application:**
- Frontend: http://localhost:3000
- API: http://localhost:5000
- API Health: http://localhost:5000/health
- API Docs: http://localhost:5000/api

### Production Mode

```bash
# Build frontend (jika ada build step)
npm run build

# Start server
npm start

# Output: Server running di port 5000
```

---

## 🧪 Testing & Quality Assurance

### Unit Tests

```bash
# Run semua tests
npm test

# Output:
# PASS  tests/user.test.js
#   Auth Endpoints
#     Register
#       ✓ should register a new user (45ms)
#       ✓ should reject duplicate email (12ms)
#       ✓ should reject weak password (8ms)
#     Login
#       ✓ should login with valid credentials (38ms)
#       ✓ should reject invalid password (15ms)
#       ✓ should lock account after 5 attempts (120ms)
#     2FA
#       ✓ should setup 2FA (25ms)
#       ✓ should verify TOTP (30ms)
#
# Test Suites: 1 passed, 1 total
# Tests:       25 passed, 25 total
```

### Run Tests dengan Coverage

```bash
npm test -- --coverage

# Output coverage report:
# File             | % Stmts | % Branch | % Funcs | % Lines |
# auth.js          | 92.15   | 85.71    | 100     | 92.15   |
# suppliers.js     | 88.24   | 82.35    | 95      | 88.24   |
# models/User.js   | 95.45   | 90.91    | 100     | 95.45   |
```

### Watch Mode (untuk development)

```bash
npm run test:watch

# Tests akan re-run otomatis saat file berubah
```

### Manual API Testing

**Postman Collection:**
```
Buka Postman → Import → Paste JSON dibawah
```

```json
{
  "info": {
    "name": "Tautan ID API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/register",
            "body": {
              "name": "John Supplier",
              "email": "john@example.com",
              "password": "TestPassword123!",
              "phone": "081234567890",
              "role": "supplier"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/login",
            "body": {
              "email": "supplier1@example.com",
              "password": "TestPassword123!"
            }
          }
        }
      ]
    },
    {
      "name": "Suppliers",
      "item": [
        {
          "name": "Get All Suppliers",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/suppliers"
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    }
  ]
}
```

### Performance Testing

```bash
# Install Apache Bench (AB)
# Windows: Download dari https://httpd.apache.org/download.cgi
# Mac: brew install httpd
# Linux: sudo apt install apache2-utils

# Test endpoint
ab -n 1000 -c 10 http://localhost:5000/api/suppliers

# Output:
# This is ApacheBench, Version 2.3
# Benchmarking localhost (be patient)
# Completed 100 requests
# ...
# Requests per second:   245.32 [#/sec] (mean)
# Time per request:      40.76 [ms] (mean)
```

---

## 🚀 Deployment Guide

### Option 1: Vercel Deployment (Recommended)

**Step 1: Prepare for Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Login ke Vercel
vercel login

# Authenticate dengan GitHub account
```

**Step 2: Deploy**

```bash
# Deploy ke staging
vercel

# Deploy ke production
vercel --prod

# Output:
# ? Project name: tautan-id
# ? Deploy from: ./
# ? Production: yes
# 
# ✓ Production: https://tautan-id.vercel.app
# ✓ API: https://tautan-id-api.vercel.app
```

**Step 3: Configure Environment Variables di Vercel**

```bash
# Go to Vercel Dashboard → Settings → Environment Variables
# Add semua variables dari .env:

# Database
MONGODB_URI = mongodb+srv://...

# JWT
JWT_SECRET = your-secret-key
JWT_EXPIRE = 7d

# Encryption
ENCRYPTION_KEY = 0123456789abcdef...

# Email
SMTP_HOST = smtp.gmail.com
SMTP_USER = your-email@gmail.com
SMTP_PASS = your-app-password

# Sentry
SENTRY_DSN = https://...

# Analytics
GA_MEASUREMENT_ID = G-XXXXXXXXXX

# Payment
STRIPE_SECRET_KEY = sk_live_...
MIDTRANS_SERVER_KEY = ...

# AWS
AWS_ACCESS_KEY_ID = ...
AWS_SECRET_ACCESS_KEY = ...
```

**Step 4: Deploy Production**

```bash
# Push ke main branch akan trigger auto-deploy
git add .
git commit -m "Production deployment"
git push origin main

# Check deployment status di Vercel Dashboard
```

### Option 2: Manual Deployment (VPS/Cloud)

**Step 1: Setup Server**

```bash
# Login ke VPS (SSH)
ssh root@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
sudo apt install -y mongodb

# Install nginx (reverse proxy)
sudo apt install -y nginx

# Install certbot (SSL)
sudo apt install -y certbot python3-certbot-nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

**Step 2: Clone & Setup Application**

```bash
# Clone repository
git clone https://github.com/yourusername/tautan-id.git /var/www/tautan-id
cd /var/www/tautan-id

# Install dependencies
npm install --production

# Setup environment
cp .env.example .env
nano .env  # Edit dengan production values
```

**Step 3: Setup PM2**

```bash
# Start application dengan PM2
pm2 start server.js --name "tautan-id"

# Startup otomatis
pm2 startup
pm2 save

# Monitor
pm2 status
pm2 logs tautan-id
```

**Step 4: Setup nginx**

```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/tautan-id

# Paste config:
```

```nginx
server {
    listen 80;
    server_name tautan-id.com www.tautan-id.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/tautan-id /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL dengan Let's Encrypt
sudo certbot --nginx -d tautan-id.com -d www.tautan-id.com

# Auto-renew SSL
sudo systemctl enable certbot.timer
```

**Step 5: Setup Database Backup**

```bash
# Create backup script
sudo nano /usr/local/bin/backup-mongo.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/tautan-id_$DATE.gz"

mkdir -p $BACKUP_DIR
mongodump --db tautan-id --archive=$BACKUP_FILE --gzip

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-mongo.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e

# Add line:
0 2 * * * /usr/local/bin/backup-mongo.sh
```

---

## ✅ Post-Deployment Checklist

### Security Verification

- [ ] HTTPS enabled dan valid SSL certificate
- [ ] All environment variables set securely
- [ ] Database backups configured
- [ ] Firewall rules configured
- [ ] DDoS protection active
- [ ] Rate limiting tested
- [ ] CORS properly configured
- [ ] API keys rotated
- [ ] Monitoring alerts set up

### Functionality Testing

- [ ] User registration works
- [ ] Email verification emails send
- [ ] 2FA setup & verification works
- [ ] Login/logout functional
- [ ] Supplier listing filtered by membership
- [ ] Product creation & listing works
- [ ] AI matching endpoint responsive
- [ ] Chat system functional
- [ ] Order creation & payment flow works
- [ ] Analytics events tracking
- [ ] Admin dashboard accessible

### Performance Monitoring

- [ ] Page load time < 3 seconds
- [ ] API response time < 200ms
- [ ] Database queries optimized
- [ ] CDN configured for static assets
- [ ] Image optimization enabled
- [ ] Caching headers set

### Analytics Setup

- [ ] Google Analytics configured
- [ ] All events tracking properly
- [ ] Sentry error tracking active
- [ ] Dashboard accessible
- [ ] Custom alerts configured

### Legal Compliance

- [ ] Terms of Service page accessible
- [ ] Privacy Policy page accessible
- [ ] Refund Policy page accessible
- [ ] GDPR compliance verified
- [ ] Indonesia law compliance verified
- [ ] Cookie consent implemented

---

## 🔧 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

Solution:
```bash
# Check if MongoDB is running
# Windows: Check Services (services.msc)
# macOS: brew services list
# Linux: sudo systemctl status mongodb

# If not running:
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongodb

# Or start MongoDB manually:
mongod
```

**2. Port Already in Use**

```
Error: listen EADDRINUSE :::5000
```

Solution:
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 PID     # macOS/Linux
taskkill /PID:PID /F  # Windows

# Or use different port:
PORT=5001 npm run dev
```

**3. JWT Token Expired**

```
Error: jwt expired
```

Solution:
```bash
# Token valid untuk 7 hari
# User perlu login kembali untuk mendapatkan token baru
# Atau implement refresh token (coming soon)
```

**4. 2FA Not Working**

```
Error: Invalid TOTP token
```

Solution:
```bash
# 1. Verify time sync antara server & device
# 2. Gunakan backup code jika TOTP app error
# 3. Reset 2FA dan setup kembali
```

**5. Email Not Sending**

```
Error: SMTP connection failed
```

Solution:
```bash
# Verify SMTP credentials di .env
# Gmail: Enable "Less secure app access" or use app password
# Check firewall allowing SMTP port 587
# Test with: npm run test:email
```

---

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Vercel Deployment](https://vercel.com/docs)
- [Google Analytics 4](https://support.google.com/analytics)
- [Sentry Error Tracking](https://sentry.io/welcome/)

---

**Ready to deploy? Let's go! 🚀**

Questions? See [Troubleshooting](#troubleshooting) section or create an issue on GitHub.
