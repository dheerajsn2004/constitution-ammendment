const express = require('express');
const { signup, login, logout } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protect, logout); // Logout requires authentication
router.get('/check', protect, (req, res) => res.json({ message: 'Authenticated' }));

module.exports = router;