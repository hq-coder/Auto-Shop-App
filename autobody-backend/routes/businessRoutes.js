const express = require('express');
const { getAllBusinesses, getBusinessById, updateBusiness, deleteBusiness } = require('../controllers/businessController');
const router = express.Router();

// Routes
router.get('/', getAllBusinesses); // Get all businesses
router.get('/:id', getBusinessById); // Get a business by ID
router.put('/:id', updateBusiness); // Update a business
router.delete('/:id', deleteBusiness); // Delete a business

module.exports = router;
