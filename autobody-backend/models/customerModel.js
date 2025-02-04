const pool = require('../config/db');

// Get all customers
exports.getAllCustomers = async () => {
  const result = await pool.query('SELECT * FROM customers');
  return result.rows;
};

// Get customer by ID
exports.getCustomerById = async (id) => {
  const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
  return result.rows[0];
};

// Update customer
exports.updateCustomer = async (id, name, phone, address) => {
  const result = await pool.query(
    'UPDATE customers SET name = $1, phone = $2, address = $3 WHERE id = $4 RETURNING *',
    [name, phone, address, id]
  );
  return result.rows[0];
};

// Delete customer
exports.deleteCustomer = async (id) => {
  const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
