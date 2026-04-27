import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="product-card skeleton-card">
      <div className="product-image-container">
        <div className="skeleton-image"></div>
      </div>
      <div className="card-content">
        <div className="skeleton-category"></div>
        <div className="skeleton-title"></div>
        <div className="skeleton-description"></div>
        <div className="skeleton-rating"></div>
        <div className="skeleton-specs"></div>
        <div className="skeleton-price"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );
};

const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
