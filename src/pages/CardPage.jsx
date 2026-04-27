import { useCart } from "../hooks/useCart";

export default function CardPage() {
  const { cart, removeFromCart, debouncedUpdateQuantity, getCartTotal } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    debouncedUpdateQuantity(productId, parseInt(newQuantity));
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>
        <div className="empty-cart">
          <h3>Your cart is empty</h3>
          <p>Add some products to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>
      <div className="cart-content">
        <h2 className="cart-subtitle">Your Cart</h2>
        
        {/* Desktop Table View */}
        <div className="desktop-cart">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td className="quantity-cell">
                    <input
                      className="quantity-input"
                      min="1"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    />
                  </td>
                  <td>${item.price * item.quantity}</td>
                  <td>
                    <button 
                      className="remove-button"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="mobile-cart">
          {cart.map(item => (
            <div key={item.id} className="mobile-cart-item">
              <div className="mobile-item-header">
                <h4 className="mobile-item-name">{item.name}</h4>
                <button 
                  className="mobile-remove-button"
                  onClick={() => handleRemove(item.id)}
                >
                  ✕
                </button>
              </div>
              
              <div className="mobile-item-details">
                <div className="mobile-price-row">
                  <span className="mobile-price-label">Price:</span>
                  <span className="mobile-price">${item.price}</span>
                </div>
                
                <div className="mobile-quantity-row">
                  <span className="mobile-quantity-label">Qty:</span>
                  <div className="mobile-quantity-controls">
                    <button 
                      className="mobile-quantity-btn"
                      onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                    >
                      −
                    </button>
                    <input
                      className="mobile-quantity-input"
                      min="1"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    />
                    <button 
                      className="mobile-quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="mobile-subtotal-row">
                  <span className="mobile-subtotal-label">Subtotal:</span>
                  <span className="mobile-subtotal">${item.price * item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-total">Total: ${getCartTotal().toFixed(2)}</div>
      </div>
    </div>
  );
}