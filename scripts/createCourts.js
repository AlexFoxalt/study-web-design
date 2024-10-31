const pool = require('../db');
require('dotenv').config();

const createCourts = async () => {
  const courtsData = [
    ['Wimbledon', 'grass', 45.0],
    ['Rolland Garros', 'clay', 30.0],
    ['Melbourne Park', 'hard', 25.0],
    ['Dubai Tennis Centre', 'hard', 25.0],
  ];
  try {
    for (const court of courtsData) {
      await pool.query(
        'INSERT INTO courts (name, surface_type, cost_per_hour) VALUES ($1, $2, $3)',
        [court[0], court[1], court[2]]
      );
    }
    console.log('Courts created successfully');
  } catch (err) {
    console.error('Error creating courts:', err);
  }
};

createCourts();
