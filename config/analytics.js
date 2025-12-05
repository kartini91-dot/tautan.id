/**
 * Analytics Configuration
 * Google Analytics 4 setup dan event tracking
 */

// Initialize GA on frontend (see app.js for client-side)
const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Server-side event tracking (optional, for backend events)
const trackBackendEvent = async (eventName, eventParams = {}) => {
  // This would typically send to Google Analytics 4 API
  // For backend events, you might use Measurement Protocol
  
  if (process.env.NODE_ENV === 'production') {
    try {
      const response = await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`, {
        method: 'POST',
        body: JSON.stringify({
          client_id: 'backend-server',
          events: [
            {
              name: eventName,
              params: {
                session_id: new Date().getTime(),
                engagement_time_msec: '100',
                ...eventParams
              }
            }
          ]
        })
      });
      
      if (!response.ok) {
        console.error('GA tracking error:', response.statusText);
      }
    } catch (error) {
      console.error('GA tracking error:', error);
    }
  }
};

// Events mapping
const ANALYTICS_EVENTS = {
  // User events
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  
  // E-commerce events
  VIEW_ITEM: 'view_item',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  ADD_PAYMENT_INFO: 'add_payment_info',
  PURCHASE: 'purchase',
  
  // Business events
  VIEW_SUPPLIER: 'view_supplier',
  VIEW_PRODUCT_LISTING: 'view_product_listing',
  FILTER_BY_CATEGORY: 'filter_by_category',
  SEARCH_PRODUCTS: 'search_products',
  
  // Membership events
  UPGRADE_MEMBERSHIP: 'upgrade_membership',
  DOWNGRADE_MEMBERSHIP: 'downgrade_membership',
  
  // Referral events
  REFERRAL_SHARE: 'referral_share',
  REFERRAL_COMPLETED: 'referral_completed'
};

module.exports = {
  GA_MEASUREMENT_ID,
  trackBackendEvent,
  ANALYTICS_EVENTS
};
