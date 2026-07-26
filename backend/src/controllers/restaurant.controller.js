const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('../utils/asyncHandler');

const prisma = new PrismaClient();

// Get all restaurants (public)
const getAllRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await prisma.restaurant.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
  res.json({ restaurants });
});

// Get single restaurant
const getRestaurantById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: { reservations: true },
  });
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found.' });
  res.json({ restaurant });
});

// Create restaurant (Admin)
const createRestaurant = asyncHandler(async (req, res) => {
  const { name, type, description, hours, location, phone, rating, specialties, order } = req.body;
  const image = req.file?.path;

  const restaurant = await prisma.restaurant.create({
    data: {
      name,
      type,
      description,
      image: image || '',
      hours,
      location,
      phone,
      rating: parseFloat(rating) || 4.5,
      specialties: Array.isArray(specialties) ? specialties : specialties?.split(',') || [],
      order: parseInt(order) || 0,
    },
  });

  res.status(201).json({ message: 'Restaurant created.', restaurant });
});

// Update restaurant (Admin)
const updateRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  
  if (req.file) updateData.image = req.file.path;
  if (updateData.rating) updateData.rating = parseFloat(updateData.rating);
  if (updateData.order) updateData.order = parseInt(updateData.order);
  if (updateData.specialties) {
    updateData.specialties = Array.isArray(updateData.specialties) 
      ? updateData.specialties 
      : updateData.specialties.split(',');
  }
  if (updateData.isActive !== undefined) updateData.isActive = updateData.isActive === 'true';

  const restaurant = await prisma.restaurant.update({
    where: { id },
    data: updateData,
  });

  res.json({ message: 'Restaurant updated.', restaurant });
});

// Delete restaurant (Admin)
const deleteRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.restaurant.delete({ where: { id } });
  res.json({ message: 'Restaurant deleted.' });
});

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};