import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/RestaurantLogin.css'; // Import custom CSS

function RestaurantLogin({ theme }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!email || !password || !restaurantName) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true); // Show loading spinner
    setError(''); // Clear previous errors

    // Simulate login logic (replace with actual API call)
    setTimeout(() => {
      if (email === 'restaurant@example.com' && password === '123' && restaurantName === 'MyRestaurant') {
        navigate('/restaurant_page'); // Redirect to restaurant page after successful login
      } else {
        setError('Invalid email, password, or restaurant name. Please try again.');
      }
      setIsLoading(false); // Hide loading spinner
    }, 1000); // Simulate a 1-second delay for API call
  };

  return (
    <div className={`restaurant-login-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <div className="restaurant-login-card">
        <h2 className="restaurant-login-title">Restaurant Login</h2>
        {error && <div className="restaurant-login-error animate-fade-in">{error}</div>}
        <form onSubmit={handleSubmit} className="restaurant-login-form">
          <div className="form-group animate-slide-in">
            <label htmlFor="restaurantName" className="form-label">
              Restaurant Name
            </label>
            <input
              type="text"
              className="form-control"
              id="restaurantName"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              required
            />
          </div>
          <div className="form-group animate-slide-in">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group animate-slide-in">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="restaurant-login-button animate-fade-in" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="restaurant-login-register-text animate-fade-in">
          Don't have an account?{' '}
          <a href="tel:+91 6296740204" className="call-us-link">Call Us</a>
        </p>
        <p className="forgot-password-text animate-fade-in">
          <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
        </p>
      </div>
    </div>
  );
}

export default RestaurantLogin;