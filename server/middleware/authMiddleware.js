const User = require('../models/User');

const protect = async (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const user = await User.findOne({ sessionToken: token });
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = protect;