const pool = require('../db');

const createBooking = async (
  clientId,
  courtId,
  timeSlotId,
  dateString,
  amountToPay
) => {
  const day = dateString.slice(-5, -3);
  const month = dateString.slice(-2);
  const year = new Date().getFullYear();
  const date = new Date(`${year}-${month}-${day}`);

  const res = await pool.query(
    'INSERT INTO bookings (client_id, court_id, time_slot_id, date, amount_to_pay) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [clientId, courtId, timeSlotId, date, amountToPay]
  );
  return res.rows[0];
};

const getAllBookings = async () => {
  const res = await pool.query('SELECT * FROM bookings');
  return res.rows;
};

const getAllBookingsWithClientInfo = async (courtId) => {
  const res = await pool.query(
    `
      SELECT b.id, b.client_id, b.court_id, b.paid, b.amount_to_pay, b.time_slot_id, b.date::text, c.first_name, c.last_name, c.phone_number
      FROM bookings b
      JOIN clients c ON b.client_id = c.id
      WHERE b.court_id = $1
    `,
    [courtId]
  );
  return res.rows;
};

const payBooking = async (id) => {
  await pool.query('UPDATE bookings SET paid = true WHERE id = $1;', [id]);
};

const deleteBooking = async (id) => {
  await pool.query('DELETE FROM bookings WHERE id = $1', [id]);
};

module.exports = {
  createBooking,
  getAllBookings,
  getAllBookingsWithClientInfo,
  deleteBooking,
  payBooking,
};
