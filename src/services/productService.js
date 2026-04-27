// Product service for fetching products from REST APIs

const FAKE_STORE_API = 'https://fakestoreapi.com/products';
const DUMMY_JSON_API = 'https://dummyjson.com/products';

// Transform API data to our product format
const transformFakeStoreProduct = (product) => ({
  id: product.id,
  name: product.title,
  category: product.category.charAt(0).toUpperCase() + product.category.slice(1),
  price: product.price,
  originalPrice: Math.round(product.price * 1.2 * 100) / 100,
  image: product.image,
  description: product.description,
  rating: product.rating.rate,
  reviews: product.rating.count,
  inStock: true, // Always in stock for demo
  badge: Math.random() > 0.7 ? getRandomBadge() : null,
  specs: generateSpecs(product.category)
});

const transformDummyJsonProduct = (product) => ({
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
  specs: [
    `Stock: ${product.stock}`,
    `Brand: ${product.brand || 'Generic'}`,
    `Discount: ${product.discountPercentage || 0}%`
  ]
});

const getRandomBadge = () => {
  const badges = ['Best Seller', 'New', 'Top Rated', 'Popular', 'Limited'];
  return badges[Math.floor(Math.random() * badges.length)];
};

const generateSpecs = (category) => {
  const categorySpecs = {
    electronics: ['Fast Shipping', '1 Year Warranty', 'Tech Support'],
    clothing: ['Premium Quality', 'Machine Washable', 'Available in Multiple Sizes'],
    jewelry: ['Hypoallergenic', 'Gift Box Included', 'Certificate of Authenticity'],
    'women\'s clothing': ['Trendy Design', 'Comfortable Fit', 'Seasonal Collection'],
    'men\'s clothing': ['Classic Style', 'Durable Material', 'Easy Care']
  };
  
  return categorySpecs[category] || ['High Quality', 'Fast Delivery', 'Customer Support'];
};

// Fetch products from Fake Store API
export const fetchFakeStoreProducts = async (limit = 20) => {
  try {
    const response = await fetch(`${FAKE_STORE_API}?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.map(transformFakeStoreProduct);
  } catch (error) {
    console.error('Error fetching from Fake Store API:', error);
    throw error;
  }
};

// Fetch products from Dummy JSON API
export const fetchDummyJsonProducts = async (limit = 20) => {
  try {
    const response = await fetch(`${DUMMY_JSON_API}?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.products.map(transformDummyJsonProduct);
  } catch (error) {
    console.error('Error fetching from Dummy JSON API:', error);
    throw error;
  }
};

// Fetch products by category from Fake Store API
export const fetchProductsByCategory = async (category, limit = 10) => {
  try {
    const response = await fetch(`${FAKE_STORE_API}/category/${category}?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.map(transformFakeStoreProduct);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// Get all available categories from Fake Store API
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${FAKE_STORE_API}/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Search products from Dummy JSON API
export const searchProducts = async (query, limit = 10) => {
  try {
    const response = await fetch(`${DUMMY_JSON_API}/search?q=${query}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.products.map(transformDummyJsonProduct);
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Combined function to fetch products from multiple sources
export const fetchAllProducts = async () => {
  try {
    console.log('Fetching products from multiple APIs...');
    
    const [fakeStoreProducts, dummyJsonProducts] = await Promise.all([
      fetchFakeStoreProducts(20).catch(err => {
        console.warn('Fake Store API failed:', err);
        return [];
      }),
      fetchDummyJsonProducts(20).catch(err => {
        console.warn('Dummy JSON API failed:', err);
        return [];
      })
    ]);
    
    console.log('Fetched products:', { fakeStore: fakeStoreProducts.length, dummyJson: dummyJsonProducts.length });
    
    // Combine and remove duplicates based on name
    const allProducts = [...fakeStoreProducts, ...dummyJsonProducts];
    const uniqueProducts = allProducts.filter((product, index, self) =>
      index === self.findIndex((p) => p.name.toLowerCase() === product.name.toLowerCase())
    );
    
    console.log('Total unique products:', uniqueProducts.length);
    
    // If no products from APIs, fallback to local products
    if (uniqueProducts.length === 0) {
      console.log('No API products, falling back to local products');
      const { products: localProducts } = await import('../data/products');
      return localProducts;
    }
    
    return uniqueProducts;
  } catch (error) {
    console.error('Error fetching all products:', error);
    // Fallback to local products
    const { products: localProducts } = await import('../data/products');
    return localProducts;
  }
};

export default {
  fetchFakeStoreProducts,
  fetchDummyJsonProducts,
  fetchProductsByCategory,
  fetchCategories,
  searchProducts,
  fetchAllProducts
};
