const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('../utils/asyncHandler');
const { sendEmail, emailTemplates } = require('../services/email.service');
const { appendToDailyExport } = require('../utils/dailyExportHelper');

const prisma = new PrismaClient();

// ─── Helpers ───────────────────────────────────────────────

// Check room availability
const isRoomAvailable = async (roomId, checkIn, checkOut, excludeBookingId = null) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const where = {
    roomId,
    status: { in: ['CONFIRMED', 'CHECKED_IN'] },
    checkIn: { lte: checkOutDate },
    checkOut: { gte: checkInDate },
  };

  if (excludeBookingId) {
    where.NOT = { id: excludeBookingId };
  }

  const overlapping = await prisma.booking.findFirst({ where });
  return !overlapping;
};

// Calculate nights between dates
const calculateNights = (checkIn, checkOut) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((new Date(checkOut) - new Date(checkIn)) / msPerDay);
};

// Export booking action to daily Excel (appends to "Bookings" sheet)
const exportBookingToExcel = async (booking, action, adminName) => {
  try {
    const receptionists = await prisma.user.findMany({ where: { role: 'RECEPTIONIST' } });

    const row = {
      'Booking ID': booking.id,
      'Guest Name': `${booking.user.firstName} ${booking.user.lastName}`,
      'Guest Email': booking.user.email,
      'Guest Phone': booking.user.phone || 'N/A',
      'Room Name': booking.room.name,
      'Check In': booking.checkIn.toISOString().split('T')[0],
      'Check Out': booking.checkOut.toISOString().split('T')[0],
      'Nights': booking.nights,
      'Guests': booking.guests,
      'Total Amount': Number(booking.totalAmount),
      'Payment Status': booking.paymentStatus,
      'Booking Status': booking.status,
      'Action': action,
      'Action By': adminName || 'System',
      'Timestamp': new Date().toISOString(),
    };

    receptionists.forEach((receptionist) => {
      appendToDailyExport(receptionist.id, 'Bookings', [row]);
    });
  } catch (err) {
    console.error('Booking export error:', err.message);
  }
};

// ─── User Booking Actions ──────────────────────────────────

// Create booking — NO EMAIL SENT HERE (booking is just PENDING)
const createBooking = asyncHandler(async (req, res) => {
  const { roomId, checkIn, checkOut, guests, specialRequests } = req.body;
  const userId = req.user.id;

  const available = await isRoomAvailable(roomId, checkIn, checkOut);
  if (!available) {
    return res.status(409).json({
      message: 'This room is not available for the selected dates.',
    });
  }

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    return res.status(404).json({ message: 'Room not found.' });
  }

  if (guests > room.capacity) {
    return res.status(400).json({
      message: `This room accommodates maximum ${room.capacity} guests.`,
    });
  }

  const nights = calculateNights(checkIn, checkOut);
  const totalAmount = room.pricePerNight * nights;

  const booking = await prisma.booking.create({
    data: {
      userId,
      roomId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests: parseInt(guests),
      nights,
      totalAmount,
      specialRequests,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
    },
    include: {
      room: true,
      user: true,
    },
  });

  res.status(201).json({
    message: 'Booking created successfully. Please complete payment to confirm.',
    booking,
  });
});

// Get user's bookings
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.user.id },
    include: { room: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ bookings });
});

// Get single booking
const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await prisma.booking.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
    include: { room: true },
  });

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  res.json({ booking });
});

