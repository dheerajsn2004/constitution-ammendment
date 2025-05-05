const Vote = require('../models/Vote');

exports.submitVote = async (req, res) => {
  const { choice } = req.body;
  try {
    const existingVote = await Vote.findOne({ user: req.user.id });
    if (existingVote) {
      return res.status(400).json({ message: 'Already voted' });
    }

    const vote = new Vote({ user: req.user.id, choice });
    await vote.save();
    res.json({ message: 'Vote recorded' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.checkVote = async (req, res) => {
  try {
    const existingVote = await Vote.findOne({ user: req.user._id });
    if (!existingVote) {
      return res.json({ hasVoted: false });
    }
    res.json({ 
      hasVoted: true,
      choice: existingVote.choice // Optionally include the vote choice
    });
  } catch (err) {
    console.error('Vote check error:', err);
    res.status(500).json({ 
      error: 'Failed to check vote status',
      details: err.message 
    });
  }
};