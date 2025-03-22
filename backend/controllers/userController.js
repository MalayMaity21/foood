const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Function to get all users
const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Function to register a user
const signupUser = async (req, res) => {
  try {
    const { userName, email, mobNum, password, address, dob } = req.body;

    // Validate required fields
    if (!userName || !email || !mobNum || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user (without hashing the password)
    const newUser = new User({
      userName,
      email,
      mobNum,
      password, // Store plain text password
      address,
      dob,
    });

    await newUser.save();
    res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    console.error("Error during user registration:", error.message);
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Function to login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password (compare plain text passwords)
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
  }
};

// Function to get a single user by ID
const singleUserById = async (req, res) => {
  try {
    const userId = req.params.id; // Get user ID from request parameters

    // Fetch user by ID from MongoDB
    const user = await User.findById(userId).select('-password'); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      userName: user.userName,
      email: user.email,
      mobNum: user.mobNum,
      address: user.address,
      dob: user.dob,
    });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: "Error fetching user" });
  }
};

// Function to update a user's profile
const updateUserProfile = async (req, res) => {
  try {
    const { userName, email, mobNum, password, address, dob } = req.body;

    // Find the user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    user.userName = userName || user.userName;
    user.email = email || user.email;
    user.mobNum = mobNum || user.mobNum;
    user.address = address || user.address;
    user.dob = dob || user.dob;

    // Update password if provided
    if (password) {
      user.password = password;
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Error updating profile" });
  }
};

module.exports = { signupUser, loginUser, allUsers, singleUserById, updateUserProfile };