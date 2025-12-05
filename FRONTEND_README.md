# Tautan ID - Frontend Documentation

Dokumentasi lengkap untuk Frontend Tautan ID

## 🎨 Design & Style

### Color Scheme
- **Primary (Green)**: #28a745 - Army green utama
- **Secondary (Yellow)**: #ffc107 - Yellow untuk accent
- **Accent (Gold)**: #ffd700 - Gold untuk highlights
- **Dark**: #212529 - Text utama
- **Light**: #f8f9fa - Background light

### Typography
- **Font Family**: System fonts (modern, responsive)
- **Sizes**: 12px, 14px, 16px, 18px, 20px, 24px, 32px, 40px

### Components
- Responsive grid system
- Accessible form elements
- Mobile-first design
- Smooth animations

## 📱 Pages

### 1. Homepage (index.html)
- Hero section dengan CTA
- Features showcase
- Role selection (Supplier vs Buyer)
- Testimonials section
- Call-to-action

### 2. Benefits (benefits.html)
- Membership tier comparison
- Pricing table
- Feature breakdown
- FAQ section
- Upgrade buttons

### 3. Legal Pages
- **Terms of Service** (terms-of-service.html)
- **Privacy Policy** (privacy-policy.html)
- **Refund Policy** (refund-policy.html)

## 🔧 Technical Stack

- HTML5 semantic markup
- CSS3 dengan custom properties
- Vanilla JavaScript (no framework)
- Fetch API untuk HTTP requests
- LocalStorage untuk session management

## 📁 File Structure

```
frontend/
├── index.html              # Homepage
├── benefits.html           # Membership page
├── terms-of-service.html   # Legal page
├── privacy-policy.html     # Legal page
├── refund-policy.html      # Legal page
├── css/
│   └── styles.css         # Main stylesheet
├── js/
│   └── app.js             # Main JavaScript file
└── assets/
    ├── logo.png           # Logo
    └── favicon.ico        # Favicon
```

## 🚀 Key Features

### 1. Authentication
- Registration form dengan validasi
- Login dengan email/password
- Logout functionality
- Session persistence dengan JWT

### 2. UI/UX
- Responsive design (mobile-first)
- Dark mode support (optional)
- Smooth transitions dan animations
- Loading states dan error handling

### 3. Analytics Integration
- Google Analytics 4 tracking
- Event tracking (signup, login, purchases)
- E-commerce event tracking
- Conversion tracking

### 4. Notifications
- Toast notifications untuk feedback
- Error messages
- Success confirmations
- Warning alerts

## 🎯 JavaScript Functions

### Authentication
```javascript
TautanID.register(formData)      // Register user baru
TautanID.login(email, password)  // Login user
TautanID.logout()                // Logout user
TautanID.getUser()               // Get current user
TautanID.getToken()              // Get JWT token
```

### API Calls
```javascript
TautanID.apiCall(method, endpoint, data)  // Generic API call
TautanID.getSuppliers(membership)         // Get suppliers list
TautanID.filterByRole(role)               // Filter by supplier/buyer
TautanID.performAIMatch(query, role)      // AI matching
```

### Analytics
```javascript
TautanID.trackEvent(eventName, params)    // Track GA event
TautanID.trackProductView(product)        // Track product view
TautanID.trackAddToCart(product, qty)     // Track add to cart
TautanID.trackPurchase(order)             // Track purchase
```

### UI
```javascript
TautanID.openModal(modalId)     // Open modal
TautanID.closeModal(modalId)    // Close modal
TautanID.showNotification(msg)  // Show notification
TautanID.formatCurrency(amount) // Format currency
```

## 📊 Form Validation

### Register Form
- Nama: Minimal 3 karakter
- Email: Valid email format
- Telepon: Format Indonesia (08xx)
- Password: Minimal 8 karakter, harus ada uppercase, lowercase, number, special char
- Konfirmasi Password: Harus cocok

### Login Form
- Email: Valid format
- Password: Required

## 🔐 Security

- HTTPS enforcement
- XSS protection (input sanitization)
- CSRF tokens (untuk POST requests)
- Content Security Policy headers
- Secure password transmission

## 📈 Performance

- Minified CSS dan JavaScript
- Image optimization
- Lazy loading
- Caching strategy
- CDN integration

## 🌐 Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels untuk form elements
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Alt text untuk images

## 📱 Responsive Breakpoints

- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: 768px - 1024px
- Large Desktop: > 1024px

## 🔄 API Integration

### Base URL
```
Production: https://api.tautan-id.com
Development: http://localhost:5000
```

### Authentication Header
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

## 🎨 CSS Variables

Semua variabel CSS didefinisikan di `:root` untuk kemudahan customization:

```css
--primary: #28a745
--secondary: #ffc107
--accent: #ffd700
--spacing-lg: 2rem
--border-radius: 8px
/* dst */
```

## 📊 Google Analytics Events

- `user_registration_start` - Mulai registrasi
- `user_registration_success` - Registrasi berhasil
- `user_login_start` - Mulai login
- `user_login_success` - Login berhasil
- `view_suppliers` - Lihat supplier list
- `filter_by_role` - Filter by role
- `ai_match_start` - Start AI matching
- `view_item` - Lihat product
- `add_to_cart` - Add to cart
- `purchase` - Pembelian selesai

## 🧪 Testing

```bash
# Development server
npm start

# Build untuk production
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

## 📦 Deployment

### Vercel
```bash
vercel --prod
```

### GitHub Pages
```bash
npm run build
# Commit ke gh-pages branch
```

## 🔧 Customization

### Mengubah Warna
Edit di `css/styles.css`:
```css
:root {
  --primary: #28a745;  /* Ubah di sini */
  --secondary: #ffc107;
}
```

### Mengubah Logo
Replace `assets/logo.png` dengan logo baru

### Mengubah Content
Edit di file HTML masing-masing page

## 📞 Support

Email: support@tautan-id.com
Phone: +62-812-XXXX-XXXX
Website: https://tautan-id.com
