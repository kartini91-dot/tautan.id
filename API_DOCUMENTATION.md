# 📡 Tautan ID - API Documentation

Complete API reference untuk Tautan ID backend server. Semua endpoints memerlukan JWT token kecuali dinyatakan otherwise.

## 🔗 Base URL

```
Development: http://localhost:5000/api
Production: https://tautan-id-api.vercel.app/api
```

## 🔐 Authentication

### Request Headers

```bash
# Required untuk endpoints yang protected
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

### Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (Duplicate) |
| 429 | Too Many Requests (Rate Limited) |
| 500 | Internal Server Error |

---

## 👤 AUTH ENDPOINTS

### 1. Register User

**POST** `/auth/register`

Register akun baru sebagai Buyer atau Supplier.

**Request Body:**
```json
{
  "name": "John Supplier",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "passwordConfirm": "SecurePass123!",
  "phone": "081234567890",
  "role": "supplier"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Supplier",
    "email": "john@example.com",
    "role": "supplier",
    "membership": "Basic",
    "isEmailVerified": false,
    "createdAt": "2024-12-01T10:00:00.000Z"
  }
}
```

**Validation Rules:**
- Name: 3+ characters
- Email: Valid format, unique
- Password: 8+ chars, uppercase, lowercase, number, special char
- Phone: Valid Indonesian number format
- Role: 'buyer' or 'supplier'
- Password & passwordConfirm must match

---

### 2. Login

**POST** `/auth/login`

Login dengan email & password.

**Request Body:**
```json
{
  "email": "supplier1@example.com",
  "password": "TestPassword123!"
}
```

**Response (200) - Without 2FA:**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Supplier One",
    "email": "supplier1@example.com",
    "role": "supplier",
    "membership": "Premium",
    "affiliateCode": "AFF-S1234",
    "rating": 4.8,
    "totalOrders": 245
  }
}
```

**Response (200) - With 2FA:**
```json
{
  "success": true,
  "message": "Please verify with 2FA",
  "requires2FA": true,
  "tempToken": "temp_token_valid_for_5_minutes",
  "message2FA": "Enter your TOTP code from authenticator app"
}
```

**Error Responses:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

```json
{
  "success": false,
  "message": "Account locked. Too many failed login attempts. Try again in 15 minutes."
}
```

---

### 3. Setup 2FA

**POST** `/auth/setup-2fa`

Generate TOTP secret dan backup codes untuk setup 2FA.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "2FA setup initiated",
  "secret": "JBSWY3DPEBLW64TMMQXQ2JJJ",
  "qrCodeUrl": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "backupCodes": [
    "1234-5678",
    "8765-4321",
    "9999-8888",
    "7777-6666",
    "5555-4444",
    "3333-2222",
    "1111-0000",
    "9876-5432",
    "4567-8901",
    "2345-6789"
  ],
  "instructions": "Scan QR code with authenticator app (Google Authenticator, Authy, etc) and save backup codes safely"
}
```

**Security Note:**
- Simpan QR code di tempat aman
- Simpan backup codes (bisa digunakan jika TOTP app error)
- Beri tahu user jangan share secret

---

### 4. Verify 2FA

**POST** `/auth/verify-2fa`

Verify dan enable 2FA setelah setup.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "totp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "2FA enabled successfully",
  "twoFactorEnabled": true,
  "backupCodes": [
    "1234-5678",
    "8765-4321",
    // ... (10 codes)
  ]
}
```

---

### 5. Verify TOTP (Login Step 2)

**POST** `/auth/verify-totp`

Verify TOTP code saat login jika 2FA enabled.

**Request Body:**
```json
{
  "totp": "123456",
  "tempToken": "temp_token_from_login"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "TOTP verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Supplier One",
    "email": "supplier1@example.com"
  }
}
```

---

### 6. Logout

**POST** `/auth/logout`

Logout user (hapus token dari client).

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 7. Get Current User

**GET** `/auth/me`

