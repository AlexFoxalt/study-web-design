const pool = require('../db');
require('dotenv').config();

const createTimeSlots = async () => {
  try {
    const startHour = 8;
    const endHour = 22;

    for (let hour = startHour; hour < endHour; hour++) {
      const slotName = `${hour}:00 - ${hour + 1}:00`;
      await pool.query('INSERT INTO time_slots (name) VALUES ($1)', [slotName]);
    }

    console.log('Time slots created successfully');
  } catch (err) {
    console.error('Error creating time slots:', err);
  }
};

createTimeSlots();
