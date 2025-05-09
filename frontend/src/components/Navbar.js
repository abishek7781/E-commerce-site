import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ onSearch }) => {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.warn('Speech Recognition API not supported');
      return;
    }
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.lang = 'en-US';
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onSearch(transcript);
      setListening(false);
    };

    recog.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setListening(false);
    };

    recog.onend = () => {
      setListening(false);
    };

    setRecognition(recog);
  }, [onSearch]);

  const toggleListening = () => {
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.start();
      setListening(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Hide navbar on login and register pages
  if (location.pathname === '/' || location.pathname === '/register') {
    return null;
  }

  const user = JSON.parse(localStorage.getItem('user'));

  // Extract name from user object or fallback to empty string
  const userName = user && user.name ? user.name : '';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="site-name">ShopSphere</Link>
      </div>
      <div className="navbar-right">
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => onSearch(e.target.value)}
          className="search-input"
        />
        <button onClick={toggleListening} className="voice-search-button" title="Voice Search">
          {listening ? '🎙️ Listening...' : '🎤'}
        </button>
        <Link to="/about">About</Link>
        <Link to="/cart">Cart</Link>
        {user && user.isAdmin && <Link to="/admin">Admin Panel</Link>}
        {user ? (
          <>
            <span className="greeting">Hello, {userName}</span>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
