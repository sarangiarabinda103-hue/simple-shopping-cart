import { useState, useEffect } from 'react';

export const useProducts = (dataSource = 'all') => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Starting to fetch products...');
        
        // First try to load local products immediately
        const { products: localProducts } = await import('../data/products');
        console.log('Loaded local products:', localProducts.length);
        
        // Set local products as fallback immediately
        setProducts(localProducts);
        setLoading(false);
        
        // Then try to fetch from APIs in background
        try {
          const FAKE_STORE_API = 'https://fakestoreapi.com/products';
          const DUMMY_JSON_API = 'https://dummyjson.com/products';
          
          const [fakeStoreResponse, dummyJsonResponse] = await Promise.allSettled([
            fetch(`${FAKE_STORE_API}?limit=10`),
            fetch(`${DUMMY_JSON_API}?limit=10`)
          ]);
          
          const apiProducts = [];
          
          // Process Fake Store API
          if (fakeStoreResponse.status === 'fulfilled' && fakeStoreResponse.value.ok) {
            const fakeStoreData = await fakeStoreResponse.value.json();
            const transformedFakeStore = fakeStoreData.map(product => ({
              id: product.id,
              name: product.title,
              category: product.category.charAt(0).toUpperCase() + product.category.slice(1),
              price: product.price,
              originalPrice: Math.round(product.price * 1.2 * 100) / 100,
              image: product.image,
              description: product.description,
              rating: product.rating.rate,
              reviews: product.rating.count,
              inStock: true,
              badge: Math.random() > 0.7 ? ['Best Seller', 'New', 'Top Rated'][Math.floor(Math.random() * 3)] : null,
              specs: ['Fast Shipping', '1 Year Warranty', 'Tech Support']
            }));
            apiProducts.push(...transformedFakeStore);
            console.log('Fake Store products loaded:', transformedFakeStore.length);
          }
          
          // Process Dummy JSON API
          if (dummyJsonResponse.status === 'fulfilled' && dummyJsonResponse.value.ok) {
            const dummyJsonData = await dummyJsonResponse.value.json();
            const transformedDummyJson = dummyJsonData.products.map(product => ({
              id: product.id,
              name: product.title,
              category: product.category,
              price: product.price,
              originalPrice: Math.round(product.price * 1.15 * 100) / 100,
              image: product.thumbnail || product.images?.[0],
              description: product.description,
              rating: product.rating,
              reviews: Math.floor(Math.random() * 500) + 50,
              inStock: product.stock > 0,
              badge: product.discountPercentage > 10 ? 'Sale' : null,
              specs: [`Stock: ${product.stock}`, `Brand: ${product.brand || 'Generic'}`]
            }));
            apiProducts.push(...transformedDummyJson);
            console.log('Dummy JSON products loaded:', transformedDummyJson.length);
          }
          
          // If we got API products, use them
          if (apiProducts.length > 0) {
            const uniqueProducts = apiProducts.filter((product, index, self) =>
              index === self.findIndex((p) => p.name.toLowerCase() === product.name.toLowerCase())
            );
            console.log('Setting API products:', uniqueProducts.length);
            setProducts(uniqueProducts);
          }
          
        } catch (apiError) {
          console.warn('API fetch failed, using local products:', apiError);
          // Keep local products that were already set
        }
        
      } catch (err) {
        console.error('Failed to load products:', err);
        setError(err.message || 'Failed to load products');
        
        // Final fallback - try local products
        try {
          const { products: localProducts } = await import('../data/products');
          setProducts(localProducts);
          setError(null);
        } catch (fallbackErr) {
          console.error('Even local products failed:', fallbackErr);
          setError('Failed to load any products');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [dataSource]);

  const refetch = () => {
    window.location.reload(); // Simple refresh for now
  };

  return { products, loading, error, refetch };
};

export default useProducts;
