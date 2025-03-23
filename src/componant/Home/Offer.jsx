import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/Offer.css'; // Import the updated CSS file
import offerData from '../../services/offer.json'; // Import the JSON data

const Offer = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulating an API call
    const fetchOffers = async () => {
      try {
        // Simulate a delay for the API call
        setTimeout(() => {
          setOffers(offerData); // Use the imported JSON data
          setLoading(false);
        }, 1500); // Simulate a 1.5-second delay
      } catch (err) {
        setError(err.message || 'Failed to load offers');
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  if (loading) {
    return (
      <div className="offer-skeleton">
        <div className="skeleton-content"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="offer-error">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  if (!offers.length) return null;

  return (
    <div className="offer-slider-container">
      <Slider {...sliderSettings}>
        {offers.map((offer, index) => (
          <div
            key={index}
            className="offer-container"
            style={{
              '--offer-primary': offer.colors?.primary || '#ff4757',
              '--offer-secondary': offer.colors?.secondary || '#ff6b81',
              '--offer-accent': offer.colors?.accent || '#2ed573',
            }}
          >
            <div className="offer-content">
              <img
                src={offer.ctaLink}
                alt={offer.title}
                className="offer-image"
              />
              <div className="static-color-box">
                <h2 className="offer-title">{offer.title}</h2>
              </div>
              <p className="offer-description">{offer.description}</p>
              <button
                className="offer-button"
                onClick={() => window.location.href = offer.ctaLink}
              >
                {offer.ctaText}
                {offer.discountPercentage && (
                  <span className="discount-badge">
                    {offer.discountPercentage}% OFF
                  </span>
                )}
              </button>
            </div>
            <div className="offer-marquee">
              {Array(4).fill(offer.marqueeText).join(' • ')}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Offer;