Get profile user yang sedang login.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Supplier One",
    "email": "supplier1@example.com",
    "phone": "081234567890",
    "role": "supplier",
    "membership": "Premium",
    "affiliateCode": "AFF-S1234",
    "twoFactorEnabled": true,
    "businessInfo": {
      "businessName": "Supplier Toko",
      "businessType": "Retail",
      "businessCity": "Jakarta",
      "businessVerified": true
    },
    "stats": {
      "totalProducts": 25,
      "totalOrders": 150,
      "totalRevenue": 15000000,
      "rating": 4.8,
      "reviewCount": 89
    },
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-12-01T15:30:00.000Z"
  }
}
```

---

### 8. Forgot Password

**POST** `/auth/forgot-password`

Request password reset token (dikirim via email).

**Request Body:**
```json
{
  "email": "supplier1@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent. Check your inbox and spam folder."
}
```

**Note:** Email tidak dikirim jika email tidak ditemukan (security - don't reveal if email exists).

---

### 9. Reset Password

**POST** `/auth/reset-password/:token`

Reset password menggunakan token dari email.

**URL Parameters:**
- `token` - Reset token dari email link

**Request Body:**
```json
{
  "password": "NewSecurePass123!",
  "passwordConfirm": "NewSecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully. You can now login with your new password."
}
```

---

## 🏪 SUPPLIER ENDPOINTS

### 1. Get All Suppliers

**GET** `/suppliers`

List suppliers dengan filter berdasarkan membership tier user.

**Query Parameters:**
```
GET /api/suppliers?page=1&limit=10&city=Jakarta&sortBy=rating
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number |
| limit | number | No | 10 | Items per page |
| city | string | No | - | Filter by city |
| sortBy | string | No | rating | Sort by: rating, reviews, name, createdAt |
| search | string | No | - | Search supplier name |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Supplier One",
      "businessName": "Toko Elektronik",
      "city": "Jakarta",
      "phone": "081234567890",
      "rating": 4.8,
      "reviewCount": 89,
      "totalProducts": 25,
      "verified": true,
      "membership": "Premium",
      "affiliateCode": "AFF-S1234",
      "imageUrl": "https://s3.amazonaws.com/suppliers/supplier1.jpg",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
    // ... more suppliers
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

**Membership Limits:**
- Basic: 10 suppliers max
- Premium: 50 suppliers max
- Premium+: Unlimited

---

### 2. Get Supplier Detail

**GET** `/suppliers/:supplierId`

Get detail supplier dengan products yang tersedia.

**URL Parameters:**
- `supplierId` - MongoDB ObjectId supplier

**Response (200):**
```json
{
  "success": true,
  "supplier": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Supplier One",
    "email": "supplier1@example.com",
    "phone": "081234567890",
    "businessName": "Toko Elektronik",
    "businessType": "Retail",
    "businessCity": "Jakarta",
    "businessProvince": "DKI Jakarta",
    "businessAddress": "Jalan Merdeka 123",
    "businessVerified": true,
    "rating": 4.8,
    "reviewCount": 89,
    "totalSales": 5000,
    "membership": "Premium",
    "affiliateCode": "AFF-S1234",
    "stats": {
      "totalProducts": 25,
      "totalOrders": 150,
      "totalRevenue": 15000000,
      "averageResponseTime": "< 2 hours"
    },
    "products": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Laptop Gaming ROG",
        "category": "Electronics",
        "price": 12000000,
        "discount": 10,
        "rating": 4.9,
        "stock": 5,
        "imageUrl": "https://s3.amazonaws.com/products/laptop1.jpg"
      }
      // ... more products (limited by membership)
    ],
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 3. Update Supplier Profile

**POST** `/suppliers/profile`

Update supplier business information. Hanya supplier yang sudah verified.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "businessName": "Toko Elektronik Jaya",
  "businessType": "Retail",
  "businessCity": "Jakarta",
  "businessProvince": "DKI Jakarta",
  "businessAddress": "Jalan Merdeka 123, Jakarta Pusat",
  "businessPhone": "021-1234-5678",
  "description": "Toko elektronik terpercaya dengan produk berkualitas dan harga kompetitif"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Supplier profile updated successfully",
  "supplier": {
    "_id": "507f1f77bcf86cd799439011",
    "businessName": "Toko Elektronik Jaya",
    "businessCity": "Jakarta",
    // ... updated fields
  }
}
```

---

### 4. Get Supplier Revenue Stats

