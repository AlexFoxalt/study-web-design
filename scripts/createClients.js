const pool = require('../db');
require('dotenv').config();

const createClients = async () => {
  const clientsData = [
    ['Alexey', 'Chernyshov', '(206) 342-8631', 'ВН1991ВН', '1991-01-01'],
    ['Vladislav', 'Babenko', '(717) 550-1675', 'ВН1992ВН', '1992-02-02'],
    ['Vladislav', 'Netkov', '(248) 762-0356', 'NETKOV', '1993-03-03'],
    ['Vladislava', 'Lupan', '(253) 644-2182', 'ВН1994ВН', '1994-04-04'],
    ['Iurii', 'Levin', '(212) 658-3916', 'ВН1995ВН', '1995-05-05'],
  ];
  try {
    for (const client of clientsData) {
      await pool.query(
        'INSERT INTO clients (first_name, last_name, phone_number, car_number, date_of_birth) VALUES ($1, $2, $3, $4, $5)',
        [client[0], client[1], client[2], client[3], client[4]]
      );
    }
    console.log('Clients created successfully');
  } catch (err) {
    console.error('Error creating clients:', err);
  }
};

createClients();
