const express = require('express');
const router = express.Router();
const {
  getAllAlbums,
  getAlbumBySlug,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addPhoto,
  deletePhoto,
} = require('../controllers/gallery.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { uploadHeroImage, uploadRoomImages } = require('../middleware/upload.middleware');

// Public
router.get('/', getAllAlbums);
router.get('/:slug', getAlbumBySlug);

// Admin
router.post('/', authenticate, requireAdmin, uploadHeroImage, createAlbum);
router.put('/:id', authenticate, requireAdmin, uploadHeroImage, updateAlbum);
router.delete('/:id', authenticate, requireAdmin, deleteAlbum);
router.post('/:albumId/photos', authenticate, requireAdmin, uploadHeroImage, addPhoto);
router.delete('/photos/:photoId', authenticate, requireAdmin, deletePhoto);

module.exports = router;