import React, { useState } from 'react';

const About = () => {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just simulate submission
    setSubmitted(true);
    setText('');
    // In a real app, you would send the text to your backend or email service here
  };

  const profileIcons = [
    { id: 1, src: 'https://img.freepik.com/premium-vector/symbol-male-user-icon-circle-profile-icon-vector-illustration_276184-154.jpg', alt: 'Profile 1', name: 'Dinesh' },
    { id: 2, src: 'https://img.freepik.com/premium-vector/symbol-male-user-icon-circle-profile-icon-vector-illustration_276184-154.jpg', alt: 'Profile 2', name: 'Ajith' },
    { id: 3, src: 'https://img.freepik.com/premium-vector/symbol-male-user-icon-circle-profile-icon-vector-illustration_276184-154.jpg', alt: 'Profile 3', name: 'Naresh' },
    { id: 4, src: 'https://img.freepik.com/premium-vector/symbol-male-user-icon-circle-profile-icon-vector-illustration_276184-154.jpg', alt: 'Profile 4', name: 'Sathish' },
  ];

  return (
    <div style={{
      maxWidth: '600px',
      margin: '7rem auto 2rem auto',  // Added top margin to avoid hiding behind navbar
      padding: '2rem',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#222',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#2874f0', marginBottom: '1.5rem' }}>About Us</h1>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
        Welcome to our e-commerce platform built with React and Flask. We strive to provide the best shopping experience.
      </p>

      <h2 style={{ color: '#2874f0', marginBottom: '1rem' }}>Connect With Us</h2>
      {submitted ? (
        <p style={{ fontSize: '1.1rem', color: 'green' }}>Thank you for connecting with us! We will get back to you soon.</p>
      ) : (
        <>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your message"
              required
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '0.75rem',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontFamily: 'inherit',
                color: '#222'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#2874f0',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '1rem',
                transition: 'background-color 0.3s ease',
                fontFamily: 'inherit',
                width: '100%',
                maxWidth: '400px'
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1a5bb8')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2874f0')}
            >
              Send
            </button>
          </form>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            {profileIcons.map(icon => (
              <div key={icon.id} style={{ textAlign: 'center' }}>
                <img
                  src={icon.src}
                  alt={icon.alt}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
                />
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#555' }}>{icon.name}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default About;
