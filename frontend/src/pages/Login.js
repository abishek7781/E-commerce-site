import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check for admin credentials (hardcoded for demo)
    if (email === 'admin@example.com' && password === 'admin123') {
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.removeItem('user');
      navigate('/admin');
      return;
    }

    // Normal user login
    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      localStorage.setItem('user', JSON.stringify({ email }));
      localStorage.removeItem('adminLoggedIn');
      navigate('/home');
    } catch (err) {
      setError('Login failed: ' + err.message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login to NammaCart</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <p className="login-error">{error}</p>}
        <label htmlFor="email" className="login-label">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="login-input"
        />
        <label htmlFor="password" className="login-label">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          className="login-input"
        />
        <button
          type="submit"
          className="login-button"
        >
          Login
        </button>
        <p className="login-link">
          New user? <Link to="/register">Register now</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
