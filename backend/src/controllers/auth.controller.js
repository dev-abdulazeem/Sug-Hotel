const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { generateTokens } = require('../utils/generateToken');
const { sendEmail, emailTemplates } = require('../services/email.service');
const asyncHandler = require('../utils/asyncHandler');

const prisma = new PrismaClient();

// Register
const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered.' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
    },
  });

  const { accessToken, refreshToken } = generateTokens(user.id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send welcome email
  await sendEmail({
    to: email,
    toName: `${firstName} ${lastName}`,
    ...emailTemplates.welcome(firstName),
  });

  res.status(201).json({
    message: 'Account created successfully.',
    user,
    accessToken,
  });
});

// Login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const { accessToken, refreshToken } = generateTokens(user.id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    message: 'Login successful.',
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    accessToken,
  });
});

// Refresh Token
const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { accessToken } = generateTokens(decoded.userId);
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token.' });
  }
});

// Get Me
const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  res.json({ user });
});

// Logout
const logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully.' });
});

module.exports = { register, login, refresh, getMe, logout };