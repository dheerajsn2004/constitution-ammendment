const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amendment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Amendment', 
    required: true 
  },
  choice: { 
    type: String, 
    enum: ['YES', 'NO'], 
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

// Ensure one vote per user per amendment
voteSchema.index({ user: 1, amendment: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);