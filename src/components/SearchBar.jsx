import React, { useState, useRef, useEffect } from 'react';
import { useSearch } from '../hooks/useSearch';

const SearchBar = ({ onSearchChange, placeholder = 'Search products...' }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  
  const { results, loading, error, hasSearched, clearResults, isQueryValid } = useSearch(query);

  // Pass search results to parent - use ref to avoid infinite loops
  const prevSearchDataRef = useRef();
  
  useEffect(() => {
    const currentSearchData = {
      query,
      results,
      loading,
      error,
      hasSearched,
      isQueryValid
    };
    
    // Only call onSearchChange if the data actually changed
    if (onSearchChange) {
      const prevData = prevSearchDataRef.current;
      if (!prevData || 
          prevData.query !== currentSearchData.query ||
          prevData.results !== currentSearchData.results ||
          prevData.loading !== currentSearchData.loading ||
          prevData.error !== currentSearchData.error ||
          prevData.hasSearched !== currentSearchData.hasSearched ||
          prevData.isQueryValid !== currentSearchData.isQueryValid) {
        onSearchChange(currentSearchData);
        prevSearchDataRef.current = currentSearchData;
      }
    }
  }, [query, results, loading, error, hasSearched, isQueryValid, onSearchChange]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    clearResults();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setQuery('');
      clearResults();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isQueryValid) {
      // Search is already triggered by the hook
      inputRef.current?.blur();
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className={`search-input-container ${isFocused ? 'focused' : ''}`}>
          <div className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="search-input"
            autoComplete="off"
          />
          
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="search-clear-button"
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
          
          {loading && (
            <div className="search-loading">
              <div className="search-spinner"></div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="search-error">
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
