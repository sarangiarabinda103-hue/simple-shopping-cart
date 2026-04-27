import { useCart } from "../hooks/useCart";
import useCategoryProducts from "../hooks/useCategoryProducts";
import OptimizedImage from "../components/OptimizedImage";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductGridSkeleton from "../components/ProductCardSkeleton";
import CategoryNavigation from "../components/CategoryNavigation";
import SearchResults from "../components/SearchResults";
import { useState } from 'react';

export default function Home({ searchState }) {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  
  const { products, loading, error, categoryInfo, refetch } = useCategoryProducts(selectedCategory, selectedSubcategory);
  
  // Use search results from App component
  const { results: searchResults, loading: searchLoading, error: searchError, hasSearched, query: searchQuery } = searchState || {};

  const handleCategoryChange = (categoryId, subcategory = null) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategory);
    // Clear search when changing category
  };

  const handleClearSearch = () => {
    // Search clearing is handled by the SearchBar component
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

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

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="product-container">
        <h1 className="product-title">Featured Products</h1>
        <ProductGridSkeleton count={8} />
      </div>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <div className="product-container">
        <h1 className="product-title">Featured Products</h1>
        <div className="error-container">
          <h2 className="error-title">Oops! Something went wrong</h2>
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={refetch}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-layout">
      <div className="home-sidebar">
        <CategoryNavigation 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>
      
      <div className="home-main">
        <div className="product-container">
          <div className="category-header-info">
            <h1 className="product-title">
              {categoryInfo ? (
                <>
                  {categoryInfo.icon} {categoryInfo.name}
                  {selectedSubcategory && (
                    <span className="subcategory-indicator"> / {selectedSubcategory}</span>
                  )}
                </>
              ) : (
                'All Products'
              )}
            </h1>
            {categoryInfo && (
              <p className="category-description">{categoryInfo.description}</p>
            )}
          </div>
          
          {loading && products.length === 0 && (
            <ProductGridSkeleton count={8} />
          )}
          
          {error && products.length === 0 && (
            <div className="error-container">
              <h2 className="error-title">Oops! Something went wrong</h2>
              <p className="error-message">{error}</p>
              <button className="retry-button" onClick={refetch}>
                Try Again
              </button>
            </div>
          )}
          
          {loading && products.length > 0 && (
            <div className="loading-container" style={{ minHeight: '100px' }}>
              <LoadingSpinner size="small" message="Loading more products..." />
            </div>
          )}
          
          {products.length > 0 && (
            <div className="product-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    <OptimizedImage 
                      src={product.image} 
                      alt={product.name}
                      className="product-image"
                    />
                    {product.badge && (
                      <span className="product-badge">{product.badge}</span>
                    )}
                    {!product.inStock && (
                      <div className="out-of-stock-overlay">
                        <span>Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className="card-content">
                    <div className="product-category">{product.category}</div>
                    <h5 className="product-name">{product.name}</h5>
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-rating">
                      <div className="stars">
                        {renderStars(product.rating)}
                      </div>
                      <span className="rating-text">{product.rating}</span>
                      <span className="reviews-count">({product.reviews} reviews)</span>
                    </div>
                    
                    <div className="product-specs">
                      {product.specs && product.specs.slice(0, 2).map((spec, index) => (
                        <span key={index} className="spec-tag">{spec}</span>
                      ))}
                    </div>
                    
                    <div className="price-section">
                      <div className="price-container">
                        <span className="current-price">${product.price}</span>
                        {product.originalPrice && (
                          <span className="original-price">${product.originalPrice}</span>
                        )}
                      </div>
                      {product.originalPrice && (
                        <div className="discount-badge">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </div>
                      )}
                    </div>
                    
                    <button 
                      className={`add-to-cart-button ${!product.inStock ? 'disabled' : ''}`}
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {products.length === 0 && !loading && !error && (
            <div className="empty-category">
              <h3>No products found</h3>
              <p>Try selecting a different category or check back later.</p>
            </div>
          )}
          
          {error && products.length > 0 && (
            <div className="error-container" style={{ padding: '1rem' }}>
              <p className="error-message" style={{ margin: 0 }}>{error}</p>
            </div>
          )}
        </div>
        
        {/* Search Results Overlay */}
        {hasSearched && (
          <SearchResults
            results={searchResults}
            loading={searchLoading}
            error={searchError}
            hasSearched={hasSearched}
            query={searchQuery}
            onAddToCart={handleAddToCart}
            onClearSearch={handleClearSearch}
          />
        )}
      </div>
    </div>
  );
}