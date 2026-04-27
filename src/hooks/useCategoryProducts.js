import { useState, useEffect } from 'react';
import productService from '../services/productService';
import { getCategoryById } from '../data/categories';

export const useCategoryProducts = (categoryId, subcategory = null) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Set category info first
        if (categoryId) {
          const catInfo = getCategoryById(categoryId);
          setCategoryInfo(catInfo);
        } else {
          setCategoryInfo(null);
        }
        
        let fetchedProducts = [];
        
        if (!categoryId) {
          // Always start with local products immediately
          const { products: localProducts } = await import('../data/products');
          fetchedProducts = localProducts;
          console.log(`Loaded ${fetchedProducts.length} local products`);
          
          // Try to enhance with API products in background
          try {
            const apiProducts = await productService.fetchAllProducts();
            console.log(`Got ${apiProducts.length} API products`);
            
            if (apiProducts.length > 0) {
              // Combine and deduplicate
              const allProducts = [...apiProducts, ...localProducts];
              fetchedProducts = allProducts.filter((product, index, self) =>
                index === self.findIndex((p) => p.name.toLowerCase() === product.name.toLowerCase())
              );
              console.log(`Combined to ${fetchedProducts.length} total products`);
            }
          } catch (err) {
            console.warn('API products failed, keeping local products:', err);
            // Keep local products that were already set
          }
        } else {
          // Category-specific filtering - start with local products
          const { products: localProducts } = await import('../data/products');
          
          const categoryMapping = {
            'electronics': ['electronics', 'laptops', 'smartphones', 'audio', 'keyboards', 'tablets', 'wearables'],
            'clothing': ["men's clothing", 'clothing'],
            'womens-clothing': ["women's clothing"],
            'jewelry': ['jewelry'],
            'home': ['home'],
            'beauty': ['beauty'],
            'sports': ['sports'],
            'books': ['books'],
            'toys': ['toys'],
            'automotive': ['automotive'],
            'grocery': ['grocery'],
            'pet': ['pet']
          };
          
          const categoryKeywords = categoryMapping[categoryId] || [categoryId];
          
          // Filter local products first
          fetchedProducts = localProducts.filter(product => {
            const productCategory = product.category.toLowerCase();
            const productName = product.name.toLowerCase();
            
            return categoryKeywords.some(keyword => 
              productCategory.includes(keyword.toLowerCase()) ||
              productName.includes(keyword.toLowerCase())
            );
          });
          
          console.log(`Found ${fetchedProducts.length} local products for category ${categoryId}`);
          
          // Try to enhance with API products
          try {
            const apiProducts = await productService.fetchAllProducts();
            console.log(`Got ${apiProducts.length} API products for category enhancement`);
            
            if (apiProducts.length > 0) {
              const apiFiltered = apiProducts.filter(product => {
                const productCategory = product.category.toLowerCase();
                const productName = product.name.toLowerCase();
                
                return categoryKeywords.some(keyword => 
                  productCategory.includes(keyword.toLowerCase()) ||
                  productName.includes(keyword.toLowerCase())
                );
              });
              
              // Combine and deduplicate
              const allCategoryProducts = [...apiFiltered, ...fetchedProducts];
              fetchedProducts = allCategoryProducts.filter((product, index, self) =>
                index === self.findIndex((p) => p.name.toLowerCase() === product.name.toLowerCase())
              );
              
              console.log(`Enhanced to ${fetchedProducts.length} total products for category ${categoryId}`);
            }
          } catch (err) {
            console.warn('API enhancement failed, keeping local products:', err);
            // Keep local products that were already filtered
          }
        }
        
        // Filter by subcategory if specified
        if (subcategory && fetchedProducts.length > 0) {
          fetchedProducts = fetchedProducts.filter(product =>
            product.name.toLowerCase().includes(subcategory.toLowerCase()) ||
            product.description.toLowerCase().includes(subcategory.toLowerCase()) ||
            product.category.toLowerCase().includes(subcategory.toLowerCase())
          );
        }
        
        setProducts(fetchedProducts);
        
      } catch (err) {
        console.error('Failed to fetch category products:', err);
        setError(err.message || 'Failed to load products');
        
        // Final fallback - local products only
        try {
          const { products: localProducts } = await import('../data/products');
          let filteredProducts = localProducts;
          
          if (categoryId) {
            const categoryMapping = {
              'electronics': ['electronics', 'laptops', 'smartphones', 'audio', 'keyboards', 'tablets', 'wearables'],
              'clothing': ["men's clothing", 'clothing'],
              'womens-clothing': ["women's clothing"],
              'jewelry': ['jewelry'],
              'home': ['home'],
              'beauty': ['beauty'],
              'sports': ['sports'],
              'books': ['books'],
              'toys': ['toys'],
              'automotive': ['automotive'],
              'grocery': ['grocery'],
              'pet': ['pet']
            };
            
            const categoryKeywords = categoryMapping[categoryId] || [categoryId];
            
            filteredProducts = localProducts.filter(product => {
              const productCategory = product.category.toLowerCase();
              const productName = product.name.toLowerCase();
              
              return categoryKeywords.some(keyword => 
                productCategory.includes(keyword.toLowerCase()) ||
                productName.includes(keyword.toLowerCase())
              );
            });
          }
          
          setProducts(filteredProducts);
          setError(null);
        } catch (fallbackErr) {
          console.error('Even local products failed:', fallbackErr);
          setError('Failed to load any products');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryId, subcategory]);

  const refetch = () => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let fetchedProducts = [];
        
        if (!categoryId) {
          fetchedProducts = await productService.fetchAllProducts();
        } else {
          const categoryMapping = {
            'electronics': 'electronics',
            'clothing': "men's clothing",
            'womens-clothing': "women's clothing",
            'jewelry': 'jewelry',
            'home': 'home',
            'beauty': 'beauty',
            'sports': 'sports',
            'books': 'books',
            'toys': 'toys',
            'automotive': 'automotive',
            'grocery': 'grocery',
            'pet': 'pet'
          };
          
          const apiCategory = categoryMapping[categoryId] || categoryId;
          
          try {
            fetchedProducts = await productService.fetchProductsByCategory(apiCategory, 20);
          } catch {
            const allProducts = await productService.fetchAllProducts();
            fetchedProducts = allProducts.filter(product => 
              product.category.toLowerCase().includes(apiCategory.toLowerCase()) ||
              product.name.toLowerCase().includes(apiCategory.toLowerCase())
            );
          }
        }
        
        if (subcategory && fetchedProducts.length > 0) {
          fetchedProducts = fetchedProducts.filter(product =>
            product.name.toLowerCase().includes(subcategory.toLowerCase()) ||
            product.description.toLowerCase().includes(subcategory.toLowerCase())
          );
        }
        
        setProducts(fetchedProducts);
        
      } catch (err) {
        console.error('Failed to refetch category products:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  };

  return { products, loading, error, categoryInfo, refetch };
};

export default useCategoryProducts;
