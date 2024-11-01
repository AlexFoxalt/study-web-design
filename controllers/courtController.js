const Court = require('../models/court');
const { get } = require('../routes');

const createCourt = async (req, res) => {
  const { name, surfaceType, costPerHour } = req.body;
  try {
    const newCourt = await Court.createCourt(
      name,
      surfaceType,
      parseInt(costPerHour)
    );
    res.json(newCourt);
  } catch (err) {
    if (err.code === '23505') {
      // Unique constraint violation
      res
        .status(400)
        .json({ message: `Court with name '${name}' already exists` });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
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
