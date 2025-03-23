import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Added useNavigate
import '../css/ProductDetails.css'; // Import custom CSS for product details
import dishes from '../../services/api.json'; // Import the JSON data directly
import { toast, ToastContainer } from 'react-toastify'; // For toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Toast notification styles

function ProductDetails({ handleAddToCart, handleAddToWishlist }) {
  const { id } = useParams(); // Extract the 'id' parameter from the URL
  const navigate = useNavigate(); // Added for navigation
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(''); // State for the main image
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [relatedProducts, setRelatedProducts] = useState([]); // State for related products
  const [isInStock, setIsInStock] = useState(true); // State for product availability

  useEffect(() => {
    // Find the product directly from the imported `dishes` array
    const productData = dishes.find((item) => item.id === id); // Match product by id

    if (productData) {
      setProduct(productData);
      setMainImage(productData.imageUrl); // Set the main image to the product's image
      setIsInStock(productData.stock > 0); // Check if product is in stock
      // Find related products (for example, products in the same category)
      const related = dishes.filter(
        (item) => item.category === productData.category && item.id !== productData.id
      );
      setRelatedProducts(related.slice(0, 4)); // Show up to 4 related products
    } else {
      setError('Product not found.');
    }
  }, [id]);

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };

  // Handle adding to cart
  const handleAddToCartClick = (productToAdd = product, quantityToAdd = quantity) => {
    if (productToAdd) {
      handleAddToCart({ ...productToAdd, quantity: quantityToAdd });
      toast.success(`${productToAdd.name} (${quantityToAdd}x) added to cart!`, {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Handle adding to wishlist
  const handleAddToWishlistClick = (productToAdd = product) => {
    if (productToAdd) {
      handleAddToWishlist(productToAdd);
      toast.info(`${productToAdd.name} added to wishlist!`, {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Handle sharing product
  const handleShareProduct = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: window.location.href,
        })
        .then(() => toast.success('Product shared successfully!'))
        .catch(() => toast.error('Failed to share product.'));
    } else {
      toast.info('Sharing is not supported in your browser.', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  // Handle clicking on related product
  const handleRelatedProductClick = (relatedProductId) => {
    navigate(`/ProductDetails/${relatedProductId}`); // Navigate to the related product's details page
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="product-details-container">
      <div className="product-images">
        <div className="main-image-container">
          <img
            src={mainImage}
            alt={product.name}
            className="main-image"
            onMouseEnter={(e) => e.currentTarget.classList.add('zoomed')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('zoomed')}
            loading="lazy"
          />
          {product.discount && <span className="discount-badge">{product.discount}% OFF</span>}
        </div>
        <div className="thumbnail-grid">
          {product.thumbnails?.map((thumbnail, index) => (
            <img
              key={index}
              src={thumbnail}
              alt={`Thumbnail ${index + 1}`}
              className={`thumbnail ${mainImage === thumbnail ? 'active' : ''}`}
              onClick={() => setMainImage(thumbnail)}
              loading="lazy"
            />
          ))}
        </div>
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <div className="product-rating">
          <span>Rating: </span>
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`star ${i < product.rating ? 'filled' : ''}`}>
              ★
            </span>
          ))}
        </div>
        <p className="product-description">{product.description}</p>
        <p className="product-price">Price: ${product.price.toFixed(2)}</p>
        {product.discount && (
          <p className="original-price">
            Original Price: <s>${(product.price / (1 - product.discount / 100)).toFixed(2)}</s>
          </p>
        )}
        <div className="quantity-selector">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
          />
        </div>
        <div className="action-buttons">
          <button className="add-to-cart-btn" onClick={handleAddToCartClick} disabled={!isInStock}>
            {isInStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          <button className="wishlist-btn" onClick={handleAddToWishlistClick}>
            Add to Wishlist
          </button>
          <button className="share-btn" onClick={handleShareProduct}>
            Share
          </button>
        </div>
        <div className="product-reviews">
          <h3>Reviews</h3>
          {product.reviews?.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={index} className="review">
                <p className="review-author">{review.author}</p>
                <p className="review-text">{review.text}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
      <div className="related-products">
        <h3>Related Products</h3>
        <div className="related-products-grid">
          {relatedProducts.map((relatedProduct) => (
            <div
              key={relatedProduct.id}
              className="related-product"
              onClick={() => handleRelatedProductClick(relatedProduct.id)}
            >
              <img src={relatedProduct.imageUrl} alt={relatedProduct.name} loading="lazy" />
              <p>{relatedProduct.name}</p>
              <p>${relatedProduct.price.toFixed(2)}</p>
              <div className="related-product-actions">
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation
                    handleAddToCartClick(relatedProduct, 1); // Add to cart with quantity 1
                  }}
                >
                  Add to Cart
                </button>
                <button
                  className="wishlist-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation
                    handleAddToWishlistClick(relatedProduct); // Add to wishlist
                  }}
                >
                  Add to Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer /> {/* Toast notifications container */}
    </div>
  );
}

export default ProductDetails;
