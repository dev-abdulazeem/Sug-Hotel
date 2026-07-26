const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('../utils/asyncHandler');

const prisma = new PrismaClient();

const getHeroImages = asyncHandler(async (req, res) => {
  const images = await prisma.heroImage.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  res.json({ images });
});

const createHeroImage = asyncHandler(async (req, res) => {
  const { title, subtitle } = req.body;
  const imageUrl = req.file?.path;

  if (!imageUrl) {
    return res.status(400).json({ message: 'Image is required.' });
  }

  const count = await prisma.heroImage.count();
  
  const image = await prisma.heroImage.create({
    data: {
      imageUrl,
      title,
      subtitle,
      order: count,
    },
  });

  res.status(201).json({ message: 'Hero image added.', image });
});

const updateHeroImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, isActive, order } = req.body;

  const updateData = { title, subtitle };
  if (isActive !== undefined) updateData.isActive = isActive === 'true';
  if (order !== undefined) updateData.order = parseInt(order);
  if (req.file) updateData.imageUrl = req.file.path;

  const image = await prisma.heroImage.update({
    where: { id },
    data: updateData,
  });

  res.json({ message: 'Hero image updated.', image });
});

const deleteHeroImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.heroImage.delete({ where: { id } });
  res.json({ message: 'Hero image deleted.' });
});

module.exports = {
  getHeroImages,
  createHeroImage,
  updateHeroImage,
  deleteHeroImage,
};