const pool = require('../db');

const getAllTimeSlots = async () => {
  const res = await pool.query('SELECT * FROM time_slots ORDER BY id');
  return res.rows;
};

const getTimeSlotByName = async (name) => {
  const res = await pool.query('SELECT * FROM time_slots WHERE name = $1', [
    name,
  ]);
  return res.rows[0];
};

module.exports = {
  getAllTimeSlots,
  getTimeSlotByName,
};
