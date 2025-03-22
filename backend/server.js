const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // For password hashing and validation
const User = require('./models/user'); // Import the User model
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.user = user;
    next();
  });
};

// Routes
app.use('/users', userRoutes);

// Fetch User Profile Data by ID
app.get('/api/users/profile/id/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id; // Extract user ID from the URL

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

// Fetch User Profile Data by Email
app.get('/api/users/profile/email/:email', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.params.email; // Extract email from the URL

    // Fetch user data from MongoDB
    const user = await User.findOne({ email: userEmail }).select('-password');
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

// User Login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Validate password (assuming bcrypt is used)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate token with user ID
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user: { id: user._id, userName: user.userName, email: user.email } });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// User Registration
app.post('/api/users/register', async (req, res) => {
  try {
    const { userName, email, password, mobNum, address, dob } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    user = new User({
      userName,
      email,
      password: hashedPassword,
      mobNum,
      address,
      dob,
    });

    // Save the user to the database
    await user.save();

    // Generate token with user ID
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user: { id: user._id, userName: user.userName, email: user.email } });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});