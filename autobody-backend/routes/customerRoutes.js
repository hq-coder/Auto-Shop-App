const express = require('express');
const { getAllCustomers, getCustomerById, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const router = express.Router();

// Routes
router.get('/', getAllCustomers); // Get all customers
router.get('/:id', getCustomerById); // Get a customer by ID
router.put('/:id', updateCustomer); // Update a customer
router.delete('/:id', deleteCustomer); // Delete a customer

module.exports = router;
