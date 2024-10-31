# Tennis Club CRM

## Description

This project is a web-based application designed to manage client bookings for multiple courts. 
Admin can create, view, and delete bookings, as well as manage client information. 
The application features a dashboard for each court, allowing users to switch between different court schedules.

## Features

- Create, view, and delete client bookings
- Manage client information
- Switch between different court schedules
- Authentication with JWT tokens

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL

## Running the Project

### Without Docker

1. **Clone the repository:**
```sh
git clone https://github.com/yourusername/yourproject.git
cd yourproject
```
2. **Install dependencies:**
```sh
npm install
```
3. **Replace stub .env.example with real one:**
```env
DATABASE_URL=<database-url>
SECRET_KEY=<secret-key-for-jwt>
```
4. **Set up the PostgreSQL database:**

Make sure you have a PostgreSQL server running in advance

5. **(Optional) Create database objects:**
```sh
node scripts/populateDatabase.js
```
6. **Start the application**
```sh
npm start
```

The application will be available at http://localhost:3000.

### With Docker

1. **Clone the repository:**
```sh
git clone https://github.com/yourusername/yourproject.git
cd yourproject
```
2. **Replace stub .env.example with real one**
```env
DATABASE_URL=<database-url>
SECRET_KEY=<secret-key-for-jwt>
```

Don't forget that when using docker database host should be the same as database container name, and port shoud stay default (`5432`)

3. **Build and run docker containers:**
```sh
docker-compose up -d --build
```
4. **(Optional) Create database objects:**
```sh
docker exec -it crm_app sh -c "node scripts/populateDatabase.js"
```

The application will be available at http://localhost:3000.

## Usage
### Login
Navigate to http://localhost:3000/login and log in with your credentials

If you used script for database populating, default credentials are:
```
login: admin
pass: admin
```

### Dashboard
After logging in, you will be redirected to the dashboard where you can:
- View the weekly schedule for each court
- Switch between different court schedules using the court buttons
- Create new bookings by clicking on available time slots
- Delete existing bookings
- Add new clients using the form on the dashboard
- View the list of clients
- Click on a client tile to view detailed information and delete the client if necessary
