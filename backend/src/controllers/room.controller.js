const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('../utils/asyncHandler');
const cloudinary = require('../config/cloudinary');

const prisma = new PrismaClient();

// Get all rooms with availability check for date range
const getAllRooms = asyncHandler(async (req, res) => {
  const { checkIn, checkOut } = req.query;

  let rooms = await prisma.room.findMany({
    orderBy: { pricePerNight: 'asc' },
  });

  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'CHECKED_IN'] },
        OR: [
          {
            checkIn: { lte: checkOutDate },
            checkOut: { gte: checkInDate },
          },
        ],
      },
      select: { roomId: true },
    });

    const bookedRoomIds = new Set(bookings.map((b) => b.roomId));

    rooms = rooms.map((room) => ({
      ...room,
      isAvailableForDates: !bookedRoomIds.has(room.id),
    }));
  }

  res.json({ rooms });
});

// Get single room with availability
const getRoomById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut } = req.query;

  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) {
    return res.status(404).json({ message: 'Room not found.' });
  }

  let isAvailableForDates = true;

  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        roomId: id,
        status: { in: ['CONFIRMED', 'CHECKED_IN'] },
        checkIn: { lte: checkOutDate },
        checkOut: { gte: checkInDate },
      },
    });

    isAvailableForDates = !overlappingBooking;
  }

  res.json({ room: { ...room, isAvailableForDates } });
});

// Get room availability calendar
const getRoomAvailability = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate } = req.query;

  const bookings = await prisma.booking.findMany({
    where: {
      roomId: id,
      status: { in: ['CONFIRMED', 'CHECKED_IN'] },
      checkIn: { gte: new Date(startDate) },
      checkOut: { lte: new Date(endDate) },
    },
    select: {
      checkIn: true,
      checkOut: true,
      status: true,
    },
  });

  res.json({ bookings });
});

// Create room (Admin)
const createRoom = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    type,
    pricePerNight,
    capacity,
    size,
    bedType,
    amenities,
    featured,
  } = req.body;

  const images = req.files?.map((file) => file.path) || [];

  const room = await prisma.room.create({
    data: {
      name,
      description,
      type,
      pricePerNight: parseFloat(pricePerNight),
      capacity: parseInt(capacity),
      size: size ? parseInt(size) : null,
      bedType,
      amenities: Array.isArray(amenities) ? amenities : amenities.split(','),
      images,
      featured: featured === 'true',
    },
  });

  res.status(201).json({ message: 'Room created successfully.', room });
});

// Update room (Admin)
const updateRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  if (req.files?.length > 0) {
    updateData.images = req.files.map((file) => file.path);
  }

  if (updateData.pricePerNight) {
    updateData.pricePerNight = parseFloat(updateData.pricePerNight);
  }
  if (updateData.capacity) {
    updateData.capacity = parseInt(updateData.capacity);
  }
  if (updateData.size) {
    updateData.size = parseInt(updateData.size);
  }
  if (updateData.amenities) {
    updateData.amenities = Array.isArray(updateData.amenities)
      ? updateData.amenities
      : updateData.amenities.split(',');
  }
  if (updateData.featured !== undefined) {
    updateData.featured = updateData.featured === 'true';
  }

  const room = await prisma.room.update({
    where: { id },
    data: updateData,
  });

  res.json({ message: 'Room updated successfully.', room });
});

// Delete room (Admin)
const deleteRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const activeBookings = await prisma.booking.findFirst({
    where: {
      roomId: id,
      status: { in: ['CONFIRMED', 'CHECKED_IN', 'PENDING'] },
    },
  });

  if (activeBookings) {
    return res.status(400).json({
      message: 'Cannot delete room with active or pending bookings.',
    });
  }

  await prisma.room.delete({ where: { id } });
  res.json({ message: 'Room deleted successfully.' });
});

// Delete a single image from a room (Admin)
const deleteRoomImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: 'imageUrl is required' });
  }

  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  if (!room.images.includes(imageUrl)) {
    return res.status(400).json({ message: 'Image not found on this room' });
  }

  const updatedImages = room.images.filter((img) => img !== imageUrl);

  await prisma.room.update({
    where: { id },
    data: { images: updatedImages },
  });

  // Try to delete from Cloudinary
  try {
    const urlParts = imageUrl.split('/');
    const filenameWithExt = urlParts[urlParts.length - 1];
    const publicId = filenameWithExt.split('.')[0];
    const folder = urlParts[urlParts.length - 2] || 'rooms';
    await cloudinary.uploader.destroy(`${folder}/${publicId}`);
  } catch (err) {
    console.log('Cloudinary delete skipped:', err.message);
  }

  res.json({ message: 'Image removed successfully', images: updatedImages });
});

module.exports = {
  getAllRooms,
  getRoomById,
  getRoomAvailability,
  createRoom,
  updateRoom,
  deleteRoom,
  deleteRoomImage,
};