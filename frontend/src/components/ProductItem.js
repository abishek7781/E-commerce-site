import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { RealTimeContext } from '../context/RealTimeContext';

const ProductItem = ({ product }) => {
  const { addToCart, cartItems } = useContext(CartContext);
  const { stockUpdates, updateStock } = useContext(RealTimeContext);
  const [stock, setStock] = useState(product.stock ?? 10); // default stock 10 if not provided

  useEffect(() => {
    if (stockUpdates && stockUpdates[product.id] !== undefined) {
      setStock(stockUpdates[product.id]);
    }
  }, [stockUpdates, product.id]);

  const isAdded = cartItems.some(item => item.id === product.id);
  const isOutOfStock = stock === 0;

  const handleAddToCart = () => {
    if (stock > 0 && !isAdded) {
      addToCart(product);
      // Reduce stock by 1 and notify backend via socket
      const newStock = stock - 1;
      setStock(newStock);
      updateStock(product.id, newStock);
    }
  };

  // Sample image URL if product.image is not provided
  const imageUrl = product.image || 'https://via.placeholder.com/240x160.png?text=Product+Image';

  return (
    <div
      className="product-item card"
      style={{
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        backgroundColor: 'white',
      }}
    >
      <img
        src={imageUrl}
        alt={product.name}
        style={{ width: '100%', borderRadius: '8px', marginBottom: '15px', objectFit: 'contain', height: '160px' }}
      />
      <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>{product.name}</h3>
      <div className="price" style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fb641b', marginBottom: '0.5rem' }}>
        ₹{product.price}
      </div>
      <div
        className="stock-status"
        style={{
          marginBottom: '10px',
          color: isOutOfStock ? '#ff3d00' : '#388e3c',
          fontWeight: '600',
          fontSize: '0.9rem',
          border: '1px solid',
          borderColor: isOutOfStock ? '#ff3d00' : '#388e3c',
          borderRadius: '12px',
          padding: '2px 8px',
          display: 'inline-block',
        }}
      >
        {isOutOfStock ? 'Out of Stock' : `In Stock: ${stock}`}
      </div>
      <button
        onClick={handleAddToCart}
        disabled={isAdded || isOutOfStock}
        className={isAdded ? 'added' : ''}
        style={{
          backgroundColor: isOutOfStock ? '#ccc' : '#2874f0',
          color: '#fff',
          border: 'none',
          padding: '0.6rem 1.2rem',
          borderRadius: '8px',
          cursor: isOutOfStock || isAdded ? 'not-allowed' : 'pointer',
          fontWeight: '700',
          transition: 'background-color 0.3s ease',
          width: '100%',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
        onMouseEnter={(e) => {
          if (!isOutOfStock && !isAdded) e.currentTarget.style.backgroundColor = '#1a5bb8';
        }}
        onMouseLeave={(e) => {
          if (!isOutOfStock && !isAdded) e.currentTarget.style.backgroundColor = '#2874f0';
        }}
      >
        {isAdded ? 'Added' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductItem;
