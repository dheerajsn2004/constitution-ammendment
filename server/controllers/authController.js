const User = require('../models/User');
const crypto = require('crypto');

const generateSessionToken = () => crypto.randomBytes(32).toString('hex');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await User.create({ name, email, password });
    const sessionToken = generateSessionToken();
    user.sessionToken = sessionToken;
    await user.save();

    res.status(201).json({ 
      message: 'Signup successful',
      sessionToken // Send token in response
    });
  } catch (error) {
    res.status(400).json({ message: 'Signup failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const sessionToken = generateSessionToken();
    user.sessionToken = sessionToken;
    await user.save();

    res.json({ 
      message: 'Login successful',
      sessionToken // Send token in response
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.logout = async (req, res) => {
  try {
    const user = await User.findOne({ sessionToken: req.headers.authorization });
    if (!user) return res.status(400).json({ message: 'Invalid session token' });

    user.sessionToken = null;
    await user.save();

    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};