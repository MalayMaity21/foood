const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Order = require('./models/orders');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend URL
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
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
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
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
    const userEmail = req.params.email;
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
app.post('/api/users/login', [
  body('email').isEmail().withMessage('Invalid email address.'),
  body('password').notEmpty().withMessage('Password is required.'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user: { id: user._id, userName: user.userName, email: user.email } });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// Admin Login
app.post('/api/admin/login', [
  body('username').notEmpty().withMessage('Username is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;

    // Validate admin credentials
    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    // Generate token for admin
    const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, admin: { username } });
  } catch (err) {
    console.error('Error during admin login:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// User Registration
app.post('/api/users/register', [
  body('userName').notEmpty().withMessage('Username is required.'),
  body('email').isEmail().withMessage('Invalid email address.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userName, email, password, mobNum, address, dob } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      userName,
      email,
      password: hashedPassword,
      mobNum,
      address,
      dob,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, userName: user.userName, email: user.email } });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// Fetch all orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// Fetch all menu items
app.get('/api/menu', authenticateToken, async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// Fetch all promotions
app.get('/api/promotions', authenticateToken, async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.status(200).json(promotions);
  } catch (err) {
    console.error('Error fetching promotions:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// Fetch all restaurants
app.get('/api/restaurants', authenticateToken, async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (err) {
    console.error('Error fetching restaurants:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// Add a new restaurant
app.post('/api/restaurants', authenticateToken, async (req, res) => {
  try {
    const { name, location } = req.body;
    const restaurant = new Restaurant({ name, location });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    console.error('Error adding restaurant:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// Update a restaurant
app.put('/api/restaurants/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;
    const restaurant = await Restaurant.findByIdAndUpdate(id, { name, location }, { new: true });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found.' });
    }
    res.status(200).json(restaurant);
  } catch (err) {
    console.error('Error updating restaurant:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// Deactivate a restaurant
app.patch('/api/restaurants/:id/deactivate', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, { active: false }, { new: true });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found.' });
    }
    res.status(200).json(restaurant);
  } catch (err) {
    console.error('Error deactivating restaurant:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// Fetch all users
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'An internal server error occurred.' });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});