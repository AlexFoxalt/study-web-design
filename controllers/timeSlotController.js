const TimeSlot = require('../models/timeSlot');

const getAllTimeSlots = async (req, res) => {
  try {
    const timeSlots = await TimeSlot.getAllTimeSlots();
    res.json(timeSlots);
  } catch (err) {
    console.error('Error fetching time slots:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllTimeSlots,
};
