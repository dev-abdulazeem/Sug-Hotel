const express = require('express');
const router = express.Router();
const { register, login, refresh, getMe, logout } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

module.exports = router;