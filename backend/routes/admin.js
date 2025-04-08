const express = require('express');
const Admin = require('../models/Admin');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const adminLogin=require('../controllers/adminController');

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
router.post('/login',adminLogin);