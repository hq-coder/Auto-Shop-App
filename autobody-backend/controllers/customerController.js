const pool = require('../config/db');
const { getAllCustomers, getCustomerById, updateCustomer, deleteCustomer } = require('../models/customerModel');



// Get all customers
exports.getAllCustomers = async (req, res) => {
    try {
      const customers = await getAllCustomers();
      res.status(200).json(customers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
// Get a customer by ID
exports.getCustomerById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, phone, address } = req.body;
  try {
    const result = await pool.query(
      'UPDATE customers SET name = $1, phone = $2, address = $3 WHERE id = $4 RETURNING *',
      [name, phone, address, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
