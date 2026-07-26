const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── Authentication ──────────────────────────────────────

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// ─── Role Guards ───────────────────────────────────────────

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
};

const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ message: 'Super admin access required.' });
  }
  next();
};

const requireReceptionist = (req, res, next) => {
  if (!['RECEPTIONIST', 'ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Receptionist access required.' });
  }
  next();
};

const requireAdminOrReceptionist = (req, res, next) => {
  if (!['RECEPTIONIST', 'ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Admin or receptionist access required.' });
  }
  next();
};

// ─── Exports ───────────────────────────────────────────────

module.exports = {
  authenticate,
  requireAdmin,
  requireSuperAdmin,
  requireReceptionist,
  requireAdminOrReceptionist,
};