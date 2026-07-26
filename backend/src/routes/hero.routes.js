const express = require('express');
const router = express.Router();
const {
  getHeroImages,
  createHeroImage,
  updateHeroImage,
  deleteHeroImage,
} = require('../controllers/hero.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { uploadHeroImage } = require('../middleware/upload.middleware');

router.get('/', getHeroImages);
router.post('/', authenticate, requireAdmin, uploadHeroImage, createHeroImage);
router.put('/:id', authenticate, requireAdmin, uploadHeroImage, updateHeroImage);
router.delete('/:id', authenticate, requireAdmin, deleteHeroImage);

module.exports = router;