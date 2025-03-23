import React from 'react';
import restaurants from '../../services/restaurants.json';
import '../css/RestaurantList.css';

const RestaurantList = ({ theme }) => {
  return (
    <div className={`restaurant-list ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <h1>Restaurants Near You</h1>
      <div className="restaurant-grid">
        {restaurants.map((restaurant, index) => (
          <div key={index} className="restaurant-card animated-card">
            <div className="restaurant-image">
              <img src={restaurant.image} alt={restaurant.name} />
            </div>
            <div className="restaurant-details">
              <h2>{restaurant.discount}</h2>
              <h3>{restaurant.name}</h3>
              <p className="cuisine">{restaurant.cuisine}</p>
              <p className="distance-location">
                <span className="rating">✰ {restaurant.rating}</span>
                <span className="distance">✿ {restaurant.distance}</span>
                <span className="location">{restaurant.location}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
