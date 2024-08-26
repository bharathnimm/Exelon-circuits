const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cityRoutes = require('./routes/cityRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/citiesdb', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
app.use('/api', cityRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});