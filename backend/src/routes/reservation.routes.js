const express = require('express');
const router = express.Router();

const {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
} = require('../controllers/reservation.controller');

const {
  authenticate,
  requireAdminOrReceptionist,
} = require('../middleware/auth.middleware');

// Public
router.post('/', createReservation);

// User routes
router.get('/my', authenticate, getMyReservations);

// Admin & Receptionist — BEFORE /:id
router.get('/all', authenticate, requireAdminOrReceptionist, getAllReservations);
router.patch('/:id/status', authenticate, requireAdminOrReceptionist, updateReservationStatus);

module.exports = router;