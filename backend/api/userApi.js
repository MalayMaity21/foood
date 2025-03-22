const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import the User model

const router = express.Router();

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.user = decoded; // Ensure the decoded token contains the user ID
    next();
  });
};

// Fetch User Profile Data by user ID
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the token contains the user ID

    if (!userId) {
      return res.status(400).json({ message: 'Invalid token: User ID is missing.' });
    }

    // Fetch user data from MongoDB
    const user = await User.findById(userId).select('-password'); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      userName: user.userName,
      email: user.email,
      mobNum: user.mobNum,
      address: user.address,
      dob: user.dob,
    });
  } catch (err) {
    console.error('Error fetching profile data:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// Fetch User Profile Data by username
router.get('/profile/:username', authenticateToken, async (req, res) => {
  try {
    const { username } = req.params;

    // Fetch user data from MongoDB by username
    const user = await User.findOne({ userName: username }).select('-password'); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      userName: user.userName,
      email: user.email,
      mobNum: user.mobNum,
      address: user.address,
      dob: user.dob,
    });
  } catch (err) {
    console.error('Error fetching profile data:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// Fetch User Profile Data by _id
router.get('/profile/id/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch user data from MongoDB by _id
    const user = await User.findById(id).select('-password'); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      userName: user.userName,
      email: user.email,
      mobNum: user.mobNum,
      address: user.address,
      dob: user.dob,
    });
  } catch (err) {
    console.error('Error fetching profile data:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// Update User Profile Data by username
router.put('/profile/:username', authenticateToken, async (req, res) => {
  try {
    const { username } = req.params;
    const { userName, email, mobNum, address, dob } = req.body;

    // Find user by username and update their profile
    const user = await User.findOneAndUpdate(
      { userName: username },
      { userName, email, mobNum, address, dob },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

module.exports = router;
