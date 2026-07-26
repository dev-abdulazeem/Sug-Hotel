const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('../utils/asyncHandler');
const { initializePayment, verifyPayment } = require('../services/paystack.service');
const { sendEmail, emailTemplates } = require('../services/email.service');

const prisma = new PrismaClient();

// Track which booking refs we've already sent emails for (in-memory, per-process)
// For production with multiple servers, use Redis or a DB flag
const processedRefs = new Set();

// Initialize payment for a booking
const initPayment = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  const userId = req.user.id;

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
    include: { room: true, user: true },
  });

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  if (booking.paymentStatus === 'PAID') {
    return res.status(400).json({ message: 'This booking has already been paid for.' });
  }

  if (booking.status === 'CANCELLED') {
    return res.status(400).json({ message: 'Cannot pay for a cancelled booking.' });
  }

  const reference = `SUG-${uuidv4().split('-')[0].toUpperCase()}`;

  const payment = await initializePayment({
    email: booking.user.email,
    amount: Number(booking.totalAmount),
    reference,
    metadata: {
      bookingId: booking.id,
      userId: booking.userId,
      roomName: booking.room.name,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    },
  });

  if (!payment.success) {
    return res.status(400).json({ message: payment.message });
  }

  // Save payment reference to booking
  await prisma.booking.update({
    where: { id: bookingId },
    data: { paymentRef: reference },
  });

  res.json({
    message: 'Payment initialized. Complete payment on Paystack.',
    authorizationUrl: payment.authorizationUrl,
    reference: payment.reference,
  });
});

// Verify payment callback — ONLY sends email here
const verifyCallback = asyncHandler(async (req, res) => {
  const { reference } = req.query;

  if (!reference) {
    return res.status(400).json({ message: 'Payment reference is required.' });
  }

  // Prevent duplicate email sending
  if (processedRefs.has(reference)) {
    const booking = await prisma.booking.findFirst({
      where: { paymentRef: reference },
      include: { room: true, user: true },
    });
    return res.json({
      message: 'Payment already processed.',
      booking,
    });
  }

  const result = await verifyPayment(reference);

  if (!result.success) {
    return res.status(400).json({ message: result.message });
  }

  const booking = await prisma.booking.findFirst({
    where: { paymentRef: reference },
    include: { room: true, user: true },
  });

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found for this payment.' });
  }

  if (result.status === 'success') {
    // Mark as processed BEFORE any async operations to prevent race conditions
    processedRefs.add(reference);

    // Update booking to confirmed and paid
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
      },
      include: { room: true, user: true },
    });

    // ✅ Send confirmation email ONLY ONCE — after successful payment
    await sendEmail({
      to: booking.user.email,
      toName: `${booking.user.firstName} ${booking.user.lastName}`,
      ...emailTemplates.bookingConfirmation(updatedBooking, booking.room, booking.user),
    });

    return res.json({
      message: 'Payment successful! Your booking is confirmed.',
      booking: updatedBooking,
    });
  }

  // Payment failed or abandoned
  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: 'PENDING', paymentStatus: 'UNPAID' },
  });

  res.status(400).json({
    message: `Payment ${result.status}. Please try again.`,
    status: result.status,
  });
});

// Webhook handler — ONLY processes if callback hasn't already handled it
const paystackWebhook = asyncHandler(async (req, res) => {
  const hash = require('crypto')
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(400).json({ message: 'Invalid signature.' });
  }

  const event = req.body;

  if (event.event === 'charge.success') {
    const { reference, metadata } = event.data;

    // Skip if already processed by verifyCallback
    if (processedRefs.has(reference)) {
      return res.sendStatus(200);
    }

    const booking = await prisma.booking.findFirst({
      where: { paymentRef: reference },
      include: { room: true, user: true },
    });

    if (booking && booking.status === 'PENDING') {
      // Mark as processed
      processedRefs.add(reference);

      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
      });

      // ✅ Send confirmation email ONLY if verifyCallback didn't already send it
      await sendEmail({
        to: booking.user.email,
        toName: `${booking.user.firstName} ${booking.user.lastName}`,
        ...emailTemplates.bookingConfirmation(booking, booking.room, booking.user),
      });
    }
  }

  res.sendStatus(200);
});

// Get payment status for a booking
const getPaymentStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.id;

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
    select: {
      id: true,
      status: true,
      paymentStatus: true,
      paymentRef: true,
      totalAmount: true,
    },
  });

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  res.json({ payment: booking });
});

module.exports = {
  initPayment,
  verifyCallback,
  paystackWebhook,
  getPaymentStatus,
};