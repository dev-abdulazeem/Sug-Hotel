const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('../utils/asyncHandler');
const { sendEmail } = require('../services/email.service');
const { appendToDailyExport } = require('../utils/dailyExportHelper');

const prisma = new PrismaClient();

// ─── Helpers ───────────────────────────────────────────────

// Export reservation action to daily Excel (appends to "Reservations" sheet)
const exportReservationToExcel = async (reservation, action, adminName) => {
  try {
    const receptionists = await prisma.user.findMany({ where: { role: 'RECEPTIONIST' } });

    const row = {
      'Reservation ID': reservation.id,
      'Guest Name': reservation.name,
      'Guest Email': reservation.email,
      'Guest Phone': reservation.phone,
      'Restaurant': reservation.restaurant.name,
      'Date': reservation.date.toISOString().split('T')[0],
      'Time': reservation.time,
      'Guests': reservation.guests,
      'Special Requests': reservation.specialRequests || 'None',
      'Status': reservation.status,
      'Action': action,
      'Action By': adminName || 'System',
      'Timestamp': new Date().toISOString(),
    };

    receptionists.forEach((receptionist) => {
      appendToDailyExport(receptionist.id, 'Reservations', [row]);
    });
  } catch (err) {
    console.error('Reservation export error:', err.message);
  }
};

// ─── User Reservation Actions ────────────────────────────────

// Create table reservation (public/guest)
const createReservation = asyncHandler(async (req, res) => {
  const { restaurantId, name, email, phone, date, time, guests, specialRequests } = req.body;
  const userId = req.user?.id;

  const reservation = await prisma.tableReservation.create({
    data: {
      restaurantId,
      userId: userId || null,
      name,
      email,
      phone,
      date: new Date(date),
      time,
      guests: parseInt(guests),
      specialRequests,
      status: 'PENDING',
    },
    include: { restaurant: true },
  });

  // Export to daily Excel
  const adminName = req.user ? `${req.user.firstName} ${req.user.lastName}` : 'Guest';
  await exportReservationToExcel(reservation, 'Created', adminName);

  // Send confirmation email
  await sendEmail({
    to: email,
    toName: name,
    subject: `Table Reservation Request - ${reservation.restaurant.name}`,
    htmlContent: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a1a; padding: 40px; text-align: center;">
          <h1 style="color: #c9a96e; margin: 0;">SUG HOTEL</h1>
        </div>
        <div style="padding: 40px; background: #fafafa;">
          <h2 style="font-weight: 400;">Reservation Received</h2>
          <p>Dear ${name},</p>
          <p>Your table reservation request at <strong>${reservation.restaurant.name}</strong> has been received.</p>
          <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Guests:</strong> ${guests}</p>
            <p><strong>Status:</strong> Pending Confirmation</p>
          </div>
          <p>We will confirm your reservation shortly.</p>
        </div>
      </div>
    `,
  });

  res.status(201).json({ message: 'Reservation request submitted.', reservation });
});

// Get user's reservations
const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await prisma.tableReservation.findMany({
    where: { userId: req.user.id },
    include: { restaurant: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ reservations });
});

// ─── Admin Reservation Actions ─────────────────────────────

// Admin: Get all reservations
const getAllReservations = asyncHandler(async (req, res) => {
  const { status, restaurantId } = req.query;
  const where = {};
  if (status) where.status = status;
  if (restaurantId) where.restaurantId = restaurantId;

  const reservations = await prisma.tableReservation.findMany({
    where,
    include: {
      restaurant: { select: { name: true } },
      user: { select: { firstName: true, lastName: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ reservations });
});

// Admin: Update reservation status
const updateReservationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const reservation = await prisma.tableReservation.update({
    where: { id },
    data: { status },
    include: { restaurant: true },
  });

  // Log to daily Excel for receptionists
  const adminName = req.user ? `${req.user.firstName} ${req.user.lastName}` : 'System';
  await exportReservationToExcel(reservation, `Status changed to ${status}`, adminName);

  // Send status update email
  const statusMessages = {
    CONFIRMED: 'Your table reservation is confirmed!',
    CANCELLED: 'Your table reservation has been cancelled.',
    COMPLETED: 'Thank you for dining with us!',
  };

  if (statusMessages[status]) {
    await sendEmail({
      to: reservation.email,
      toName: reservation.name,
      subject: statusMessages[status],
      htmlContent: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a1a1a; padding: 40px; text-align: center;">
            <h1 style="color: #c9a96e; margin: 0;">SUG HOTEL</h1>
          </div>
          <div style="padding: 40px; background: #fafafa;">
            <h2 style="font-weight: 400;">${statusMessages[status]}</h2>
            <p>Dear ${reservation.name},</p>
            <p>Your reservation at <strong>${reservation.restaurant.name}</strong> on ${new Date(reservation.date).toLocaleDateString()} at ${reservation.time} has been updated.</p>
            <p><strong>Status:</strong> ${status}</p>
          </div>
        </div>
      `,
    });
  }

  res.json({ message: 'Reservation updated.', reservation });
});

// ─── Exports ───────────────────────────────────────────────

module.exports = {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
  exportReservationToExcel,
};