**GET** `/suppliers/stats/revenue`

Get revenue statistics untuk supplier yang login.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
```
GET /api/suppliers/stats/revenue?period=month&year=2024
```

| Parameter | Type | Values |
|-----------|------|--------|
| period | string | day, week, month, year |
| year | number | 2024, etc |
| month | number | 1-12 (untuk period=month) |

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalRevenue": 15000000,
    "platformCommission": 750000,
    "affiliateEarnings": 150000,
    "netEarnings": 14100000,
    "totalOrders": 150,
    "completedOrders": 145,
    "pendingOrders": 5,
    "cancelledOrders": 0,
    "averageOrderValue": 100000,
    "period": "month",
    "year": 2024,
    "month": 12,
    "breakdown": [
      {
        "date": "2024-12-01",
        "revenue": 500000,
        "orders": 5,
        "commission": 25000
      }
      // ... daily breakdown
    ]
  }
}
```

---

### 5. Get Supplier Products

**GET** `/suppliers/products`

List produk milik supplier yang login.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
```
GET /api/suppliers/products?page=1&limit=10&category=Electronics
```

**Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Laptop Gaming ROG",
      "category": "Electronics",
      "description": "Laptop gaming dengan spesifikasi tinggi",
      "price": 12000000,
      "discount": 10,
      "finalPrice": 10800000,
      "stock": 5,
      "sold": 23,
      "rating": 4.9,
      "reviewCount": 45,
      "imageUrl": "https://s3.amazonaws.com/products/laptop1.jpg",
      "visibility": "public",
      "status": "active",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
    // ... more products
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

---

### 6. Create Product

**POST** `/suppliers/products`

Create product baru. Hanya supplier.

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Laptop Gaming ROG",
  "category": "Electronics",
  "description": "Laptop gaming dengan spesifikasi tinggi. Intel Core i7, RTX 3070, 16GB RAM",
  "price": 12000000,
  "discount": 10,
  "stock": 10,
  "sku": "ROG-LAPTOP-001",
  "weight": 2.5,
  "images": [
    "https://s3.amazonaws.com/products/laptop1.jpg",
    "https://s3.amazonaws.com/products/laptop2.jpg"
  ],
  "tags": ["gaming", "laptop", "asus"],
  "visibility": "public"
}
```

**Validation:**
- Name: Required, 3+ chars
- Category: Valid category
- Description: 20+ chars
- Price: > 0
- Stock: >= 0
- Discount: 0-100

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Laptop Gaming ROG",
    "supplierId": "507f1f77bcf86cd799439011",
    "category": "Electronics",
    "price": 12000000,
    "discount": 10,
    "finalPrice": 10800000,
    "stock": 10,
    "status": "active",
    "createdAt": "2024-12-01T10:00:00.000Z"
  }
}
```

---

### 7. Update Product

**PUT** `/suppliers/products/:productId`

Update product. Hanya owner supplier.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "name": "Laptop Gaming ROG Pro",
  "price": 13000000,
  "discount": 15,
  "stock": 8,
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Laptop Gaming ROG Pro",
    "price": 13000000,
    "discount": 15,
    "finalPrice": 11050000
  }
}
```

---

## 🛒 PRODUCT ENDPOINTS

### 1. Get All Products

**GET** `/products`

List semua products dengan filtering & search.

**Query Parameters:**
```
GET /api/products?page=1&limit=12&category=Electronics&search=laptop&sort=-rating
```

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page (default: 12) |
| category | string | Filter by category |
| search | string | Full-text search |
| sort | string | Sort field (prefix - for desc) |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| membership | string | Supplier membership filter |

**Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Laptop Gaming ROG",
      "category": "Electronics",
      "price": 12000000,
      "finalPrice": 10800000,
      "discount": 10,
      "rating": 4.9,
      "reviewCount": 45,
      "stock": 5,
      "supplier": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Supplier One",
        "rating": 4.8
      },
      "imageUrl": "https://s3.amazonaws.com/products/laptop1.jpg",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
    // ... more products
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 12,
    "pages": 13
  }
}
```

---

### 2. Get Product Detail

**GET** `/products/:productId`

Get detail product dengan reviews.

**Response (200):**
```json
{
  "success": true,
  "product": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Laptop Gaming ROG",
    "category": "Electronics",
    "supplierId": "507f1f77bcf86cd799439011",
    "supplier": {
      "name": "Supplier One",
      "rating": 4.8,
      "verified": true
    },
    "price": 12000000,
    "discount": 10,
    "finalPrice": 10800000,
    "description": "Laptop gaming dengan spesifikasi tinggi",
    "stock": 5,
    "sku": "ROG-LAPTOP-001",
    "rating": 4.9,
    "reviewCount": 45,
    "images": [
      "https://s3.amazonaws.com/products/laptop1.jpg",
      "https://s3.amazonaws.com/products/laptop2.jpg"
    ],
    "tags": ["gaming", "laptop", "asus"],
    "reviews": [
      {
        "_id": "507f1f77bcf86cd799439020",
        "buyerId": "507f1f77bcf86cd799439001",
        "buyerName": "John Buyer",
        "rating": 5,
        "comment": "Produk bagus, pengiriman cepat!",
        "createdAt": "2024-11-20T10:00:00.000Z"
      }
      // ... more reviews
    ],
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### 3. Search Products

**POST** `/products/search`

Advanced search dengan multiple filters.

**Request Body:**
```json
{
  "query": "laptop gaming",
  "filters": {
    "category": ["Electronics", "Computers"],
    "priceRange": {
      "min": 5000000,
      "max": 20000000
    },
    "rating": 4,
    "supplierMembership": "Premium"
  },
  "sort": "-rating",
  "page": 1,
  "limit": 20
}
```

**Response (200):**
```json
{
  "success": true,
  "results": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Laptop Gaming ROG",
      "rating": 4.9,
      "price": 12000000,
      "finalPrice": 10800000
    }
    // ... search results
  ],
  "totalResults": 24,
  "executionTime": "45ms"
}
```

---

### 4. AI Matching

**POST** `/match`

AI-powered product/supplier matching menggunakan Google Generative AI.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "query": "Saya cari laptop gaming dengan budget 10 juta untuk main game berat",
  "userType": "buyer",
  "preferences": {
    "maxBudget": 10000000,
    "category": "Electronics",
    "features": ["gaming", "high performance"]
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "matches": [
    {
      "type": "product",
      "matchScore": 0.95,
      "item": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Laptop Gaming ROG",
        "price": 10800000,
        "supplier": "Supplier One",
        "rating": 4.9
      },
      "reason": "Matches budget, performance requirements, and highly rated"
    },
    {
      "type": "supplier",
      "matchScore": 0.87,
      "item": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Supplier One",
        "rating": 4.8,
        "specialization": "Electronics & Gaming"
      },
      "reason": "Specialist in gaming products with excellent ratings"
    }
  ],
  "aiInsights": "Based on your requirements, the ROG Laptop is an excellent match. It has high performance specs within your budget and the supplier has proven expertise in gaming products.",
  "alternativeMatches": [
    // ... other relevant products
  ]
}
```

---

## 📦 ORDER ENDPOINTS

### 1. Create Order

**POST** `/orders`

Create order baru.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439012",
      "quantity": 1,
      "price": 10800000
    }
  ],
  "shippingAddress": {
    "fullName": "John Buyer",
    "phone": "081234567890",
    "address": "Jalan Merdeka 123",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "postalCode": "12345"
  },
  "paymentMethod": "stripe",
  "affiliateCode": "AFF-S1234"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439021",
    "orderNumber": "ORD-DEC2024-12345",
    "buyerId": "507f1f77bcf86cd799439001",
    "supplierId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "productId": "507f1f77bcf86cd799439012",
        "name": "Laptop Gaming ROG",
        "quantity": 1,
        "price": 10800000,
        "subtotal": 10800000
      }
    ],
    "subtotal": 10800000,
    "platformCommission": 540000,
    "affiliateCommission": 216000,
    "totalAmount": 10800000,
    "status": "pending_payment",
    "paymentStatus": "pending",
    "createdAt": "2024-12-01T10:00:00.000Z"
  }
}
```

---

### 2. Get Orders

**GET** `/orders`