// Checkout from website (makes room available again)
const checkout = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const booking = await prisma.booking.findFirst({
    where: { id, userId },
    include: { room: true, user: true },
  });

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  if (booking.status !== 'CHECKED_IN') {
    return res.status(400).json({
      message: 'You can only checkout from a checked-in booking.',
    });
  }

  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: { status: 'CHECKED_OUT' },
    include: { room: true, user: true },
  });

  // Export to daily Excel
  const adminName = req.user ? `${req.user.firstName} ${req.user.lastName}` : 'System';
  await exportBookingToExcel(updatedBooking, 'Guest Checkout', adminName);

  await sendEmail({
    to: booking.user.email,
    toName: `${booking.user.firstName} ${booking.user.lastName}`,
    subject: 'Thank You for Staying at SUG Hotel',
    htmlContent: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a1a; padding: 40px; text-align: center;">
          <h1 style="color: #c9a96e; margin: 0;">SUG HOTEL</h1>
        </div>
        <div style="padding: 40px; background: #fafafa;">
          <h2 style="font-weight: 400;">Thank You for Your Stay!</h2>
          <p>Dear ${booking.user.firstName},</p>
          <p>We hope you enjoyed your stay in our ${booking.room.name}. Your checkout has been processed successfully.</p>
          <p>We'd love to welcome you back soon!</p>
          <a href="${process.env.FRONTEND_URL}/rooms" 
             style="display: inline-block; background: #c9a96e; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 4px; margin-top: 20px;">
            Book Your Next Stay →
          </a>
        </div>
      </div>
    `,
  });

  res.json({
    message: 'Checkout successful. Room is now available for booking.',
    booking: updatedBooking,
  });
});

// Cancel booking
const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const booking = await prisma.booking.findFirst({
    where: { id, userId },
  });

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  if (booking.status === 'CHECKED_IN' || booking.status === 'CHECKED_OUT') {
    return res.status(400).json({
      message: 'Cannot cancel a booking that has already been checked in or out.',
    });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: 'CANCELLED' },
    include: { room: true, user: true },
  });

  // Export cancellation
  const adminName = req.user ? `${req.user.firstName} ${req.user.lastName}` : 'System';
  await exportBookingToExcel(updated, 'Guest Cancelled', adminName);

  res.json({ message: 'Booking cancelled successfully.', booking: updated });
});

// ─── Admin Booking Actions ─────────────────────────────────

// Admin: Get all bookings
const getAllBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const where = status ? { status } : {};

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        room: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    }),
    prisma.booking.count({ where }),
  ]);

  res.json({
    bookings,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// Admin: Update booking status
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validTransitions = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['CHECKED_IN', 'CANCELLED'],
    CHECKED_IN: ['CHECKED_OUT'],
  };

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { room: true, user: true },
  });

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  const allowed = validTransitions[booking.status] || [];
  if (!allowed.includes(status)) {
    return res.status(400).json({
      message: `Cannot transition from ${booking.status} to ${status}.`,
    });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status },
    include: { room: true, user: true },
  });

  // Log to daily Excel for receptionists
  const adminName = req.user ? `${req.user.firstName} ${req.user.lastName}` : 'System';
  await exportBookingToExcel(updated, `Status changed to ${status}`, adminName);

  // Send status update email
  const statusMessages = {
    CHECKED_IN: 'Welcome! Your check-in is complete.',
    CHECKED_OUT: 'Your stay has ended. Thank you for choosing us!',
    CANCELLED: 'Your booking has been cancelled.',
  };

  if (statusMessages[status]) {
    await sendEmail({
      to: booking.user.email,
      toName: `${booking.user.firstName} ${booking.user.lastName}`,
      subject: statusMessages[status],
      htmlContent: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a1a1a; padding: 40px; text-align: center;">
            <h1 style="color: #c9a96e; margin: 0;">SUG HOTEL</h1>
          </div>
          <div style="padding: 40px; background: #fafafa;">
            <h2 style="font-weight: 400;">${statusMessages[status]}</h2>
            <p>Dear ${booking.user.firstName},</p>
            <p>Your booking for <strong>${booking.room.name}</strong> has been updated.</p>
            <p><strong>Status:</strong> ${status}</p>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
          </div>
        </div>
      `,
    });
  }

  res.json({ message: 'Booking status updated.', booking: updated });
});

// ─── Exports ───────────────────────────────────────────────

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  checkout,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  exportBookingToExcel,
};