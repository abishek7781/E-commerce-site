import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add real authentication logic here
    if (email && password) {
      localStorage.setItem('user', JSON.stringify({ email }));
      navigate('/home');
    } else {
      setError('Please enter email and password');
    }
  };

  return (
    <div className="login-card">
      <h2>Login to ShopSphere</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <button type="submit">Login</button>
        <p className="register-link">
        New user? <Link to="/register">Register now</Link>
      </p>
      </form>
      
    </div>
  );
};

export default Login;
