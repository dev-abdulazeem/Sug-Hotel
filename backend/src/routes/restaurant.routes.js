const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require('../controllers/restaurant.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { uploadHeroImage } = require('../middleware/upload.middleware');

router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', authenticate, requireAdmin, uploadHeroImage, createRestaurant);
router.put('/:id', authenticate, requireAdmin, uploadHeroImage, updateRestaurant);
router.delete('/:id', authenticate, requireAdmin, deleteRestaurant);

module.exports = router;