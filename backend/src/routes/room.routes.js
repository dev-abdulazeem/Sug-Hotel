const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  getRoomById,
  getRoomAvailability,
  createRoom,
  updateRoom,
  deleteRoom,
  deleteRoomImage,
} = require('../controllers/room.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { uploadRoomImages } = require('../middleware/upload.middleware');

// Public routes
router.get('/', getAllRooms);

// Admin create
router.post('/', authenticate, requireAdmin, uploadRoomImages, createRoom);

// Specific /:id/... routes MUST come BEFORE generic /:id routes
router.get('/:id/availability', getRoomAvailability);
router.delete('/:id/images', authenticate, requireAdmin, deleteRoomImage);

// Generic /:id routes come LAST
router.get('/:id', getRoomById);
router.put('/:id', authenticate, requireAdmin, uploadRoomImages, updateRoom);
router.delete('/:id', authenticate, requireAdmin, deleteRoom);

module.exports = router;