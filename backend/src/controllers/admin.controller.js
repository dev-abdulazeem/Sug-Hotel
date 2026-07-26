const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('../utils/asyncHandler');

const prisma = new PrismaClient();

const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    totalUsers,
    totalRooms,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    checkedInBookings,
    checkedOutBookings,
    cancelledBookings,
    monthlyRevenue,
    yearlyRevenue,
    totalRevenue,
    unreadMessages,
    recentBookings,
    totalRestaurants,
    totalReservations,
    pendingReservations,
    confirmedReservations,
    completedReservations,
    cancelledReservations,
    totalGalleryAlbums,
    totalGalleryPhotos,
    recentReservations,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.room.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({ where: { status: 'CONFIRMED' } }),
    prisma.booking.count({ where: { status: 'CHECKED_IN' } }),
    prisma.booking.count({ where: { status: 'CHECKED_OUT' } }),
    prisma.booking.count({ where: { status: 'CANCELLED' } }),
    prisma.booking.aggregate({
      where: {
        status: { in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] },
        createdAt: { gte: startOfMonth },
      },
      _sum: { totalAmount: true },
    }),
    prisma.booking.aggregate({
      where: {
        status: { in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] },
        createdAt: { gte: startOfYear },
      },
      _sum: { totalAmount: true },
    }),
    prisma.booking.aggregate({
      where: {
        status: { in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] },
      },
      _sum: { totalAmount: true },
    }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        room: { select: { name: true } },
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    }),
    prisma.restaurant.count(),
    prisma.tableReservation.count(),
    prisma.tableReservation.count({ where: { status: 'PENDING' } }),
    prisma.tableReservation.count({ where: { status: 'CONFIRMED' } }),
    prisma.tableReservation.count({ where: { status: 'COMPLETED' } }),
    prisma.tableReservation.count({ where: { status: 'CANCELLED' } }),
    prisma.galleryAlbum.count(),
    prisma.galleryPhoto.count(),
    prisma.tableReservation.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        restaurant: { select: { name: true } },
      },
    }),
  ]);

  res.json({
    stats: {
      totalUsers,
      totalRooms,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      checkedInBookings,
      checkedOutBookings,
      cancelledBookings,
      monthlyRevenue: monthlyRevenue._sum.totalAmount || 0,
      yearlyRevenue: yearlyRevenue._sum.totalAmount || 0,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      unreadMessages,
      totalRestaurants,
      totalReservations,
      pendingReservations,
      confirmedReservations,
      completedReservations,
      cancelledReservations,
      totalGalleryAlbums,
      totalGalleryPhotos,
    },
    recentBookings,
    recentReservations,
  });
});

// Get occupancy rate
const getOccupancyStats = asyncHandler(async (req, res) => {
  const totalRooms = await prisma.room.count();
  const currentlyOccupied = await prisma.booking.count({
    where: { status: 'CHECKED_IN' },
  });

  const occupancyRate = totalRooms > 0
    ? ((currentlyOccupied / totalRooms) * 100).toFixed(1)
    : 0;

  res.json({
    totalRooms,
    currentlyOccupied,
    availableRooms: totalRooms - currentlyOccupied,
    occupancyRate: `${occupancyRate}%`,
  });
});

module.exports = { getDashboardStats, getOccupancyStats };