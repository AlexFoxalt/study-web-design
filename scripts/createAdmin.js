const bcrypt = require('bcrypt');
const pool = require('../db');
require('dotenv').config();

const createAdmin = async (username, password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.query(
      'INSERT INTO Administrators (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );

    console.log('Admin account created successfully');
  } catch (err) {
    console.error('Error creating admin account:', err);
  }
};

// Replace 'admin' and 'admin' with your desired admin credentials
createAdmin('admin', 'admin');