List orders user (buyer atau supplier).

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
```
GET /api/orders?page=1&limit=10&status=completed
```

| Parameter | Type | Values |
|-----------|------|--------|
| status | string | pending_payment, processing, shipped, delivered, completed, cancelled |
| page | number | Page number |
| limit | number | Items per page |

**Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439021",
      "orderNumber": "ORD-DEC2024-12345",
      "buyerName": "John Buyer",
      "supplierName": "Supplier One",
      "totalAmount": 10800000,
      "status": "completed",
      "paymentStatus": "completed",
      "createdAt": "2024-12-01T10:00:00.000Z",
      "completedAt": "2024-12-05T14:30:00.000Z"
    }
    // ... more orders
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "pages": 15
  }
}
```

---

### 3. Get Order Detail

**GET** `/orders/:orderId`

Get detail order dengan semua informasi.

**Response (200):**
```json
{
  "success": true,
  "order": {
    "_id": "507f1f77bcf86cd799439021",
    "orderNumber": "ORD-DEC2024-12345",
    "buyer": {
      "_id": "507f1f77bcf86cd799439001",
      "name": "John Buyer",
      "email": "buyer@example.com",
      "phone": "081234567890"
    },
    "supplier": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Supplier One",
      "rating": 4.8
    },
    "items": [
      {
        "productId": "507f1f77bcf86cd799439012",
        "name": "Laptop Gaming ROG",
        "quantity": 1,
        "price": 10800000,
        "subtotal": 10800000
      }
    ],
    "shippingAddress": {
      "fullName": "John Buyer",
      "address": "Jalan Merdeka 123, Jakarta 12345"
    },
    "subtotal": 10800000,
    "platformCommission": 540000,
    "affiliateCommission": 216000,
    "totalAmount": 10800000,
    "status": "completed",
    "statusHistory": [
      {
        "status": "pending_payment",
        "timestamp": "2024-12-01T10:00:00.000Z"
      },
      {
        "status": "processing",
        "timestamp": "2024-12-01T11:00:00.000Z"
      },
      {
        "status": "shipped",
        "timestamp": "2024-12-02T09:00:00.000Z"
      },
      {
        "status": "delivered",
        "timestamp": "2024-12-04T16:00:00.000Z"
      },
      {
        "status": "completed",
        "timestamp": "2024-12-05T14:30:00.000Z"
      }
    ],
    "paymentMethod": "stripe",
    "paymentStatus": "completed",
    "createdAt": "2024-12-01T10:00:00.000Z"
  }
}
```

---

### 4. Request Return

**POST** `/orders/:orderId/return`

Request return/refund untuk order.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "reason": "Produk rusak",
  "description": "Laptop tidak bisa dihidupkan saat diterima",
  "images": [
    "https://s3.amazonaws.com/returns/photo1.jpg"
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Return request created successfully",
  "returnRequest": {
    "_id": "507f1f77bcf86cd799439022",
    "orderId": "507f1f77bcf86cd799439021",
    "status": "pending_review",
    "reason": "Produk rusak",
    "description": "Laptop tidak bisa dihidupkan saat diterima",
    "createdAt": "2024-12-06T10:00:00.000Z"
  }
}
```

---

## 💬 CHAT ENDPOINTS

### 1. Create Conversation

**POST** `/chat/conversations`

