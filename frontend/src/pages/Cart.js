import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [address, setAddress] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const formatPrice = (price) => {
    return `₹${price}`;
  };

  const handleOrder = () => {
    if (!address) {
      alert('Please enter your address to place the order.');
      return;
    }
    // TODO: Implement order submission logic (e.g., API call)
    cartItems.forEach(item => removeFromCart(item.id));
    setOrderPlaced(true);
    setOrderMessage('Thank you for your order! Your products will be shipped soon.');
  };

  return (
    <div className="page cart-page">
      <h1>Your Cart</h1>
      {cartItems.length === 0 && !orderPlaced ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image || 'https://electronicparadise.in/cdn/shop/files/5_df7b1222-8a60-4b6b-bb78-f873cc6408a4.png?v=1702452453&width=1406'} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: {formatPrice(item.price * item.quantity)}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="remove-button">Remove</button>
              </div>
            ))}
          </div>
          <h3 className="total-price">Total: {formatPrice(totalPrice)}</h3>
          {!orderPlaced ? (
            <>
              <label htmlFor="address">Shipping Address:</label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your shipping address"
                rows={4}
                className="address-input"
              />
              <button onClick={handleOrder} className="checkout-button">Checkout</button>
            </>
          ) : (
            <p className="order-message">{orderMessage}</p>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
