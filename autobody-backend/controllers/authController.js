const bcrypt = require('bcrypt');
const pool = require('../config/db');
// If needed, ensure findUserByEmail matches your updated schema
const { findUserByEmail } = require('../models/userModel');

// Register User
exports.registerUser = async (req, res) => {
  const { email, password, role, name, phone, address, business_type } = req.body;

  try {
    // Check if email exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into users table
    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
      [email, hashedPassword, role]
    );
    const userId = userResult.rows[0].id;

    // Insert into customers or business table based on role
    if (role === 'customer') {
      await pool.query(
        'INSERT INTO customer (user_id, name, phone, address) VALUES ($1, $2, $3, $4)',
        [userId, name, phone, address]
      );
    } else if (role === 'business') {
      await pool.query(
        'INSERT INTO business (user_id, name, phone, address, business_type) VALUES ($1, $2, $3, $4, $5)',
        [userId, name, phone, address, business_type]
      );
    }

    // Respond with success
    res.status(201).json({
      message: 'Registration successful',
      user: { id: userId, email, role },
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT id, email, password_hash, role FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};