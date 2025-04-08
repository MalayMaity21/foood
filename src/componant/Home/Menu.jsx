import React from 'react';
import { useNavigate } from 'react-router-dom';
import dishes from '../../services/api.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Menu.css';

function Menu() {
  const navigate = useNavigate();

  if (!dishes || dishes.length === 0) {
    return (
      <div className="menu-container">
        <div className="menu-header">
          <h1 className="menu-title">Our Delicious Menu</h1>
          <p className="menu-subtitle">Explore our wide variety of dishes</p>
        </div>
        <div className="alert alert-warning">No dishes available at the moment.</div>
      </div>
    );
  }

  // Group dishes by category with proper keys
  const categories = dishes.reduce((acc, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = [];
    }
    acc[dish.category].push(dish);
    return acc;
  }, {});

  const handleDishClick = (dishId) => {
    window.location.href = `http://localhost:5173/productDetails/${dishId}`;
  };

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1 className="menu-title">Our Delicious Menu</h1>
        <p className="menu-subtitle">Explore our wide variety of dishes</p>
      </div>

      {Object.entries(categories).map(([category, items]) => (
        <div key={`category-${category}`} className="menu-category">
          <h2 className="category-title">{category}</h2>
          <div className="category-items">
            {items.map((dish) => (
              <div 
                key={`dish-${dish.id}`} 
                className="menu-item"
                onClick={() => handleDishClick(dish.id)}
              >
                <div className="item-image-container">
                  <img 
                    src={dish.imageUrl} 
                    alt={dish.name} 
                    className="item-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                </div>
                <div className="item-details">
                  <h3 className="item-name">{dish.name}</h3>
                  <p className="item-description">{dish.description}</p>
                  <div className="item-price-container">
                    <span className="item-price">${dish.price.toFixed(2)}</span>
                    {dish.isVegetarian && (
                      <span className="vegetarian-badge">Vegetarian</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Menu;