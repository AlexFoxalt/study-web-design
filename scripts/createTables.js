const pool = require('../db');
require('dotenv').config();

async function createTables(items) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    for (const item of items) {
      await client.query(item);
    }
    await client.query('COMMIT');
    console.log('Tables created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.log('Error creating time slots:', error);
  } finally {
    client.release();
  }
}
const queries = [
  `create table if not exists files
(
    id       serial
        primary key,
    name     varchar not null
        unique,
    pspdf_id varchar not null
        unique
);`,

  `alter table files
    owner to postgres;`,

  `create table if not exists clients
(
    id            serial
        primary key,
    first_name    varchar(50) not null,
    last_name     varchar(50) not null,
    phone_number  varchar(15) not null
        constraint clients_phonenumber_key
            unique,
    car_number    varchar(15)
        constraint clients_carnumber_key
            unique,
    date_of_birth date        not null,
    date_created  timestamp default CURRENT_TIMESTAMP
);`,

  `alter table clients
    owner to postgres;`,

  `create table if not exists courts
(
    id            serial
        primary key,
    name          varchar(50)    not null
        unique,
    surface_type  varchar(20)    not null
        constraint courts_surfacetype_check
            check ((courts.surface_type)::text = ANY
                   ((ARRAY ['grass'::character varying, 'hard'::character varying, 'clay'::character varying])::text[])),
    cost_per_hour numeric(10, 2) not null
);`,

  `alter table courts
    owner to postgres;`,

  `create table if not exists administrators
(
    id       serial
        primary key,
    username varchar(50)  not null
        unique,
    password varchar(255) not null
);`,

  `alter table administrators
    owner to postgres;`,

  `create table if not exists time_slots
(
    id   serial
        primary key,
    name varchar(50) not null
);`,

  `alter table time_slots
    owner to postgres;`,

  `create table if not exists bookings
(
    id            serial
        primary key,
    client_id     integer               not null
        constraint bookings_clientid_fkey
            references clients,
    court_id      integer               not null
        constraint bookings_courtid_fkey
            references courts,
    paid          boolean default false not null,
    amount_to_pay numeric(10, 2)        not null,
    time_slot_id  integer               not null
        references time_slots,
    date          date                  not null
);`,

  `alter table bookings
    owner to postgres;`,
];

createTables(queries);
