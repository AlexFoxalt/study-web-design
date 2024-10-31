const Booking = require('../models/booking');
const TimeSlot = require('../models/timeSlot');
const Court = require('../models/court');

const createBooking = async (req, res) => {
  const { client, court, timeSlot, date } = req.body;

  try {
    const timeSlotRecord = await TimeSlot.getTimeSlotByName(timeSlot);
    if (!timeSlotRecord) {
      return res.status(400).json({ message: 'Invalid time slot' });
    }
    const courtRecord = await Court.getCourtById(court);
    if (!courtRecord) {
      return res.status(400).json({ message: 'Invalid court' });
    }

    const newBooking = await Booking.createBooking(
      client,
      court,
      timeSlotRecord.id,
      date,
      courtRecord.cost_per_hour
    );
    res.json(newBooking);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const payBooking = async (req, res) => {
  const { id } = req.params;

  try {
    await Booking.payBooking(id);
    res.json({ message: 'Booking paid successfully' });
  } catch (err) {
    console.error('Error paying booking:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const { courtId } = req.params;
    const bookings = await Booking.getAllBookingsWithClientInfo(courtId);
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    await Booking.deleteBooking(id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  deleteBooking,
  payBooking,
};
