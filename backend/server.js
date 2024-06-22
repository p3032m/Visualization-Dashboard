// server.js
require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Failed to connect to MongoDB', error));

app.use(express.json());
app.use(cors()); // Use cors middleware

const dataRouter = require('./routes/data');
app.use('/data', dataRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
