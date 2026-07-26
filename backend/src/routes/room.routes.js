const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  getRoomById,
  getRoomAvailability,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/room.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { uploadRoomImages } = require('../middleware/upload.middleware');

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.get('/:id/availability', getRoomAvailability);
router.post('/', authenticate, requireAdmin, uploadRoomImages, createRoom);
router.put('/:id', authenticate, requireAdmin, uploadRoomImages, updateRoom);
router.delete('/:id', authenticate, requireAdmin, deleteRoom);

module.exports = router;