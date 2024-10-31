const express = require('express');
const path = require('path');
const pool = require('./db');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static('public'));

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
