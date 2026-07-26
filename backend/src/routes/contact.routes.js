const express = require('express');
const router = express.Router();
const { createContact, getAllMessages, markAsRead } = require('../controllers/contact.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.post('/', createContact);
router.get('/', authenticate, requireAdmin, getAllMessages);
router.patch('/:id/read', authenticate, requireAdmin, markAsRead);

module.exports = router;