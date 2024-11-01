const pool = require('../db');

const createCourt = async (name, surfaceType, costPerHour) => {
  console.log(name, surfaceType, costPerHour);
  const res = await pool.query(
    'INSERT INTO Courts (name, surface_type, cost_per_hour) VALUES ($1, $2, $3) RETURNING *',
    [name, surfaceType, costPerHour]
  );
  return res.rows[0];
};

const getCourtById = async (courtId) => {
  const res = await pool.query('SELECT * FROM courts WHERE id = $1', [courtId]);
  return res.rows[0];
};

const getAllCourts = async () => {
  const res = await pool.query('SELECT * FROM courts');
  return res.rows;
};

module.exports = {
  createCourt,
  getCourtById,
  getAllCourts,
};
