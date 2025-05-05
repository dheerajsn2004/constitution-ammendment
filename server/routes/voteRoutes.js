const express = require('express');
const { submitVote, checkVote } = require('../controllers/voteController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, submitVote);
router.get('/check', protect, checkVote); // Add this new route

module.exports = router;