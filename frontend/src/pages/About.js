import React, { useState } from 'react';

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '4rem auto',
    padding: '2rem',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: '2rem',
    position: 'relative',
    paddingBottom: '1.5rem',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: '0',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80px',
      height: '4px',
      backgroundColor: '#2b9348',
      borderRadius: '2px'
    }
  },
  text: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#4a4a4a',
    maxWidth: '800px',
    margin: '0 auto 3rem',
    textAlign: 'center'
  },
  connectTitle: {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: '2rem'
  },
  form: {
    maxWidth: '600px',
    margin: '0 auto 3rem',
    display: 'flex',
    gap: '1rem',
    position: 'relative'
  },
  input: {
    flex: 1,
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    fontSize: '1rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:focus': {
      outline: 'none',
      borderColor: '#2b9348',
      boxShadow: '0 0 0 4px rgba(43,147,72,0.1)'
    }
  },
  button: {
    padding: '1rem 2rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2b9348',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    '&:hover': {
      backgroundColor: '#007f5f',
      transform: 'translateY(-2px)'
    }
  },
  submittedMessage: {
    backgroundColor: '#e3fcef',
    color: '#006644',
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    margin: '2rem auto',
    maxWidth: '600px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    border: '1px solid #a2f5bf'
  },
  profileContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  profileCard: {
    textAlign: 'center',
    padding: '1.5rem',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-8px)'
    }
  },
  profileImage: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '1rem',
    border: '3px solid #e0e0e0',
    transition: 'all 0.3s ease'
  },
  profileName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0'
  }
};

const About = () => {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setText('');
  };

  const profileIcons = [
    { id: 1, src: 'https://img.freepik.com/premium-vector/symbol-male-user-icon-circle-profile-icon-vector-illustration_276184-154.jpg', alt: 'Profile 1', name: 'Dinesh' },
    { id: 2, src: 'https://img.freepik.com/premium-vector/symbol-male-user-icon-circle-profile-icon-vector-illustration_276184-154.jpg', alt: 'Profile 2', name: 'Ajith' },
    { id: 3, src: 'https://img.freepik.com/premium-vector/symbol-male-user-icon-circle-profile-icon-vector-illustration_276184-154.jpg', alt: 'Profile 3', name: 'Naresh' },
    { id: 4, src: 'https://img.freepik.com/premium-vector/symbol-male-user-icon-circle-profile-icon-vector-illustration_276184-154.jpg', alt: 'Profile 4', name: 'Sathish' },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>About Our Platform</h1>
      <p style={styles.text}>
        Welcome to our cutting-edge e-commerce platform built with React and Flask. 
        We combine modern technology with user-centric design to deliver an exceptional 
        shopping experience that prioritizes speed, security, and satisfaction.
      </p>

      <h2 style={styles.connectTitle}>Connect With Our Team</h2>
      {submitted ? (
        <div style={styles.submittedMessage}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#006644">
            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
          </svg>
          Thank you for your message! Our team will respond within 24 hours.
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="How can we help you?"
              required
              style={styles.input}
            />
            <button
              type="submit"
              style={styles.button}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
              Send Message
            </button>
          </form>
          <div style={styles.profileContainer}>
            {profileIcons.map(icon => (
              <div key={icon.id} style={styles.profileCard}>
                <img
                  src={icon.src}
                  alt={icon.alt}
                  style={styles.profileImage}
                />
                <h3 style={styles.profileName}>{icon.name}</h3>
                <p style={{ color: '#6c757d', margin: '0.5rem 0' }}>Full Stack Developer</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button style={{ 
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #e0e0e0',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#f8f9fa'
                    }
                  }}>
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default About;