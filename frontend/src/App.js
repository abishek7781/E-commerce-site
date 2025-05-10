import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import AdminPanel from './pages/AdminPanel';
import Orders from './pages/Orders';
import { CartProvider } from './context/CartContext';
import { RealTimeProvider } from './context/RealTimeContext';

const AppContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userEmail, setUserEmail] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email) {
      setUserEmail(user.email);
    } else {
      setUserEmail(null);
    }
  }, [location]);

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  // Do not show Navbar on login and register pages
  const hideNavbarPaths = ['/', '/login', '/register'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar onSearch={handleSearch} />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home searchTerm={searchTerm} />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders userEmail={userEmail} />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <CartProvider>
      <RealTimeProvider>
        <Router>
          <AppContent />
        </Router>
      </RealTimeProvider>
    </CartProvider>
  );
};

export default App;
