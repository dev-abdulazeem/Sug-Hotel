const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('../utils/asyncHandler');
const { sendEmail, emailTemplates } = require('../services/email.service');

const prisma = new PrismaClient();

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const contact = await prisma.contactMessage.create({
    data: { name, email, phone, subject, message },
  });

  // Auto-reply to user
  await sendEmail({
    to: email,
    toName: name,
    ...emailTemplates.contactReply(name),
  });

  res.status(201).json({
    message: 'Message sent successfully. We will get back to you soon.',
    contact,
  });
});

// Admin: Get all messages
const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  res.json({ messages });
});

// Admin: Mark as read
const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const message = await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  });

  res.json({ message: 'Marked as read.', contact: message });
});

module.exports = { createContact, getAllMessages, markAsRead };