const pool = require('../config/db');

// Find user by email
exports.findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0]; // returns the user object if found, otherwise undefined
};

// Create a new user
exports.createUser = async (email, hashedPassword, role) => {
  const result = await pool.query(
    'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
    [email, hashedPassword, role]
  );
  return result.rows[0].id;
};
