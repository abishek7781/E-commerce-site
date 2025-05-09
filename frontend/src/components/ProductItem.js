import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductItem = ({ product }) => {
  const { addToCart, cartItems } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isAdded = cartItems.some(item => item.id === product.id);

  // Sample image URL if product.image is not provided
  const imageUrl = product.image || 'https://via.placeholder.com/240x160.png?text=Product+Image';

  return (
    <div className="product-item">
      <img src={imageUrl} alt={product.name} style={{ width: '100%', borderRadius: '8px', marginBottom: '15px' }} />
      <h3>{product.name}</h3>
      <div className="price">₹{product.price}</div>
      <button onClick={handleAddToCart} disabled={isAdded || added} className={isAdded || added ? 'added' : ''}>
        {isAdded || added ? 'Added!' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductItem;
