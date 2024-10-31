const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
require('dotenv').config();

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findByUsername(username);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  login,
};
