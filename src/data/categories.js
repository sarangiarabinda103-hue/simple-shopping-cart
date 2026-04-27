export const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: '📱',
    description: 'Smartphones, laptops, headphones & more',
    color: '#007bff',
    subcategories: ['Smartphones', 'Laptops', 'Headphones', 'Cameras', 'Tablets']
  },
  {
    id: 'clothing',
    name: "Men's Fashion",
    icon: '👔',
    description: 'Shirts, pants, shoes & accessories',
    color: '#28a745',
    subcategories: ['Shirts', 'Pants', 'Shoes', 'Accessories', 'Watches']
  },
  {
    id: 'womens-clothing',
    name: "Women's Fashion",
    icon: '👗',
    description: 'Dresses, tops, shoes & accessories',
    color: '#e91e63',
    subcategories: ['Dresses', 'Tops', 'Shoes', 'Bags', 'Jewelry']
  },
  {
    id: 'home',
    name: 'Home & Kitchen',
    icon: '🏠',
    description: 'Furniture, appliances, decor & more',
    color: '#ff9800',
    subcategories: ['Furniture', 'Appliances', 'Decor', 'Kitchen', 'Bedding']
  },
  {
    id: 'beauty',
    name: 'Beauty & Health',
    icon: '💄',
    description: 'Skincare, makeup, health products',
    color: '#9c27b0',
    subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Health']
  },
  {
    id: 'sports',
    name: 'Sports & Outdoors',
    icon: '⚽',
    description: 'Equipment, apparel, outdoor gear',
    color: '#4caf50',
    subcategories: ['Fitness', 'Outdoor', 'Team Sports', 'Cycling', 'Running']
  },
  {
    id: 'books',
    name: 'Books & Media',
    icon: '📚',
    description: 'Books, movies, music & games',
    color: '#f44336',
    subcategories: ['Fiction', 'Non-Fiction', 'Movies', 'Music', 'Games']
  },
  {
    id: 'toys',
    name: 'Toys & Games',
    icon: '🎮',
    description: 'Toys, games, kids products',
    color: '#ff5722',
    subcategories: ['Action Figures', 'Board Games', 'Educational', 'Video Games', 'Outdoor']
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: '🚗',
    description: 'Car parts, accessories, tools',
    color: '#607d8b',
    subcategories: ['Parts', 'Accessories', 'Tools', 'Electronics', 'Care']
  },
  {
    id: 'jewelry',
    name: 'Jewelry & Watches',
    icon: '💍',
    description: 'Fine jewelry, watches, accessories',
    color: '#795548',
    subcategories: ['Rings', 'Necklaces', 'Earrings', 'Watches', 'Bracelets']
  },
  {
    id: 'grocery',
    name: 'Grocery & Food',
    icon: '🛒',
    description: 'Food, beverages, household essentials',
    color: '#8bc34a',
    subcategories: ['Fresh Food', 'Beverages', 'Snacks', 'Household', 'Organic']
  },
  {
    id: 'pet',
    name: 'Pet Supplies',
    icon: '🐕',
    description: 'Food, toys, accessories for pets',
    color: '#03a9f4',
    subcategories: ['Dog', 'Cat', 'Bird', 'Fish', 'Small Pets']
  }
];

export const getCategoryById = (id) => {
  return categories.find(cat => cat.id === id);
};

export const getCategoryByName = (name) => {
  return categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
};

export default categories;
