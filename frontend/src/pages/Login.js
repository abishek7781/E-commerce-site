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
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Login failed');
      } else {
        localStorage.setItem('user', JSON.stringify({ email, name: data.name }));
        navigate('/home');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '3rem auto',
      padding: '2rem',
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      color: '#222',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h2 style={{ color: '#007acc', marginBottom: '1.5rem', textAlign: 'center' }}>Login to NammaCart</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {error && <p style={{ color: '#d32f2f', textAlign: 'center' }}>{error}</p>}
        <label htmlFor="email" style={{ fontWeight: '600' }}>Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          style={{
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #007acc',
            background: '#fff',
            color: '#222',
            fontSize: '1rem'
          }}
        />
        <label htmlFor="password" style={{ fontWeight: '600' }}>Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          style={{
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #007acc',
            background: '#fff',
            color: '#222',
            fontSize: '1rem'
          }}
        />
        <button type="submit" style={{
          marginTop: '1rem',
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
          Login
        </button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        New user? <Link to="/register" style={{ color: '#007acc', fontWeight: '600' }}>Register now</Link>
      </p>
    </div>
  );
};

export default Login;
