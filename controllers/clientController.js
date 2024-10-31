const Client = require('../models/client');

const createClient = async (req, res) => {
  const { firstName, lastName, phoneNumber, carNumber, dateOfBirth } = req.body;

  try {
    const newClient = await Client.createClient(
      firstName,
      lastName,
      phoneNumber,
      carNumber,
      dateOfBirth
    );
    res.json(newClient);
  } catch (err) {
    if (err.code === '23505') {
      // Unique constraint violation
      res
        .status(400)
        .json({ message: 'Phone number or car number already exists' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.getAllClients();
    res.json(clients);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    await Client.deleteClient(id);
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createClient,
  getAllClients,
  deleteClient,
};
