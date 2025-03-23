const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs"); // Add bcrypt for password hashing
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/orders");

dotenv.config();

// Sample Users
const users = [
  {
    userName: "Alice",
    email: "alice@example.com",
    password: "123456", // Plain text password
    address: "New York",
    mobNum: "1234567890",
  },
  {
    userName: "Bob",
    email: "bob@example.com",
    password: "123456", // Plain text password
    address: "Los Angeles",
    mobNum: "1234567891",
  },
  // Add more users as needed
];

// Sample Food Data
const foodData = [
  {
    name: "Kung Pao Chicken",
    imageUrl: "https://example.com/image.jpg",
    price: 12.99,
    description: "A spicy stir-fry dish.",
  },
  // Add more food items as needed
];

// Hash passwords before inserting users
const hashPasswords = async (users) => {
  return Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10), // Hash the password
    }))
  );
};

// Insert data into the database
const insertData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    const hashedUsers = await hashPasswords(users); // Hash passwords
    const createdUsers = await User.insertMany(hashedUsers);
    const createdProducts = await Product.insertMany(foodData);

    console.log("Users and Products inserted successfully");

    // Create sample orders
    const orders = [];
    for (let i = 0; i < 10; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      orders.push({
        user: randomUser._id,
        items: [
          {
            product: randomProduct._id,
            quantity: Math.ceil(Math.random() * 3),
          },
        ],
        totalAmount: randomProduct.price * Math.ceil(Math.random() * 3),
        isPaid: Math.random() > 0.5, // Randomly mark some orders as paid
      });
    }
    await Order.insertMany(orders);

    console.log("Orders inserted successfully");
  } catch (error) {
    console.error("Error inserting data: ", error.message);
  } finally {
    mongoose.connection.close(); // Close the connection
  }
};

module.exports = insertData;