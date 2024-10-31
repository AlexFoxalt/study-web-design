const pool = require('../db');
const { toCamelCase } = require('../utils/caseConverter');

const getAllClients = async () => {
  const models = await pool.query('SELECT * FROM Clients');
  const result = models.rows.map(toCamelCase);
  return result;
};

const createClient = async (
  firstName,
  lastName,
  phoneNumber,
  carNumber,
  dateOfBirth
) => {
  const res = await pool.query(
    'INSERT INTO Clients (first_name, last_name, phone_number, car_number, date_of_birth) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [firstName, lastName, phoneNumber, carNumber, dateOfBirth]
  );
  return toCamelCase(res.rows[0]);
};

const deleteClient = async (id) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM bookings WHERE bookings.client_id = $1;', [
      id,
    ]);
    await client.query('DELETE FROM clients WHERE id = $1;', [id]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
};

module.exports = {
  getAllClients,
  createClient,
  deleteClient,
};
