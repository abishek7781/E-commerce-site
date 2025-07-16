import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import siteNameImg from '../site_name.png';

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
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/home" className="site-name">
          <img src={siteNameImg} alt="Site Name" style={{ height: '60px', width: 'auto', objectFit: 'contain' , marginRight: '30px' }} />
        </Link>
      </div>
      <div
        className={`navbar-right ${menuOpen ? 'open' : ''}`}
      >
        <button
          className="hamburger"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          &#9776;
        </button>
        {menuOpen && (
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="close-menu-button"
          >
            &times;
          </button>
        )}
        <Link to="/home">Home</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/about">About</Link>
        <button
          onClick={handleVoiceSearch}
          aria-label="Voice Search"
          className={`voice-search-button ${listening ? 'listening' : ''}`}
          title={listening ? 'Listening...' : 'Voice Search'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M8 12a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3z"/>
            <path d="M5 8a3 3 0 0 0 6 0H5z"/>
            <path d="M8 14a5 5 0 0 0 5-5h-1a4 4 0 0 1-8 0H3a5 5 0 0 0 5 5z"/>
            <path d="M7.5 15h1v1h-1v-1z"/>
          </svg>
        </button>
        <button
          onClick={handleLogout}
          style={{ marginLeft: 'auto', padding: '6px 12px', cursor: 'pointer', color:'white', backgroundColor:'red' }}
          aria-label="Logout"
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
