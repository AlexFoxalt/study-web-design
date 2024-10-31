const pool = require('../db');

const findByUsername = async (username) => {
  const res = await pool.query(
    'SELECT * FROM Administrators WHERE username = $1',
    [username]
  );
  return res.rows[0];
};

module.exports = {
  findByUsername,
};
