const express = require('express');
const path = require('path');
const router = express.Router();
const authController = require('../controllers/authController');
const courtController = require('../controllers/courtController');
const clientController = require('../controllers/clientController');
const timeSlotController = require('../controllers/timeSlotController');
const bookingController = require('../controllers/bookingController');
const verifyToken = require('../middleware/authMiddleware');

// Not protected routes
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});
router.post('/auth/login', authController.login);
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/dashboard.html'));
});

router.use(verifyToken);

// Protected routes
router.get('/clients', clientController.getAllClients);
router.post('/clients', clientController.createClient);
router.delete('/clients/:id', clientController.deleteClient);

router.get('/courts', courtController.getAllCourts);
router.post('/courts', courtController.createCourt);

router.get('/time-slots', timeSlotController.getAllTimeSlots);

router.post('/bookings', bookingController.createBooking);
router.get('/bookings/:courtId', bookingController.getAllBookings);
router.post('/bookings/pay/:id', bookingController.payBooking);
router.delete('/bookings/:id', bookingController.deleteBooking);

module.exports = router;
