const express = require('express');
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getBookingById,
  checkout,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} = require('../controllers/booking.controller');

const {
  authenticate,
  requireAdminOrReceptionist,
} = require('../middleware/auth.middleware');

// ─── User Routes ────────────────────────────────────────────

router.post('/', authenticate, createBooking);

// Specific routes MUST come before parameterized routes
router.get('/my-bookings', authenticate, getMyBookings);
router.get('/all', authenticate, requireAdminOrReceptionist, getAllBookings);  // ← BEFORE /:id

router.get('/:id', authenticate, getBookingById);  // ← AFTER /all
router.post('/:id/checkout', authenticate, checkout);
router.post('/:id/cancel', authenticate, cancelBooking);
router.patch('/:id/status', authenticate, requireAdminOrReceptionist, updateBookingStatus);

module.exports = router;