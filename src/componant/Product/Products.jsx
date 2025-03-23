import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/Products.css'; // Import custom CSS for styling

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch all products from the backend API
        axios.get('http://localhost:8080/products')
            .then(response => {
                setProducts(response.data); // Update state with fetched products
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    return (
        <div className="products-container">
            <h1>All Products</h1>
            <div className="products-grid">
                {products.map(product => (
                    <Link to={`/products/${product.id}`} key={product.id} className="product-card-link">
                        <div className="product-card">
                            <img src={product.imageUrl} alt={product.name} className="product-card-image" />
                            <div className="product-card-content">
                                <h3>{product.name}</h3>
                                <p>${product.price.toFixed(2)}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Products;