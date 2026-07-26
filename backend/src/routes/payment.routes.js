const express = require('express');
const router = express.Router();
const {
  initPayment,
  verifyCallback,
  paystackWebhook,
  getPaymentStatus,
} = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Webhook must be raw body for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), paystackWebhook);

// Public callback
router.get('/verify', verifyCallback);

// Protected routes
router.post('/initialize', authenticate, initPayment);
router.get('/status/:bookingId', authenticate, getPaymentStatus);

module.exports = router;