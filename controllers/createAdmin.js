const bcrypt = require('bcrypt');
const { pool } = require('./app');
require('dotenv').config();

const createAdmin = async (username, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    let finalHashedPassword = hashedPassword;
    for (let i = 0; i < 50; i++) {
      finalHashedPassword = await bcrypt.hash(finalHashedPassword, 10);
    }

    const res = await pool.query(
      'INSERT INTO Administrators (username, password) VALUES ($1, $2) RETURNING *',
      [username, finalHashedPassword]
    );

    console.log('Admin account created:', res.rows[0]);
  } catch (err) {
    console.error('Error creating admin account:', err);
  } finally {
    pool.end();
  }
};

// Replace 'adminUsername' and 'adminPassword' with your desired admin credentials
createAdmin('admin', 'verystrongpass');
