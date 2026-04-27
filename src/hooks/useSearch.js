import { useState, useEffect } from 'react';
import productService from '../services/productService';
import { useDebounce } from './useDebounce';

export const useSearch = (query = '', minQueryLength = 2) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedQuery || debouncedQuery.length < minQueryLength) {
        setResults([]);
        setLoading(false);
        setHasSearched(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setHasSearched(true);

        // Search across multiple APIs
        const searchPromises = [
          // Search in Dummy JSON API
          productService.searchProducts(debouncedQuery, 20).catch(err => {
            console.warn('Dummy JSON search failed:', err);
            return [];
          }),
          // Search in Fake Store API (by getting all products and filtering)
          productService.fetchFakeStoreProducts(50).then(products => 
            products.filter(product => 
              product.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
              product.description.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
              product.category.toLowerCase().includes(debouncedQuery.toLowerCase())
            )
          ).catch(err => {
            console.warn('Fake Store search failed:', err);
            return [];
          })
        ];

        const [dummyResults, fakeStoreResults] = await Promise.all(searchPromises);
        
        // Combine and deduplicate results
        const allResults = [...dummyResults, ...fakeStoreResults];
        const uniqueResults = allResults.filter((product, index, self) =>
          index === self.findIndex((p) => 
            p.name.toLowerCase() === product.name.toLowerCase() ||
            (p.id && p.id === product.id)
          )
        );

        // Sort by relevance (exact matches first)
        const sortedResults = uniqueResults.sort((a, b) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();
          const queryLower = debouncedQuery.toLowerCase();
          
          const aExactMatch = aName.includes(queryLower);
          const bExactMatch = bName.includes(queryLower);
          
          if (aExactMatch && !bExactMatch) return -1;
          if (!aExactMatch && bExactMatch) return 1;
          
          return aName.localeCompare(bName);
        });

        setResults(sortedResults);
      } catch (err) {
        console.error('Search failed:', err);
        setError(err.message || 'Search failed');
        
        // Fallback to local products
        try {
          const { products: localProducts } = await import('../data/products');
          const filteredProducts = localProducts.filter(product =>
            product.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(debouncedQuery.toLowerCase())
          );
          setResults(filteredProducts);
          setError(null);
        } catch (fallbackErr) {
          console.error('Fallback search failed:', fallbackErr);
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [debouncedQuery, minQueryLength]);

  const clearResults = () => {
    setResults([]);
    setHasSearched(false);
    setError(null);
  };

  return {
    results,
    loading,
    error,
    hasSearched,
    clearResults,
    isQueryValid: query.length >= minQueryLength
  };
};

export default useSearch;
