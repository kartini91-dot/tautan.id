/**
 * TAUTAN ID - Frontend JavaScript
 * Handles authentication, API calls, and UI interactions
 */

const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://api.tautan-id.com'
    : 'http://localhost:5000';

const GA_ID = 'G-XXXXXXXXXX';

/**
 * Utility Functions
 */

// Initialize Google Analytics
function initializeGA() {
    if (typeof gtag !== 'undefined') {
        gtag('config', GA_ID, {
            'page_path': window.location.pathname,
            'page_title': document.title
        });
    }
}

// Track GA event
function trackEvent(eventName, eventParams = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventParams);
    }
}

// Get JWT token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Set JWT token
function setToken(token) {
    localStorage.setItem('token', token);
}

// Remove JWT token
function removeToken() {
    localStorage.removeItem('token');
}

// Get user from localStorage
function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Set user
function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

// Remove user
function removeUser() {
    localStorage.removeItem('user');
}

// API call function dengan error handling
async function apiCall(method, endpoint, data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    // Add JWT token jika tersedia
    const token = getToken();
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'API request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        showNotification(error.message, 'error');
        throw error;
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#ffc107'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Format currency to Indonesian Rupiah
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

/**
 * Authentication Functions
 */

// Register function
async function register(formData) {
    try {
        trackEvent('user_registration_start');
        
        const result = await apiCall('POST', '/auth/register', formData);
        
        trackEvent('user_registration_success', {
            user_id: result.data.userId,
            role: formData.role
        });
        
        showNotification('Registrasi berhasil! Silakan login.');
        closeModal('registerModal');
        openModal('loginModal');
        
        return result;
    } catch (error) {
        trackEvent('user_registration_failed');
        throw error;
    }
}

// Login function
async function login(email, password) {
    try {
        trackEvent('user_login_start');
        
        const result = await apiCall('POST', '/auth/login', {
            email,
            password
        });
        
        if (result.requiresTwoFA) {
            // Store temp token untuk 2FA
            sessionStorage.setItem('tempToken', result.tempToken);
            showNotification('Masukkan kode 2FA');
            // TODO: Show 2FA verification modal
            return;
        }
        
        // Store token dan user
        setToken(result.data.token);
        setUser(result.data.user);
        
        trackEvent('user_login_success', {
            user_id: result.data.user.id,
            membership: result.data.user.membership
        });
        
        showNotification('Login berhasil!');
        closeModal('loginModal');
        updateNavbar();
        
        return result;
    } catch (error) {
        trackEvent('user_login_failed');
        throw error;
    }
}

// Logout function
async function logout() {
    try {
        const user = getUser();
        trackEvent('user_logout', {
            user_id: user?.id
        });
        
        await apiCall('POST', '/auth/logout');
        
        removeToken();
        removeUser();
        
        showNotification('Logout berhasil');
        updateNavbar();
        window.location.href = '/';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

/**
 * UI Functions
 */

// Update navbar based on auth state
function updateNavbar() {
    const user = getUser();
    const navbarAuth = document.querySelector('.navbar-auth');
    
    if (user) {
        navbarAuth.innerHTML = `
            <div class="user-menu">
                <span>${user.fullName}</span>
                <button class="btn btn-outline-primary" onclick="logout()">Logout</button>
            </div>
        `;
        
        // Update nav links untuk logged in user
        const navMenu = document.querySelector('.navbar-menu');
        if (navMenu) {
            const dashboardLink = document.createElement('li');
            dashboardLink.innerHTML = '<a href="/dashboard" class="nav-link">Dashboard</a>';
            navMenu.appendChild(dashboardLink);
        }
    } else {
        navbarAuth.innerHTML = `
            <button id="loginBtn" class="btn btn-outline-primary">Masuk</button>
            <button id="registerBtn" class="btn btn-primary">Daftar</button>
        `;
        attachAuthButtons();
    }
}

// Open modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Attach event listeners ke auth buttons
function attachAuthButtons() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => openModal('loginModal'));
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => openModal('registerModal'));
    }
}