Start chat dengan supplier/buyer.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "participantId": "507f1f77bcf86cd799439011"
}
```

**Response (201):**
```json
{
  "success": true,
  "conversation": {
    "_id": "507f1f77bcf86cd799439023",
    "conversationId": "conv_abc123xyz",
    "buyerId": "507f1f77bcf86cd799439001",
    "supplierId": "507f1f77bcf86cd799439011",
    "participants": [
      {
        "_id": "507f1f77bcf86cd799439001",
        "name": "John Buyer",
        "unreadCount": 0
      },
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Supplier One",
        "unreadCount": 0
      }
    ],
    "createdAt": "2024-12-01T10:00:00.000Z"
  }
}
```

---

### 2. Get Conversations

**GET** `/chat/conversations`

List chat conversations.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
```
GET /api/chat/conversations?page=1&limit=20&status=active
```

**Response (200):**
```json
{
  "success": true,
  "conversations": [
    {
      "_id": "507f1f77bcf86cd799439023",
      "conversationId": "conv_abc123xyz",
      "otherParticipant": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Supplier One",
        "imageUrl": "https://s3.amazonaws.com/avatars/supplier1.jpg"
      },
      "lastMessage": {
        "sender": "507f1f77bcf86cd799439011",
        "content": "Produk ready, bisa dikirim besok",
        "timestamp": "2024-12-01T15:30:00.000Z"
      },
      "unreadCount": 2,
      "status": "active",
      "updatedAt": "2024-12-01T15:30:00.000Z"
    }
    // ... more conversations
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

---

### 3. Send Message

**POST** `/chat/messages`

Send message dalam conversation.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "conversationId": "conv_abc123xyz",
  "content": "Halo, apakah produk ini masih tersedia?",
  "attachments": [
    {
      "type": "image",
      "url": "https://s3.amazonaws.com/messages/img1.jpg"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": {
    "_id": "507f1f77bcf86cd799439024",
    "conversationId": "conv_abc123xyz",
    "sender": "507f1f77bcf86cd799439001",
    "senderName": "John Buyer",
    "content": "Halo, apakah produk ini masih tersedia?",
    "attachments": [],
    "isRead": false,
    "createdAt": "2024-12-01T16:00:00.000Z"
  }
}
```

---

### 4. Get Chat History

**GET** `/chat/messages/:conversationId`

Get message history dari conversation.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
```
GET /api/chat/messages/conv_abc123xyz?page=1&limit=30
```

**Response (200):**
```json
{
  "success": true,
  "messages": [
    {
      "_id": "507f1f77bcf86cd799439024",
      "conversationId": "conv_abc123xyz",
      "sender": "507f1f77bcf86cd799439001",
      "senderName": "John Buyer",
      "content": "Halo, apakah produk ini masih tersedia?",
      "isRead": true,
      "readAt": "2024-12-01T16:05:00.000Z",
      "createdAt": "2024-12-01T16:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439025",
      "conversationId": "conv_abc123xyz",
      "sender": "507f1f77bcf86cd799439011",
      "senderName": "Supplier One",
      "content": "Ya masih ada, stok 5 unit",
      "isRead": false,
      "createdAt": "2024-12-01T16:15:00.000Z"
    }
    // ... more messages
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 30,
    "pages": 2
  }
}
```

---

## ❌ Error Responses

### Format Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password too weak"
    }
  ]
}
```

### Common Error Messages

| Status | Message |
|--------|---------|
| 400 | Invalid request body |
| 401 | Unauthorized - Invalid or expired token |
| 403 | Forbidden - You don't have permission |
| 404 | Resource not found |
| 409 | Conflict - Email already exists |
| 429 | Too many requests - Rate limited |
| 500 | Internal server error |

---

## 📍 Rate Limiting

| Endpoint | Limit |
|----------|-------|
| General API | 100 requests / 15 minutes |
| Auth endpoints | 5 requests / 15 minutes |
| Payment endpoints | 20 requests / 15 minutes |

---

## 🔄 Pagination

Semua list endpoints support pagination:

```json
{
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "pages": 15
  }
}
```

Query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

---

## 📚 Examples

### Register & Get Profile

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Supplier",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "passwordConfirm": "SecurePass123!",
    "phone": "081234567890",
    "role": "supplier"
  }'

# Response: { "success": true, "user": {...}, "token": "eyJ..." }

# 2. Get Profile
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJ..."

# Response: { "success": true, "user": {...} }
```

### Search & Buy Product

```bash
# 1. Search Products
curl -X POST http://localhost:5000/api/products/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "laptop gaming",
    "filters": {
      "priceRange": {
        "min": 5000000,
        "max": 20000000
      }
    },
    "limit": 10
  }'

# 2. Get Product Detail
curl -X GET http://localhost:5000/api/products/507f1f77bcf86cd799439012

# 3. Create Order
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{
      "productId": "507f1f77bcf86cd799439012",
      "quantity": 1,
      "price": 10800000
    }],
    "shippingAddress": {...},
    "paymentMethod": "stripe"
  }'
```

---

**API v1.0.0 - December 2024**

Last Updated: December 2024
