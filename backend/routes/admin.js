const express = require('express');
const Admin = require('../models/Admin');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

// Sample admin credentials (for testing purposes)
const sampleAdmin = {
  username: 'admin',
  password: 'admin123', // Plain text password for testing
};

// Middleware to ensure sample admin exists in the database
const ensureSampleAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ username: sampleAdmin.username });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(sampleAdmin.password, 10); // Hash the password
      await Admin.create({ username: sampleAdmin.username, password: hashedPassword });
      console.log('Sample admin created successfully.');
    }
  } catch (error) {
    console.error('Error ensuring sample admin:', error.message);
  }
};

// Ensure the sample admin exists when the server starts
ensureSampleAdmin();

// Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Find the admin by username
    const admin = await Admin.findOne({ username });

    if (!admin) {
      console.error('Admin not found:', username);
      return res.status(401).json({ message: 'Invalid username or password.' }); // Use 401 for unauthorized
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      console.error('Password mismatch for admin:', username);
      return res.status(401).json({ message: 'Invalid username or password.' }); // Use 401 for unauthorized
    }

    // Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables.');
      return res.status(500).json({ message: 'Server configuration error. Please contact support.' });
    }

    // Generate a secure token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during admin login:', error.message); // Log error message
    res.status(500).json({ message: 'An internal server error occurred. Please try again later.' });
  }
});

module.exports = router;