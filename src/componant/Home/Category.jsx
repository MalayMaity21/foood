import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import '../css/Category.css'; // Import the CSS file

const Category = ({ theme }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate(); // For navigation

  // Mock data for categories (replace with API fetch if needed)
  useEffect(() => {
    const mockCategories = [
      { id: 1, name: 'Biryani', imageUrl: 'https://cdn.gintaa.com/food-listings/category/biryani.png' },
      { id: 2, name: 'Momo', imageUrl: 'https://cdn.gintaa.com/food-listings/category/momo.png' },
      { id: 3, name: 'South Indian', imageUrl: 'https://cdn.gintaa.com/food-listings/category/sothindian.png' },
      { id: 4, name: 'Starters', imageUrl: 'https://cdn.gintaa.com/food-listings/category/starter.png' },
      { id: 5, name: 'Main Course', imageUrl: 'https://cdn.gintaa.com/food-listings/category/main-course.png' },
      { id: 6, name: 'Appetizers', imageUrl: 'https://cdn.gintaa.com/food-listings/category/Appetizers.png' },
      { id: 7, name: 'Mughlai', imageUrl: 'https://cdn.gintaa.com/food-listings/category/mughlai.png' },
      { id: 8, name: 'North Indian', imageUrl: 'https://cdn.gintaa.com/food-listings/category/northindian.png' },
    ];
    setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false); // Simulate loading delay
    }, 1000); // Simulate API delay
  }, []);

  // Handle category click
  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`); // Navigate to category page
  };

  return (
    <div className={`category-wrapper ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <div className="category-container">
        <h2>What is on your mind?</h2>
        {loading ? (
          <p>Loading categories...</p> // Loading state
        ) : (
          <div className="category-list">
            <div className="category-scroll">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="category-item"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <img src={category.imageUrl} alt={category.name} className="category-image" />
                  <h3>{category.name}</h3>
                </div>
              ))}
              {/* Duplicate categories for seamless scrolling */}
              {categories.map((category) => (
                <div
                  key={`${category.id}-copy`}
                  className="category-item"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <img src={category.imageUrl} alt={category.name} className="category-image" />
                  <h3>{category.name}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
