const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('../utils/asyncHandler');

const prisma = new PrismaClient();

// Get all albums with photos (public)
const getAllAlbums = asyncHandler(async (req, res) => {
  const albums = await prisma.galleryAlbum.findMany({
    where: { isActive: true },
    include: { photos: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
  });
  res.json({ albums });
});

// Get single album
const getAlbumBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const album = await prisma.galleryAlbum.findUnique({
    where: { slug },
    include: { photos: { orderBy: { order: 'asc' } } },
  });
  if (!album) return res.status(404).json({ message: 'Album not found.' });
  res.json({ album });
});

// Create album (Admin)
const createAlbum = asyncHandler(async (req, res) => {
  const { name, slug, description, order } = req.body;
  const coverImage = req.file?.path;

  const album = await prisma.galleryAlbum.create({
    data: {
      name,
      slug,
      description,
      coverImage: coverImage || '',
      order: parseInt(order) || 0,
    },
  });

  res.status(201).json({ message: 'Album created.', album });
});

// Update album (Admin)
const updateAlbum = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  
  if (req.file) updateData.coverImage = req.file.path;
  if (updateData.order) updateData.order = parseInt(updateData.order);
  if (updateData.isActive !== undefined) updateData.isActive = updateData.isActive === 'true';

  const album = await prisma.galleryAlbum.update({
    where: { id },
    data: updateData,
  });

  res.json({ message: 'Album updated.', album });
});

// Delete album (Admin)
const deleteAlbum = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.galleryAlbum.delete({ where: { id } });
  res.json({ message: 'Album deleted.' });
});

// Add photo to album (Admin)
const addPhoto = asyncHandler(async (req, res) => {
  const { albumId } = req.params;
  const { caption, order } = req.body;
  const imageUrl = req.file?.path;

  if (!imageUrl) return res.status(400).json({ message: 'Image is required.' });

  const photo = await prisma.galleryPhoto.create({
    data: {
      albumId,
      imageUrl,
      caption,
      order: parseInt(order) || 0,
    },
  });

  res.status(201).json({ message: 'Photo added.', photo });
});

// Delete photo (Admin)
const deletePhoto = asyncHandler(async (req, res) => {
  const { photoId } = req.params;
  await prisma.galleryPhoto.delete({ where: { id: photoId } });
  res.json({ message: 'Photo deleted.' });
});

module.exports = {
  getAllAlbums,
  getAlbumBySlug,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addPhoto,
  deletePhoto,
};