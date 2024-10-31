const Court = require('../models/court');
const { get } = require('../routes');

const createCourt = async (req, res) => {
  const { name, surfaceType, costPerHour } = req.body;
  const newCourt = await Court.createCourt(name, surfaceType, costPerHour);
  res.json(newCourt);
};

const getAllCourts = async (req, res) => {
  try {
    const courts = await Court.getAllCourts();
    res.json(courts);
  } catch (err) {
    console.error('Error fetching courts:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createCourt,
  getAllCourts,
};
