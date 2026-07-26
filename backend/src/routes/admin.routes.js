const express = require('express');
const router = express.Router();
const { getDashboardStats, getOccupancyStats } = require('../controllers/admin.controller');
const { authenticate, requireAdmin, requireAdminOrReceptionist } = require('../middleware/auth.middleware');

// Admin & Receptionist routes
router.get('/stats', authenticate, requireAdminOrReceptionist, getDashboardStats);
router.get('/occupancy', authenticate, requireAdminOrReceptionist, getOccupancyStats);

// Admin-only routes ()
// router.get('/users', authenticate, requireAdmin, getAllUsers);
// router.delete('/users/:id', authenticate, requireAdmin, deleteUser);

module.exports = router;