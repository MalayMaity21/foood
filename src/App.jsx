import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Added Navigate
import NavBar from "./componant/Home/NavBar.jsx";
import Home from "./componant/Home/Home.jsx";
import Offer from "./componant/Home/Offer.jsx";
import './App.css';
import Category from './componant/Home/Category.jsx';
import CartPage from './componant/Home/CartPage.jsx';
import AdminLogin from './componant/Admin/AdminLogin.jsx';
import AdminDashboard from './componant/Admin/AdminDashboard.jsx'; // Import AdminDashboard
import UserLogin from './componant/User/UserLogin.jsx';
import UserRegister from './componant/User/UserRegister.jsx';
import RestaurantLogin from './componant/Restaurant/RestaurantLogin.jsx';
import RestaurantPage from './componant/Restaurant/RestaurantPage.jsx';
import ProductDetails from './componant/Product/ProductDetails.jsx';
import RestaurantList from './componant/Restaurant/RestaurantList.jsx';
import ProfileDashboard from './componant/User/ProfileDashboard.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx'; // Import AuthProvider and useAuth

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin-login" />;
};

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
    <AuthProvider> {/* Wrap the app with AuthProvider */}
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
              <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard theme={theme} /></PrivateRoute>} /> {/* Secured AdminDashboard */}
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
    </AuthProvider>
  );
}

export default App;