// Handle form submission
function handleFormSubmit(formId, submitHandler) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            await submitHandler(data);
            form.reset();
        } catch (error) {
            console.error('Form submission error:', error);
        }
    });
}

// Mobile menu toggle
function setupMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.querySelector('.navbar-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }
}

// Smooth scroll untuk navigation links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Close modals ketika click outside
function setupModalClose() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
        
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }
    });
}

/**
 * AI Matching Function
 */

async function performAIMatch(searchQuery, userRole = null) {
    try {
        trackEvent('ai_match_start', {
            search_query: searchQuery,
            user_role: userRole
        });
        
        const result = await apiCall('POST', '/api/match', {
            query: searchQuery,
            userRole
        });
        
        trackEvent('ai_match_success', {
            results_count: result.data.matches.length
        });
        
        return result.data.matches;
    } catch (error) {
        trackEvent('ai_match_failed');
        throw error;
    }
}

/**
 * Supplier/Buyer Filter Functions
 */

async function getSuppliers(membership) {
    try {
        trackEvent('view_suppliers', {
            membership
        });
        
        const result = await apiCall('GET', `/api/suppliers?page=1&limit=50`);
        
        return result.data.suppliers;
    } catch (error) {
        console.error('Get suppliers error:', error);
        throw error;
    }
}

async function filterByRole(role) {
    try {
        trackEvent('filter_by_role', {
            role
        });
        
        // Filter suppliers atau buyers berdasarkan role
        const result = await apiCall('GET', `/api/suppliers?role=${role}`);
        
        return result.data;
    } catch (error) {
        console.error('Filter error:', error);
        throw error;
    }
}

/**
 * Product Tracking (Google Analytics E-commerce)
 */

function trackProductView(product) {
    trackEvent('view_item', {
        items: [{
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            price: product.finalPrice
        }]
    });
}

function trackAddToCart(product, quantity) {
    trackEvent('add_to_cart', {
        items: [{
            item_id: product.id,
            item_name: product.name,
            quantity,
            price: product.finalPrice
        }]
    });
}

function trackPurchase(order) {
    trackEvent('purchase', {
        transaction_id: order.orderNumber,
        value: order.totalAmount,
        currency: 'IDR',
        items: order.items.map(item => ({
            item_id: item.productId,
            item_name: item.productName,
            quantity: item.quantity,
            price: item.unitPrice
        }))
    });
}

/**
 * Initialization
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize GA
    initializeGA();
    
    // Setup UI
    attachAuthButtons();
    setupMobileMenu();
    setupSmoothScroll();
    setupModalClose();
    
    // Setup form handlers
    handleFormSubmit('loginForm', (data) => {
        return login(data.email, data.password);
    });
    
    handleFormSubmit('registerForm', (data) => {
        return register(data);
    });
    
    // Switch between login/register modals
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('loginModal');
            openModal('registerModal');
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('registerModal');
            openModal('loginModal');
        });
    }
    
    // Update navbar based on current auth state
    updateNavbar();
    
    // Setup role-based button clicks
    const registerSupplierBtn = document.querySelector('.register-supplier');
    const registerBuyerBtn = document.querySelector('.register-buyer');
    
    if (registerSupplierBtn) {
        registerSupplierBtn.addEventListener('click', () => {
            openModal('registerModal');
            document.getElementById('regRole').value = 'supplier';
        });
    }
    
    if (registerBuyerBtn) {
        registerBuyerBtn.addEventListener('click', () => {
            openModal('registerModal');
            document.getElementById('regRole').value = 'buyer';
        });
    }
    
    // Hero CTA buttons
    const heroCtaButtons = document.querySelectorAll('.hero-cta .btn-primary');
    heroCtaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            openModal('registerModal');
            trackEvent('hero_cta_click');
        });
    });
});

/**
 * Export functions untuk global access
 */
window.TautanID = {
    register,
    login,
    logout,
    openModal,
    closeModal,
    apiCall,
    showNotification,
    trackEvent,
    getSuppliers,
    filterByRole,
    performAIMatch,
    trackProductView,
    trackAddToCart,
    trackPurchase,
    formatCurrency,
    getUser,
    getToken
};
