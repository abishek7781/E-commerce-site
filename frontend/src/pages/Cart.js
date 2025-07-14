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

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '4rem auto',
        padding: '2rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        color: '#222',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#007acc', marginBottom: '1.5rem' }}>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/home" style={{ color: '#007acc', fontWeight: '600' }}>Go to Home Page</Link>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '900px',
      margin: '4rem auto 3rem',
      padding: '2rem',
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      color: '#222',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      gap: '2rem'
    }}>
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ color: '#007acc', marginBottom: '1rem' }}>Cart Items</h2>
        {cartItems.map(item => (
          <div key={item.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}>
            <img
              src={item.image || 'https://via.placeholder.com/120x90.png?text=Product+Image'}
              alt={item.name}
              style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.name}</h3>
              <p style={{ margin: '0.25rem 0' }}>Quantity: {item.quantity}</p>
              <p style={{ margin: '0.25rem 0', fontWeight: '600' }}>
                Price: {formatPrice(item.price * item.quantity)}
              </p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              style={{
                backgroundColor: '#d32f2f',
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#b71c1c'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#d32f2f'}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div style={{
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h2 style={{ color: '#007acc', marginBottom: '1rem' }}>Order Summary</h2>
        <p style={{ fontWeight: '600', fontSize: '1.2rem' }}>Total: {formatPrice(totalPrice)}</p>
        {!orderPlaced && (
          <>
            <label htmlFor="city" style={{ fontWeight: '600' }}>
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
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid #007acc',
                fontSize: '1rem'
              }}
            />
            <label htmlFor="pincode" style={{ fontWeight: '600' }}>
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
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid #007acc',
                fontSize: '1rem'
              }}
            />
            <button
              onClick={handleOrder}
              style={{
                width: '100%',
                backgroundColor: '#007acc',
                color: '#fff',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#005fa3'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007acc'}
            >
              Checkout
            </button>
          </>
        )}
        {showPopup && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: '#fff',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center'
            }}>
              <h2 style={{ color: '#007acc', marginBottom: '1rem' }}>Order Confirmed!</h2>
              <p>{orderMessage}</p>
              <p style={{ fontWeight: '600' }}>Total Paid: {formatPrice(orderTotal)}</p>
              <button
                onClick={closePopup}
                style={{
                  marginTop: '1rem',
                  backgroundColor: '#007acc',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#005fa3'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007acc'}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
