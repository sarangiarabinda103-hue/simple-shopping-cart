import React from 'react';
import OptimizedImage from './OptimizedImage';
import LoadingSpinner from './LoadingSpinner';

const SearchResults = ({ 
  results, 
  loading, 
  error, 
  hasSearched, 
  query, 
  onAddToCart,
  onClearSearch 
}) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }
    
    return stars;
  };

  if (!hasSearched) {
    return null;
  }

  if (loading) {
    return (
      <div className="search-results-container">
        <div className="search-loading-state">
          <LoadingSpinner size="small" message="Searching..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results-container">
        <div className="search-error-state">
          <p className="search-error-message">Search failed: {error}</p>
          <button className="search-retry-button" onClick={onClearSearch}>
            Clear Search
          </button>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="search-results-container">
        <div className="search-empty-state">
          <div className="search-empty-icon">🔍</div>
          <h3>No results found</h3>
          <p>Try searching for "{query}" with different keywords</p>
          <button className="search-clear-button" onClick={onClearSearch}>
            Clear Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-results-header">
        <h3>Search Results ({results.length})</h3>
        <button className="search-clear-button" onClick={onClearSearch}>
          Clear
        </button>
      </div>
      
      <div className="search-results-grid">
        {results.map(product => (
          <div key={product.id} className="search-result-card">
            <div className="search-result-image">
              <OptimizedImage 
                src={product.image} 
                alt={product.name}
                className="search-result-img"
              />
              {product.badge && (
                <span className="search-result-badge">{product.badge}</span>
              )}
              {!product.inStock && (
                <div className="search-result-out-of-stock">
                  <span>Out of Stock</span>
                </div>
              )}
            </div>
            
            <div className="search-result-content">
              <div className="search-result-category">{product.category}</div>
              <h4 className="search-result-name">{product.name}</h4>
              <p className="search-result-description">{product.description}</p>
              
              <div className="search-result-rating">
                <div className="search-stars">
                  {renderStars(product.rating)}
                </div>
                <span className="search-rating-text">{product.rating}</span>
                <span className="search-reviews-count">({product.reviews} reviews)</span>
              </div>
              
              <div className="search-result-price-section">
                <div className="search-price-container">
                  <span className="search-current-price">${product.price}</span>
                  {product.originalPrice && (
                    <span className="search-original-price">${product.originalPrice}</span>
                  )}
                </div>
                {product.originalPrice && (
                  <div className="search-discount-badge">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>
              
              <button 
                className={`search-add-to-cart-button ${!product.inStock ? 'disabled' : ''}`}
                onClick={() => onAddToCart(product)}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
