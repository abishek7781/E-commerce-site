import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [listening, setListening] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Hide navbar on login and register pages
  if (location.pathname === '/' || location.pathname === '/register') {
    return null;
  }

  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user && user.name ? user.name : '';

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Voice search using Web Speech API
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setListening(false);
      if (onSearch) {
        onSearch(transcript);
      }
    };

    recognition.onerror = (event) => {
      setListening(false);
      alert('Error occurred in speech recognition: ' + event.error);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <nav className="navbar" style={{ position: 'relative' }}>
      <div className="navbar-left">
        <Link to="/" className="site-name">NammaCart</Link>
      </div>
      <button
        className="hamburger"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.5rem',
          color: '#007acc',
          position: 'absolute',
          top: '10px',
          right: '50px',
          zIndex: 1001,
        }}
      >
        &#9776;
      </button>
      <button
        onClick={handleVoiceSearch}
        aria-label="Voice Search"
        style={{
          background: listening ? '#007acc' : 'none',
          border: '2px solid #007acc',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          cursor: 'pointer',
          color: listening ? '#fff' : '#007acc',
          fontSize: '18px',
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1002,
        }}
        title={listening ? 'Listening...' : 'Voice Search'}
      >
        🎤
      </button>
      <div
        className="navbar-right"
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <Link to="/home">Home</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/about">About</Link>
        {user ? (
          <>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .hamburger {
            display: block !important;
          }
          .navbar-right {
            display: ${menuOpen ? 'flex' : 'none'};
            flex-direction: column;
            position: absolute;
            top: 50px;
            right: 10px;
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1000;
          }
          .navbar-right a, .navbar-right button {
            padding: 0.5rem 0;
            width: 100%;
            text-align: right;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
