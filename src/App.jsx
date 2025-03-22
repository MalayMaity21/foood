import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from "./componant/NavBar";
import Home from "./componant/Home";
import Offer from "./componant/Offer";
import './App.css';
import Category from './componant/Category';
import CartPage from './componant/CartPage';
import AdminLogin from './componant/AdminLogin';
import UserLogin from './componant/UserLogin';
import UserRegister from './componant/UserRegister';
import RestaurantLogin from './componant/RestaurantLogin';
import RestaurantPage from './componant/RestaurantPage';
import ProductDetails from './componant/ProductDetails';
import RestaurantList from './componant/RestaurantList';
import ProfileDashboard from './componant/ProfileDashboard';
import { UserProvider } from './context/UserContext.jsx';

function App() {
  const [theme, setTheme] = useState('light'); // State for theme
  const [cart, setCart] = useState([]); // State for cart items

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Apply theme to the entire app
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Add item to cart
  const handleAddToCart = (dish) => {
    if (!cart.some((item) => item.id === dish.id)) { // Prevent duplicates
      setCart([...cart, dish]);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    alert('Thank you for your purchase!');
    setCart([]); // Clear the cart
  };

  return (
    <UserProvider>
      <Router>
        <div className={`app ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
          <header>
            <NavBar isDarkMode={theme === 'dark'} toggleTheme={toggleTheme} cart={cart} />
          </header>

          <Routes>
            <Route
              path="/"
              element={
                <>
                  <section aria-label="Special Offer">
                    <Offer theme={theme} />
                  </section>

                  <section aria-label="Food Categories">
                    <Category theme={theme} />
                  </section>

                  <main>
                    <RestaurantList theme={theme} />
                    <Home handleAddToCart={handleAddToCart} theme={theme} />
                  </main>
                </>
              }
            />
            <Route path="/admin-login" element={<AdminLogin theme={theme} />} />
            <Route path="/cart" element={<CartPage cart={cart} handleCheckout={handleCheckout} theme={theme} />} />
            <Route path="/user-login" element={<UserLogin theme={theme} />} />
            <Route path="/user-register" element={<UserRegister theme={theme} />} />
            <Route path="/restaurant-login" element={<RestaurantLogin theme={theme} />} />
            <Route path="/restaurant_page" element={<RestaurantPage theme={theme} />} />
            <Route path="/productDetails/:id" element={<ProductDetails theme={theme} />} />
            <Route path="/profile/username/:userName" element={<ProfileDashboard theme={theme} />} />
          </Routes>

          <footer className={`footer ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
            <div className="footer-content">
              <div className="footer-section">
                <h3>Quick Links</h3>
                <ul>
                  <li><a href="/">Home</a></li>
                  <li><a href="/restaurants">Restaurants</a></li>
                  <li><a href="/menu">Menu</a></li>
                  <li><a href="/about">About Us</a></li>
                  <li><a href="/contact">Contact</a></li>
                </ul>
              </div>

              <div className="footer-section">
                <h3>Contact Us</h3>
                <p>Barasat, Kolkata</p>
                <p>Kolkata, 700124</p>
                <p>Email: info@FoodieExpress.com</p>
              </div>

              <div className="footer-section">
                <h3>Follow Us</h3>
                <div className="social-links">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                </div>
              </div>

              <div className="footer-section">
                <h3>Subscribe to Our Newsletter</h3>
                <form className="newsletter-form" onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you for subscribing!');
                }}>
                  <input type="email" placeholder="Enter your email" required />
                  <button type="submit">Subscribe</button>
                </form>
              </div>
            </div>

            <div className="footer-bottom">
              <p>© 2025 FoodieExpress. All rights reserved. Created By Milan & Malay</p>
            </div>
          </footer>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;