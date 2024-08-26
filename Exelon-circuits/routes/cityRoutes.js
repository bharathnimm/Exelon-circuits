const express = require('express');
const City = require('../models/city');
const router = express.Router();

// Add a new city
router.post('/cities', async (req, res) => {
  try {
    const city = new City(req.body);
    await city.save();
    res.status(201).json({
      message: 'City added successfully',
      city
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an existing city
router.put('/cities/:id', async (req, res) => {
  try {
    const updatedCity = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCity) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json({
      message: 'City updated successfully',
      updatedCity
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a city
router.delete('/cities/:id', async (req, res) => {
  try {
    const deletedCity = await City.findByIdAndDelete(req.params.id);
    if (!deletedCity) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json({
      message: 'City deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get cities with filtering, sorting, pagination, and projection
router.get('/cities', async (req, res) => {
  try {
    const { page = 1, limit = 10, filter, sort, search, projection } = req.query;

    let query = {};
    if (filter) {
      query = JSON.parse(filter);
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    let cities = City.find(query);

    if (sort) {
      const sortBy = JSON.parse(sort);
      cities = cities.sort(sortBy);
    }

    if (projection) {
      const fields = JSON.parse(projection);
      cities = cities.select(fields);
    }

    const totalCities = await City.countDocuments(query);
    cities = await cities.skip((page - 1) * limit).limit(Number(limit));

    res.json({
      total: totalCities,
      page: Number(page),
      limit: Number(limit),
      cities
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;