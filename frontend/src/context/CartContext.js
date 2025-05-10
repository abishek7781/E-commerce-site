import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const getUserEmail = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.email) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    };

    getUserEmail();

    window.addEventListener('storage', getUserEmail);
    return () => window.removeEventListener('storage', getUserEmail);
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/cart/' + encodeURIComponent(userEmail));
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartItems([]);
      }
    };
    if (userEmail) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [userEmail]);

  useEffect(() => {
    const saveCart = async () => {
      try {
        await fetch('http://localhost:5001/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_email: userEmail, items: cartItems }),
        });
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };
    if (userEmail) {
      saveCart();
    }
  }, [cartItems, userEmail]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
