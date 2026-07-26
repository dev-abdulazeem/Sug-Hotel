const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Room images storage
const roomStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sug-hotel/rooms',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'fill' }],
  },
});

// Hero images storage
const heroStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sug-hotel/hero',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1920, height: 1080, crop: 'fill' }],
  },
});

const uploadRoomImages = multer({ storage: roomStorage }).array('images', 8);
const uploadHeroImage = multer({ storage: heroStorage }).single('image');

// Restaurant images storage
const restaurantStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sug-hotel/restaurants',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'fill' }],
  },
});

const uploadRestaurantImage = multer({ storage: restaurantStorage }).single('image');

module.exports = {
  uploadRoomImages,
  uploadHeroImage,
  uploadRestaurantImage,
};