import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const formatPrice = (price) => {
    return `₹${price}`;
  };

  const handleOrder = async () => {
    if (!city || !pincode) {
      alert('Please enter your city and pincode to place the order.');
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user ? user.email : null;
    if (!userEmail) {
      alert('Please login to place an order.');
      return;
    }
    // Prepare order data
    const orderData = {
      user_email: userEmail,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      city,
      pincode,
      total_price: totalPrice,
    };

    try {
      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        throw new Error('Failed to place order');
      }
      const result = await response.json();
      setOrderTotal(totalPrice);
      cartItems.forEach(item => removeFromCart(item.id));
      setOrderPlaced(true);
      setOrderMessage('Thank you for your order! Your products will be shipped soon.');
      setShowPopup(true);
      // Navigate to orders page after order placement
      navigate('/orders');
    } catch (error) {
      alert(error.message);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setOrderPlaced(false);
    setOrderMessage('');
    setCity('');
    setPincode('');
    setOrderTotal(0);
  };

  return (
    <div className="page cart-page" style={{ maxWidth: '900px', margin: '2rem auto', padding: '4rem 1rem 1rem 1rem', position: 'relative' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: '#2874f0' }}>Your Cart</h1>
      {cartItems.length === 0 && !orderPlaced ? (
        <div style={{ fontSize: '1.2rem', color: '#555' }}>
          <p>Your cart is empty.</p>
          <Link to="/" style={{ color: '#2874f0', textDecoration: 'underline' }}>Go to Home Page</Link>
        </div>
      ) : (
        <>
          <div className="cart-items" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cartItems.map(item => (
              <div
                key={item.id}
                className="cart-item card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  backgroundColor: '#fff',
                }}
              >
                <img
                  src={item.image || 'https://via.placeholder.com/120x90.png?text=Product+Image'}
                  alt={item.name}
                  className="cart-item-image"
                  style={{ width: '120px', height: '90px', objectFit: 'contain', borderRadius: '8px', marginRight: '1rem' }}
                />
                <div className="cart-item-details" style={{ flex: '1' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: '600' }}>{item.name}</h3>
                  <p style={{ margin: '0.2rem 0', fontSize: '1rem' }}>Quantity: {item.quantity}</p>
                  <p style={{ margin: '0.2rem 0', fontSize: '1rem', fontWeight: '700', color: '#fb641b' }}>
                    Price: {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-button"
                  style={{
                    backgroundColor: '#ff3d00',
                    color: '#fff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#d32f2f')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ff3d00')}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          {!orderPlaced && (
            <>
              <h3 style={{ marginTop: '2rem', fontSize: '1.5rem', fontWeight: '700', color: '#2874f0' }}>
                Total: {formatPrice(totalPrice)}
              </h3>
              <label htmlFor="city" style={{ display: 'block', marginTop: '1.5rem', fontWeight: '600', fontSize: '1rem' }}>
                City:
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginTop: '0.5rem',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '1rem',
                }}
              />
              <label htmlFor="pincode" style={{ display: 'block', marginTop: '1rem', fontWeight: '600', fontSize: '1rem' }}>
                Pincode:
              </label>
              <input
                type="text"
                id="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter your pincode"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginTop: '0.5rem',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '1rem',
                }}
              />
              <button
                onClick={handleOrder}
                className="checkout-button"
                style={{
                  marginTop: '1rem',
                  backgroundColor: '#2874f0',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '1rem',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1a5bb8')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2874f0')}
              >
                Checkout
              </button>
            </>
          )}
        </>
      )}

      {showPopup && (
        <div
          className="order-popup"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            className="popup-content card"
            style={{
              backgroundColor: '#fff',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <h2 style={{ marginBottom: '1rem', color: '#388e3c' }}>Order Confirmed!</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{orderMessage}</p>
            <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>Total Paid: {formatPrice(orderTotal)}</p>
            <button
              onClick={closePopup}
              style={{
                marginTop: '1.5rem',
                backgroundColor: '#2874f0',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '1rem',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1a5bb8')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2874f0')}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
