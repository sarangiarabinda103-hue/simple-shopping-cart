import React, { useState } from 'react';
import { categories } from '../data/categories';

const CategoryNavigation = ({ selectedCategory, onCategoryChange, showAll = true }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const handleCategoryClick = (categoryId) => {
    if (categoryId === expandedCategory) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
    onCategoryChange(categoryId);
  };

  const handleSubcategoryClick = (categoryId, subcategory) => {
    onCategoryChange(categoryId, subcategory);
  };

  return (
    <div className="category-navigation">
      <div className="category-header">
        <h3 className="category-title">Shop by Category</h3>
      </div>
      
      <div className="category-grid">
        {showAll && (
          <div 
            className={`category-card ${!selectedCategory ? 'active' : ''}`}
            onClick={() => onCategoryChange(null)}
          >
            <div className="category-icon">🛍️</div>
            <div className="category-info">
              <h4 className="category-name">All Products</h4>
              <p className="category-description">Browse all available products</p>
            </div>
          </div>
        )}
        
        {categories.map(category => (
          <div key={category.id} className="category-container">
            <div 
              className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
              style={{ borderColor: selectedCategory === category.id ? category.color : 'transparent' }}
            >
              <div className="category-icon" style={{ backgroundColor: category.color + '20' }}>
                {category.icon}
              </div>
              <div className="category-info">
                <h4 className="category-name">{category.name}</h4>
                <p className="category-description">{category.description}</p>
              </div>
              <div className="category-arrow">
                <span>{expandedCategory === category.id ? '▼' : '▶'}</span>
              </div>
            </div>
            
            {expandedCategory === category.id && (
              <div className="subcategory-list">
                {category.subcategories.map(subcategory => (
                  <div 
                    key={subcategory}
                    className="subcategory-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubcategoryClick(category.id, subcategory);
                    }}
                  >
                    <span className="subcategory-name">{subcategory}</span>
                    <span className="subcategory-arrow">→</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryNavigation;
