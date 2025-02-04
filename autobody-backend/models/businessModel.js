const pool = require('../config/db');

// Get all businesses
exports.getAllBusinesses = async () => {
  const result = await pool.query('SELECT * FROM businesses');
  return result.rows;
};

// Get business by ID
exports.getBusinessById = async (id) => {
  const result = await pool.query('SELECT * FROM businesses WHERE id = $1', [id]);
  return result.rows[0];
};

// Update business
exports.updateBusiness = async (id, name, phone, address, business_type) => {
  const result = await pool.query(
    'UPDATE businesses SET name = $1, phone = $2, address = $3, business_type = $4 WHERE id = $5 RETURNING *',
    [name, phone, address, business_type, id]
  );
  return result.rows[0];
};

// Delete business
exports.deleteBusiness = async (id) => {
  const result = await pool.query('DELETE FROM businesses WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
